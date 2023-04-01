using RedfieldWeather.Entities;

namespace RedfieldWeather.Repositories
{
	public interface IHighLowWeatherRepository : IWeatherRepository<HighLowWeather>
	{
		Task<HighLowWeather> Get();
	}
}
