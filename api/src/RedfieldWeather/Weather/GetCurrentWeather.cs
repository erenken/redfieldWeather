using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink.JsonConverters;
using RedfieldWeather.Repositories;

namespace RedfieldWeather.Weather
{
    public class GetCurrentWeather
    {
        private readonly ILogger _logger;
		private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
		private readonly ICurrentWeatherRepository _currentWeatherRepository;

		public GetCurrentWeather(
			ILoggerFactory loggerFactory,
			SensorJsonConverterFactory sensorJsonConverterFactory,
			ICurrentWeatherRepository currentWeatherRepository
			)
        {
            _logger = loggerFactory.CreateLogger<GetCurrentWeather>();
			_sensorJsonConverterFactory = sensorJsonConverterFactory;
			_currentWeatherRepository = currentWeatherRepository;
		}

        [Function("GetCurrentWeather")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
			var currentWeather = await _currentWeatherRepository.Get();

            var response = req.CreateResponse(HttpStatusCode.OK);
			await response.WriteAsJsonAsync(currentWeather);

			_logger.LogInformation($"Current weather timestamp: ${currentWeather.Timestamp}");

            return response;
        }
    }
}
