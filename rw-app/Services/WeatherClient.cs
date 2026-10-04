using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Components.WebAssembly.Http;
using RedfieldWeather.App.Models;

namespace RedfieldWeather.App.Services;

public sealed class WeatherClient(HttpClient http, IConfiguration configuration)
{
    private readonly Uri apiBase = new(configuration["Weather:ApiBaseUrl"]
        ?? throw new InvalidOperationException("Weather:ApiBaseUrl is required."), UriKind.Absolute);

    public Task<WeatherSnapshot?> GetCurrentAsync(CancellationToken cancellationToken) =>
        GetSnapshotAsync("GetCurrentWeather", cancellationToken);

    public Task<WeatherSnapshot?> GetHighLowAsync(CancellationToken cancellationToken) =>
        GetSnapshotAsync("GetHighLow", cancellationToken);

    public async Task<List<WeatherSnapshot>> GetHistoryAsync(int days, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, new Uri(apiBase, $"GetHistoric?days={days}"));
        request.SetBrowserResponseStreamingEnabled(false);
        using var response = await http.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var history = await response.Content.ReadFromJsonAsync(WeatherJsonContext.WithSensors.ListWeatherDataResponse, cancellationToken) ?? [];
        return history.Select(snapshot => new WeatherSnapshot(snapshot)).ToList();
    }

    public async Task<List<WeatherAlert>> GetAlertsAsync(CancellationToken cancellationToken)
    {
        var point = configuration["Weather:AlertPoint"] ?? "41.76760,-86.17275";
        var alerts = await http.GetFromJsonAsync(
            $"https://api.weather.gov/alerts/active?point={Uri.EscapeDataString(point)}", WeatherJsonContext.Default.AlertCollection, cancellationToken);
        return alerts?.Features.Select(feature => feature.Properties).ToList() ?? [];
    }

    private async Task<WeatherSnapshot?> GetSnapshotAsync(string route, CancellationToken cancellationToken)
    {
        using var response = await http.GetAsync(new Uri(apiBase, route), cancellationToken);
        if (response.StatusCode == HttpStatusCode.NoContent)
            return null;
        response.EnsureSuccessStatusCode();
        var snapshot = await response.Content.ReadFromJsonAsync(WeatherJsonContext.WithSensors.WeatherDataResponse, cancellationToken);
        return snapshot is null ? null : new WeatherSnapshot(snapshot);
    }
}
