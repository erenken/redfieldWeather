using RedfieldWeather.Entities;

namespace RedfieldWeather.Repositories
{
	public interface ICurrentWeatherRepository : IWeatherRepository<CurrentWeather>
	{
		Task<CurrentWeather> Get();
	}
}
