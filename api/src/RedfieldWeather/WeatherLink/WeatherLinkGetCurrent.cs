using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink;
using myNOC.WeatherLink.JsonConverters;
using RedfieldWeather.Models;
using System.Text.Json;

namespace RedfieldWeather.WeatherLink
{
	public class WeatherLinkGetCurrent
	{
		private readonly IClient _client;
		private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
		private readonly IConfiguration _configuration;
		private readonly ILogger<WeatherLinkGetCurrent> _logger;

		public WeatherLinkGetCurrent(
			IClient client,
			SensorJsonConverterFactory sensorJsonConverterFactory,
			IConfiguration configuration,
			ILogger<WeatherLinkGetCurrent> logger)
		{
			_client = client;
			_sensorJsonConverterFactory = sensorJsonConverterFactory;
			_configuration = configuration;
			_logger = logger;
		}

		[Function("WeatherLinkGetCurrent")]
		public async Task<HistoricalWeather> Run([TimerTrigger("0 */5 * * * *", RunOnStartup = true)] TimerInfo timerInfo)
		{
			var stationId = _configuration.GetValue<int>("WeatherLinkAPI:StationId");
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

			//var currentWeather = new CurrentWeather { Weather = weather };

			return historicalWeather;
		}
	}
}
