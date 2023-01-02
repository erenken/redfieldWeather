using Azure;
using Azure.Data.Tables;

namespace RedfieldWeather.WeatherLink
{
	public class HistoricalWeather : ITableEntity
	{
		public string PartitionKey { get; set; } = default!;
		public string RowKey { get; set; } = default!;
		public string Weather { get; set; } = default!;
		public DateTimeOffset? Timestamp { get; set; }
		public ETag ETag { get; set; }
	}
}
