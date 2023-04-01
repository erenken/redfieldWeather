namespace RedfieldWeather.Entities
{
	public class HighLowWeather : WeatherTableEntity
	{
		public HighLowWeather()
		{
			PartitionKey = "weather";
			RowKey = "highLow";
		}
	}
}
