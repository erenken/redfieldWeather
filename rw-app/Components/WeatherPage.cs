using Microsoft.AspNetCore.Components;
using RedfieldWeather.App.Services;

namespace RedfieldWeather.App.Components;

public abstract class WeatherPage : ComponentBase, IDisposable
{
    [Inject]
    protected WeatherDashboard Dashboard { get; set; } = default!;

    protected override void OnInitialized() => Dashboard.Changed += OnWeatherChanged;

    private void OnWeatherChanged() => _ = InvokeAsync(StateHasChanged);

    public void Dispose()
    {
        Dashboard.Changed -= OnWeatherChanged;
        GC.SuppressFinalize(this);
    }
}
