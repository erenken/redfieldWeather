using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using Azure.Data.Tables;
using Microsoft.Extensions.Configuration;

namespace RedfieldWeather.Repositories;

public abstract class WeatherRepository<TEntity> : IWeatherRepository<TEntity> where TEntity : class, ITableEntity
{
    private readonly TableClient tableClient;

    protected WeatherRepository(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("weatherStorage")
            ?? throw new InvalidOperationException("ConnectionStrings:weatherStorage is required.");
        tableClient = new TableClient(connectionString, TableName);
    }

    public abstract string TableName { get; }

    public async Task Upsert(TEntity entity)
    {
        await tableClient.CreateIfNotExistsAsync();
        await tableClient.UpsertEntityAsync(entity);
    }

    public async IAsyncEnumerable<TEntity> Get(Expression<Func<TEntity, bool>>? filter = null, int? maxPerPage = null,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        await tableClient.CreateIfNotExistsAsync(cancellationToken);
        await foreach (var entity in tableClient.QueryAsync(filter, maxPerPage, cancellationToken: cancellationToken))
            yield return entity;
    }
}
