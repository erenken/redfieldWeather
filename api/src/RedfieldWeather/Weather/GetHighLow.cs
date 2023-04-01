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
    public class GetHighLow
    {
        private readonly ILogger _logger;
		private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
		private readonly IHighLowWeatherRepository _highLowWeatherRepository;

		public GetHighLow(
			ILoggerFactory loggerFactory,
			SensorJsonConverterFactory sensorJsonConverterFactory,
			IHighLowWeatherRepository highLowWeatherRepository
			)
        {
            _logger = loggerFactory.CreateLogger<GetCurrentWeather>();
			_sensorJsonConverterFactory = sensorJsonConverterFactory;
			_highLowWeatherRepository = highLowWeatherRepository;
		}

        [Function("GetHighLow")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
			JsonSerializerOptions options = new JsonSerializerOptions();
			options.Converters.Add(_sensorJsonConverterFactory);

			var highLowWeather = await _highLowWeatherRepository.Get();
			var weather = JsonSerializer.Deserialize<WeatherDataResponse>(highLowWeather.Weather, options);

			var objectSerializerOptions = new JsonObjectSerializer(options);
			var response = req.CreateResponse(HttpStatusCode.OK);
			await response.WriteAsJsonAsync(weather, objectSerializerOptions);

			_logger.LogInformation($"High Low weather timestamp: {highLowWeather.Timestamp}");

            return response;
        }
    }
}
