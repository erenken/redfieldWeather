using Azure;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink;
using myNOC.WeatherLink.JsonConverters;
using myNOC.WeatherLink.Responses;
using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace RedfieldWeather.WeatherLink
{
	public class CurrentWeatherTimer
	{
		private readonly IClient _client;
		private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
		private readonly IConfiguration _configuration;
		private readonly ILogger<CurrentWeatherTimer> _logger;

		public CurrentWeatherTimer(
			IClient client,
			SensorJsonConverterFactory sensorJsonConverterFactory,
			IConfiguration configuration,
			ILogger<CurrentWeatherTimer> logger)
		{
			_client = client;
			_sensorJsonConverterFactory = sensorJsonConverterFactory;
			_configuration = configuration;
			_logger = logger;
		}

		[Function("StoreCurrentWeather")]
		[TableOutput("historical", Connection = "RedfieldWeatherStorage")]
		public async Task<HistoricalWeather> Run([TimerTrigger("*/5 * * * * *")] TimerInfo timerInfo)
		{
			var stationId = _configuration.GetValue<int>("Values:WeatherLinkAPI:StationId");
			var current = await _client.GetCurrent(stationId);

			JsonSerializerOptions options = new JsonSerializerOptions();
			options.Converters.Add(_sensorJsonConverterFactory);

			var weather = JsonSerializer.Serialize(current, options);

			var historicalWeather = new HistoricalWeather
			{
				PartitionKey = current!.GeneratedAt.ToString("yyyyMMdd"),
				RowKey = current!.GeneratedAt.ToString("s"),
				Weather = weather
			};

			var currentWeather = new CurrentWeather { Weather = weather };

			return historicalWeather;
		}
	}
}
