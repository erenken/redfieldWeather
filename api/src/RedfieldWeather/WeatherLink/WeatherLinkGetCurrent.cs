using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using myNOC.WeatherLink;
using myNOC.WeatherLink.JsonConverters;
using RedfieldWeather.Entities;
using RedfieldWeather.Repositories;
using System.Text.Json;

namespace RedfieldWeather.WeatherLink {
	public class WeatherLinkGetCurrent
	{
		private readonly IClient _client;
		private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
		private readonly IConfiguration _configuration;
		private readonly IHistoricalWeatherRepository _historicalWeatherRepository;
		private readonly ICurrentWeatherRepository _currentWeatherRepository;

		public WeatherLinkGetCurrent(
			IClient client,
			SensorJsonConverterFactory sensorJsonConverterFactory,
			IConfiguration configuration,
			IHistoricalWeatherRepository historicalWeatherRepository,
			ICurrentWeatherRepository currentWeatherRepository
			)
		{
			_client = client;
			_sensorJsonConverterFactory = sensorJsonConverterFactory;
			_configuration = configuration;
			_historicalWeatherRepository = historicalWeatherRepository;
			_currentWeatherRepository = currentWeatherRepository;
		}

		[Function("WeatherLinkGetCurrent")]
		public async Task Run([TimerTrigger("*/5 * * * * *")] TimerInfo timerInfo)
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

			var currentWeather = new CurrentWeather { Weather = weather };

			var tasks = new Task[]
				{
					_historicalWeatherRepository.Upsert(historicalWeather),
					_currentWeatherRepository.Upsert(currentWeather)
				};

			await Task.WhenAll(tasks);
		}
	}
}
