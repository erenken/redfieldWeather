using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using myNOC.WeatherLink;
using myNOC.WeatherLink.API;
using RedfieldWeather.Repositories;

var builder = FunctionsApplication.CreateBuilder(args);
builder.ConfigureFunctionsWebApplication();
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
    .AddJsonFile("local.settings.json", optional: true, reloadOnChange: false)
    .AddEnvironmentVariables();
builder.Services
    .AddWeatherLink()
    .AddSingleton<IHistoricalWeatherRepository, HistoricalWeatherRepository>()
    .AddSingleton<ICurrentWeatherRepository, CurrentWeatherRepository>()
    .AddSingleton<IHighLowWeatherRepository, HighLowWeatherRepository>();

using var host = builder.Build();
builder.Configuration.GetSection("WeatherLinkAPI:HttpClient").Bind(host.Services.GetRequiredService<IAPIHttpClient>());
builder.Configuration.GetSection("WeatherLinkAPI:APIContext").Bind(host.Services.GetRequiredService<IAPIContext>());
await host.RunAsync();
