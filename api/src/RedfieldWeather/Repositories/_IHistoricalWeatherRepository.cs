using RedfieldWeather.Entities;

namespace RedfieldWeather.Repositories
{
	public interface IHistoricalWeatherRepository : IWeatherRepository<HistoricalWeather>
	{
		IAsyncEnumerable<HistoricalWeather> Get(int lastDays);
	}
}
