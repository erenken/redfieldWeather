using Microsoft.Extensions.Configuration;
using RedfieldWeather.Entities;

namespace RedfieldWeather.Repositories
{
	public class HistoricalWeatherRepository : WeatherRepository<HistoricalWeather>, IHistoricalWeatherRepository
	{
		public HistoricalWeatherRepository(IConfiguration configuration) : base(configuration)
		{
		}

		public override string TableName => "historical";

		public async IAsyncEnumerable<HistoricalWeather> Get(int lastDays)
		{
			var todaysDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTimeOffset.UtcNow, "Eastern Standard Time").Date;
			var oldestDate = todaysDate.AddDays(lastDays * -1).Date;

			var pagedWeather = base.Get(x => x.PartitionKey.CompareTo(oldestDate.ToString("yyyyMMdd")) >= 0);

			await foreach (var weather in pagedWeather)
				yield return weather;
		}
	}
}
