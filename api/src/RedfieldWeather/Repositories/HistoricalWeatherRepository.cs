using Microsoft.Extensions.Configuration;
using RedfieldWeather.Entities;
using System.Runtime.CompilerServices;

namespace RedfieldWeather.Repositories
{
	public class HistoricalWeatherRepository : WeatherRepository<HistoricalWeather>, IHistoricalWeatherRepository
	{
		public HistoricalWeatherRepository(IConfiguration configuration) : base(configuration)
		{
		}

		public override string TableName => "historical";

		public async IAsyncEnumerable<HistoricalWeather> Get(int lastDays, [EnumeratorCancellation] CancellationToken cancellationToken = default)
		{
			var cutoff = DateTimeOffset.UtcNow.AddDays(-lastDays);
			var oldestDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(cutoff, "Eastern Standard Time").Date;

			var pagedWeather = base.Get(x => x.PartitionKey.CompareTo(oldestDate.ToString("yyyyMMdd")) >= 0, cancellationToken: cancellationToken);

			await foreach (var weather in pagedWeather)
				yield return weather;
		}
	}
}
