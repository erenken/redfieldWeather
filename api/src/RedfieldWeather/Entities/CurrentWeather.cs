namespace RedfieldWeather.Entities
{
	public class CurrentWeather : WeatherTableEntity
	{
		public CurrentWeather()
		{
			PartitionKey = "weather";
			RowKey = "current";
		}
	}
}
