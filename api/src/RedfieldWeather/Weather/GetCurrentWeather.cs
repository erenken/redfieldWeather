using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using RedfieldWeather.Repositories;

namespace RedfieldWeather.Weather;

public sealed class GetCurrentWeather(ICurrentWeatherRepository repository, ILogger<GetCurrentWeather> logger)
{
    [Function("GetCurrentWeather")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest request)
    {
        var current = await repository.Get(request.HttpContext.RequestAborted);
        if (string.IsNullOrWhiteSpace(current.Weather))
            return new NoContentResult();

        logger.LogInformation("Current weather timestamp: {Timestamp}", current.Timestamp);
        return new ContentResult { Content = current.Weather, ContentType = "application/json", StatusCode = StatusCodes.Status200OK };
    }
}
