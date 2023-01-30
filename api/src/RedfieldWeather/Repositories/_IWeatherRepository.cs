using Azure.Data.Tables;

namespace RedfieldWeather.Repositories
{
	public interface IWeatherRepository<TEntity> where TEntity : ITableEntity
	{
		Task Upsert(TEntity entity);
	}
}
