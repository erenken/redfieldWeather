using Azure.Data.Tables;
using Microsoft.Extensions.Configuration;

namespace RedfieldWeather.Repositories
{
	public abstract class WeatherRepository<TEntity> : IWeatherRepository<TEntity> where TEntity : ITableEntity
	{
		private TableClient? _tableClient;
		private readonly string _connectionString = default!;

		public WeatherRepository(IConfiguration configuration)
		{
			_connectionString = configuration.GetConnectionString("weatherStorage")!;
		}

		public abstract string TableName { get; }

		private TableClient GetTableClient()
		{
			if (_tableClient != null) return _tableClient;

			_tableClient = new TableClient(_connectionString, TableName);
			return _tableClient;
		}

		public async Task Upsert(TEntity entity)
		{
			GetTableClient();

			await _tableClient!.UpsertEntityAsync(entity);
		}
	}
}
