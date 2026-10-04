namespace RedfieldWeather.App.Models;

public sealed record ChartSeries<TReading>(string Label, Func<TReading, double?> Selector, string Color);
