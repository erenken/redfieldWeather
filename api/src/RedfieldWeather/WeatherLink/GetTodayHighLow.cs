using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink;
using myNOC.WeatherLink.JsonConverters;
using RedfieldWeather.Entities;
using RedfieldWeather.Repositories;
using System.Text.Json;

public class GetTodayHighLow
{
	private readonly ILogger _logger;
	private readonly IClient _client;
	private readonly SensorJsonConverterFactory _sensorJsonConverterFactory;
	private readonly IConfiguration _configuration;
	private readonly IHighLowWeatherRepository _highLowWeatherRepository;

	public GetTodayHighLow(
		ILoggerFactory loggerFactory,
		IClient client,
		SensorJsonConverterFactory sensorJsonConverterFactory,
		IConfiguration configuration,
		IHighLowWeatherRepository highLowWeatherRepository
		)
	{
		_logger = loggerFactory.CreateLogger<GetTodayHighLow>();
		_client = client;
		_sensorJsonConverterFactory = sensorJsonConverterFactory;
		_configuration = configuration;
		_highLowWeatherRepository = highLowWeatherRepository;
	}

	[Function("WeatherLinkGetTodayHighLow")]
	public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo timerInfo)
	{
		var stationId = _configuration.GetValue<int>("WeatherLinkAPI:StationId");

		var date = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTimeOffset.UtcNow, "Eastern Standard Time").Date;
		_logger.LogDebug($"Getting High Lows for {date}");

		var highLows = await _client.GetHighsAndLows(stationId, DateOnly.FromDateTime(date));

		JsonSerializerOptions options = new JsonSerializerOptions();
		options.Converters.Add(_sensorJsonConverterFactory);

		if (highLows != null)
		{
			var weather = JsonSerializer.Serialize(highLows, options);
			var highLowWeather = new HighLowWeather { Weather = weather };

			await _highLowWeatherRepository.Upsert(highLowWeather);
			_logger.LogInformation("Stored New High Low Data");
		}
		else
			_logger.LogInformation("HighLow Data was null");
	}
}
