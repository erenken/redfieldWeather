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
	}
}
