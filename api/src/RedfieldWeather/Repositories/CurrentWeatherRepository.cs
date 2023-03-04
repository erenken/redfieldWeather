using Microsoft.Extensions.Configuration;
using RedfieldWeather.Entities;

namespace RedfieldWeather.Repositories
{
	internal class CurrentWeatherRepository : WeatherRepository<CurrentWeather>, ICurrentWeatherRepository
	{
		public CurrentWeatherRepository(IConfiguration configuration) : base(configuration)
		{
		}

		public override string TableName => "current";

		public async Task<CurrentWeather> Get()
		{
			CurrentWeather currentWeather = new();

			var pagedWeather = base.Get(x => x.PartitionKey == currentWeather.PartitionKey && x.RowKey == currentWeather.RowKey);

			await foreach(var weather in pagedWeather)
				currentWeather = weather;

			return currentWeather;
		}
	}
}
