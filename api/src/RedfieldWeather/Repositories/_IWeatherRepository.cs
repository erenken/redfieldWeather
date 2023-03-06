using Azure.Data.Tables;
using System.Linq.Expressions;

namespace RedfieldWeather.Repositories
{
	public interface IWeatherRepository<TEntity> where TEntity : ITableEntity
	{
		Task Upsert(TEntity entity);
		IAsyncEnumerable<TEntity> Get(Expression<Func<TEntity, bool>>? filter = null, int? maxPerPage = null);
	}
}
