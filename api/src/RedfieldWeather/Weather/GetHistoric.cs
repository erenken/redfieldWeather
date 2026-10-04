using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using RedfieldWeather.Repositories;

namespace RedfieldWeather.Weather;

public sealed class GetHistoric(IHistoricalWeatherRepository repository, ILogger<GetHistoric> logger)
{
    [Function("GetHistoric")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest request)
    {
        var days = 1;
        if (request.Query.TryGetValue("days", out var query)
            && (!int.TryParse(query, out days) || days is < 1 or > 30))
            return new BadRequestObjectResult(new { error = "days must be an integer between 1 and 30." });

        var historical = new List<JsonElement>();
        var cutoff = DateTimeOffset.UtcNow.AddDays(-days).ToUnixTimeSeconds();
        await foreach (var entity in repository.Get(days).WithCancellation(request.HttpContext.RequestAborted))
        {
            if (string.IsNullOrWhiteSpace(entity.Weather))
                continue;
            var weather = JsonSerializer.Deserialize<JsonElement>(entity.Weather);
            if (weather.GetProperty("generated_at").GetInt64() >= cutoff)
                historical.Add(weather);
        }

        logger.LogInformation("Returned {Count} historical observations", historical.Count);
        return new OkObjectResult(historical.OrderBy(weather => weather.GetProperty("generated_at").GetInt64()));
    }
}
