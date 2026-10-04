using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using RedfieldWeather.Repositories;

namespace RedfieldWeather.Weather;

public sealed class GetHighLow(IHighLowWeatherRepository repository, ILogger<GetHighLow> logger)
{
    [Function("GetHighLow")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest request)
    {
        var highLow = await repository.Get(request.HttpContext.RequestAborted);
        if (string.IsNullOrWhiteSpace(highLow.Weather))
            return new NoContentResult();

        logger.LogInformation("High/low weather timestamp: {Timestamp}", highLow.Timestamp);
        return new ContentResult { Content = highLow.Weather, ContentType = "application/json", StatusCode = StatusCodes.Status200OK };
    }
}
