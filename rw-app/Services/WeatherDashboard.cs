using RedfieldWeather.App.Models;

namespace RedfieldWeather.App.Services;

public sealed class WeatherDashboard(WeatherClient client)
{
    public WeatherSnapshot? Current { get; private set; }
    public WeatherSnapshot? HighLow { get; private set; }
    public List<WeatherAlert> Alerts { get; private set; } = [];
    public Dictionary<string, string> Errors { get; } = [];
    public bool IsLoading { get; private set; } = true;
    public DateTimeOffset? RefreshedAt { get; private set; }
    public event Action? Changed;

    public async Task RefreshAsync(CancellationToken cancellationToken)
    {
        await Task.WhenAll(
            LoadAsync("Current conditions", async () => Current = await client.GetCurrentAsync(cancellationToken), cancellationToken),
            LoadAsync("Highs and lows", async () => HighLow = await client.GetHighLowAsync(cancellationToken), cancellationToken),
            LoadAsync("Weather alerts", async () => Alerts = await client.GetAlertsAsync(cancellationToken), cancellationToken));
        cancellationToken.ThrowIfCancellationRequested();
        IsLoading = false;
        RefreshedAt = DateTimeOffset.Now;
        Changed?.Invoke();
    }

    private async Task LoadAsync(string name, Func<Task> load, CancellationToken cancellationToken)
    {
        try
        {
            await load();
            Errors.Remove(name);
        }
        catch (Exception exception) when (exception is HttpRequestException or System.Text.Json.JsonException or OperationCanceledException)
        {
            cancellationToken.ThrowIfCancellationRequested();
            Errors[name] = $"{name} could not be refreshed. Previously loaded data, if any, is still shown. Try again shortly.";
        }
    }
}
