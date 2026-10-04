using System.Text.Json.Serialization;
using System.Text.Json;
using myNOC.WeatherLink.JsonConverters;
using myNOC.WeatherLink.Models.Sensors;
using myNOC.WeatherLink.Responses;
using myNOC.WeatherLink.Sensors;
using myNOC.WeatherLink.Sensors.Data;

namespace RedfieldWeather.App.Models;

[JsonSourceGenerationOptions(PropertyNameCaseInsensitive = true)]
[JsonSerializable(typeof(WeatherDataResponse))]
[JsonSerializable(typeof(List<WeatherDataResponse>))]
[JsonSerializable(typeof(AlertCollection))]
[JsonSerializable(typeof(Sensor<VantagePro2Plus>))]
[JsonSerializable(typeof(Sensor<VantagePro2PlusArchive>))]
[JsonSerializable(typeof(Sensor<AirLink>))]
[JsonSerializable(typeof(Sensor<AirLinkArchive>))]
internal partial class WeatherJsonContext : JsonSerializerContext
{
    internal static WeatherJsonContext WithSensors { get; } = CreateWithSensors();

    private static WeatherJsonContext CreateWithSensors()
    {
        ISensorFactory factory = new SensorFactory([
            new VantagePro2Plus(), new VantagePro2PlusArchive(), new AirLink(), new AirLinkArchive()]);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        options.Converters.Add(new SensorJsonConverterFactory(factory));
        return new WeatherJsonContext(options);
    }
}
