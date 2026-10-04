using System.Globalization;
using myNOC.WeatherLink.Sensors.Data;
using myNOC.WeatherLink.Models.Sensors;
using myNOC.WeatherLink.Responses;

namespace RedfieldWeather.App.Models;

public sealed class WeatherSnapshot(WeatherDataResponse response)
{
    private SensorReading<VantagePro2Plus>? station;
    private SensorReading<AirLink>? airQuality;
    private SensorReading<VantagePro2PlusArchive>? stationStatistics;
    private SensorReading<AirLinkArchive>? airQualityStatistics;

    public SensorReading<VantagePro2Plus>? Station => station ??= FindSensor<VantagePro2Plus>(reading => reading.UnixTimeStamp);

    public SensorReading<AirLink>? AirQuality => airQuality ??= FindSensor<AirLink>(reading => reading.UnixTimeStamp);

    public SensorReading<VantagePro2PlusArchive>? StationStatistics => stationStatistics ??= FindSensor<VantagePro2PlusArchive>();

    public SensorReading<AirLinkArchive>? AirQualityStatistics => airQualityStatistics ??= FindSensor<AirLinkArchive>();

    private SensorReading<TReading>? FindSensor<TReading>(Func<TReading, int?>? timestamp = null)
        where TReading : class, ISensorData
    {
        var value = (response.Sensors ?? []).OfType<Sensor<TReading>>()
            .SelectMany(sensor => sensor.Data ?? []).FirstOrDefault();
        return value is null ? null : new SensorReading<TReading>(value,
            timestamp is null ? null : SensorReading.FromUnixTime(timestamp(value)));
    }
}

public sealed class SensorReading<TReading>(TReading value, DateTimeOffset? timestamp = null)
{
    public TReading Value { get; } = value;

    public double? Number(Func<TReading, double?> selector) => selector(Value) is { } number
        && double.IsFinite(number) ? number : null;

    public string Text(Func<TReading, string?> selector) => selector(Value) ?? "—";

    public DateTimeOffset? Time() => timestamp;

    public DateTimeOffset? Time(Func<TReading, int?> selector) => SensorReading.FromUnixTime(selector(Value));

    public string Format(Func<TReading, double?> selector, string unit = "") => Number(selector) is { } number
        ? $"{number.ToString("0.##", CultureInfo.CurrentCulture)}{unit}" : "—";
}

public static class SensorReading
{
    public static DateTimeOffset? FromUnixTime(int? seconds) => seconds.HasValue
        ? DateTimeOffset.FromUnixTimeSeconds(seconds.Value) : null;

    public static string FormatTime(DateTimeOffset? time) => time?.ToLocalTime().ToString("g") ?? "—";
}

public sealed record WeatherMetric<TReading>(string Label, Func<TReading, double?> Selector,
    string Unit = "", Func<TReading, int?>? TimeSelector = null);
