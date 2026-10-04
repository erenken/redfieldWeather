namespace RedfieldWeather.App.Models;

public sealed class AlertCollection
{
    public List<AlertFeature> Features { get; set; } = [];
}

public sealed class AlertFeature
{
    public string Id { get; set; } = "";
    public WeatherAlert Properties { get; set; } = new();
}

public sealed class WeatherAlert
{
    public string Event { get; set; } = "";
    public string Headline { get; set; } = "";
    public string Severity { get; set; } = "";
    public string Description { get; set; } = "";
    public string? Instruction { get; set; }
    public DateTimeOffset? Effective { get; set; }
    public DateTimeOffset? Expires { get; set; }
}
