using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using RedfieldWeather.App;
using RedfieldWeather.App.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<Microsoft.AspNetCore.Components.Web.HeadOutlet>("head::after");
builder.Services.AddScoped(_ => new HttpClient { Timeout = TimeSpan.FromSeconds(30) });
builder.Services.AddScoped<WeatherClient>();
builder.Services.AddScoped<WeatherDashboard>();
await builder.Build().RunAsync();
