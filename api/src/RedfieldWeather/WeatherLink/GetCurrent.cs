using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink;
using myNOC.WeatherLink.JsonConverters;
using myNOC.WeatherLink.Models.Sensors;
using myNOC.WeatherLink.Models.Sensors.Data;
using myNOC.WeatherLink.Responses;
using myNOC.WeatherLink.Sensors.Data;
using RedfieldWeather.Entities;
using RedfieldWeather.Repositories;
using System.Text.Json;

namespace RedfieldWeather.WeatherLink
{
	public class GetCurrent
	{
		private readonly ILogger _logger;
		private readonly IClient _client;
		private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
		private readonly IConfiguration _configuration;
		private readonly IHistoricalWeatherRepository _historicalWeatherRepository;
		private readonly ICurrentWeatherRepository _currentWeatherRepository;

		public GetCurrent(
			ILoggerFactory loggerFactory,
			IClient client,
			SensorJsonConverterFactory sensorJsonConverterFactory,
			IConfiguration configuration,
			IHistoricalWeatherRepository historicalWeatherRepository,
			ICurrentWeatherRepository currentWeatherRepository
			)
		{
			_logger = loggerFactory.CreateLogger<GetCurrent>();
			_client = client;
			_sensorJsonConverterFactory = sensorJsonConverterFactory;
			_configuration = configuration;
			_historicalWeatherRepository = historicalWeatherRepository;
			_currentWeatherRepository = currentWeatherRepository;
		}

		[Function("WeatherLinkGetCurrent")]
		public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo timerInfo)
		{
			var stationId = _configuration.GetValue<int>("WeatherLinkAPI:StationId");
			var current = await _client.GetCurrent(stationId);

			JsonSerializerOptions options = new JsonSerializerOptions();
			options.Converters.Add(_sensorJsonConverterFactory);

			if (current != null)
			{
				var isUpdated = await IsUpdatedWeatherData(current, options);
				if (isUpdated)
				{
					var weather = JsonSerializer.Serialize(current, options);

					var historicalWeather = new HistoricalWeather
					{
						PartitionKey = current!.GeneratedAt.ToString("yyyyMMdd"),
						RowKey = current!.GeneratedAt.ToString("s"),
						Weather = weather
					};

					var currentWeather = new CurrentWeather { Weather = weather };

					var tasks = new Task[]
						{
						_historicalWeatherRepository.Upsert(historicalWeather),
						_currentWeatherRepository.Upsert(currentWeather)
						};

					await Task.WhenAll(tasks);
					_logger.LogInformation("Stored New Weather Data");
				}
				else
					_logger.LogInformation("No new Weather Data");
			}
			else
				_logger.LogInformation("Current Data was null");
		}

		private async Task<bool> IsUpdatedWeatherData(WeatherDataResponse? current, JsonSerializerOptions options)
		{
			var storedCurrentWeather = await _currentWeatherRepository.Get();
			var storeCurrentResponse = JsonSerializer.Deserialize<WeatherDataResponse>(storedCurrentWeather.Weather, options);

			var storedVantageSensor = storeCurrentResponse?.Sensors.FirstOrDefault(x => x?.Type == SensorType.VantagePro2Plus) as Sensor<VantagePro2Plus>;
			var storedVantageSensorData = storedVantageSensor?.Data?.FirstOrDefault();

			var currentVantageSensor = current?.Sensors.FirstOrDefault(x => x?.Type == SensorType.VantagePro2Plus) as Sensor<VantagePro2Plus>;
			var currentVantageSensorData = currentVantageSensor?.Data?.FirstOrDefault();

			_logger.LogInformation($"Vantage Sensor Data Stored: {storedVantageSensorData?.TimeStamp}, Retrieved: {currentVantageSensorData?.TimeStamp}");

			return (storedVantageSensorData?.UnixTimeStamp != currentVantageSensorData?.UnixTimeStamp);
		}
	}
}
