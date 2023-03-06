using System.Net;
using System.Text.Json;
using Azure.Core.Serialization;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink.JsonConverters;
using myNOC.WeatherLink.Responses;
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
			JsonSerializerOptions options = new JsonSerializerOptions();
			options.Converters.Add(_sensorJsonConverterFactory);

			var currentWeather = await _currentWeatherRepository.Get();
			var weather = JsonSerializer.Deserialize<CurrentResponse>(currentWeather.Weather, options);

			var objectSerializerOptions = new JsonObjectSerializer(options);
			var response = req.CreateResponse(HttpStatusCode.OK);
			await response.WriteAsJsonAsync(weather, objectSerializerOptions);

			_logger.LogInformation($"Current weather timestamp: {currentWeather.Timestamp}");

            return response;
        }
    }
}
