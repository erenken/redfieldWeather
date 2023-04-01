using Microsoft.Extensions.Configuration;
using RedfieldWeather.Entities;

namespace RedfieldWeather.Repositories
{
	internal class HighLowWeatherRepository : WeatherRepository<HighLowWeather>, IHighLowWeatherRepository
	{
		public HighLowWeatherRepository(IConfiguration configuration) : base(configuration)
		{
		}

		public override string TableName => "current";

		public async Task<HighLowWeather> Get()
		{
			HighLowWeather highLowWeather = new();

			var pagedWeather = base.Get(x => x.PartitionKey == highLowWeather.PartitionKey && x.RowKey == highLowWeather.RowKey);

			await foreach (var weather in pagedWeather)
				highLowWeather = weather;

			return highLowWeather;
		}
	}
}
