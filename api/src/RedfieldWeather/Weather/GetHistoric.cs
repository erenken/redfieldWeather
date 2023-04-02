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
	public class GetHistoric
	{
		private readonly ILogger _logger;
		private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
		private readonly IHistoricalWeatherRepository _historicalWeatherRepository;

		public GetHistoric(
			ILoggerFactory loggerFactory,
			SensorJsonConverterFactory sensorJsonConverterFactory,
			IHistoricalWeatherRepository historicalWeatherRepository
			)
		{
			_logger = loggerFactory.CreateLogger<GetCurrentWeather>();
			_sensorJsonConverterFactory = sensorJsonConverterFactory;
			_historicalWeatherRepository = historicalWeatherRepository;
		}

		[Function("GetHistoric")]
		public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req,
			IDictionary<string, string> query)
		{
			JsonSerializerOptions options = new JsonSerializerOptions();
			options.Converters.Add(_sensorJsonConverterFactory);

			query.TryGetValue("days", out var daysQuery);
			int.TryParse(daysQuery, out var days);

			var historical = new List<WeatherDataResponse>();
			await foreach (var historic in _historicalWeatherRepository.Get(days))
			{
				var weather = JsonSerializer.Deserialize<WeatherDataResponse>(historic.Weather, options);
				historical.Add(weather!);
			}

			var objectSerializerOptions = new JsonObjectSerializer(options);
			var response = req.CreateResponse(HttpStatusCode.OK);
			await response.WriteAsJsonAsync(historical.OrderBy(x => x.UnixGeneratedAt), objectSerializerOptions);

			_logger.LogInformation($"Returned: {historical.Count}");

			return response;
		}
	}
}
