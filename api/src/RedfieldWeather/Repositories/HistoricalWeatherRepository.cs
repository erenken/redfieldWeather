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
	}
}
