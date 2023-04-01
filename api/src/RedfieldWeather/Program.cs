using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink;
using myNOC.WeatherLink.API;
using myNOC.WeatherLink.JsonConverters;
using RedfieldWeather.Repositories;
using System.Text.Json;

var host = new HostBuilder()
	.ConfigureFunctionsWorkerDefaults()
		.ConfigureServices(services =>
		{
			services
				.AddWeatherLink()
				.AddLogging(config => config.AddConsole())
				.AddSingleton<IHistoricalWeatherRepository, HistoricalWeatherRepository>()
				.AddSingleton<ICurrentWeatherRepository, CurrentWeatherRepository>()
				.AddSingleton<IHighLowWeatherRepository, HighLowWeatherRepository>();
		})
	.ConfigureAppConfiguration(config =>
	{
		config.SetBasePath(Directory.GetCurrentDirectory())
			.AddJsonFile("local.settings.json", true, true);
	})
	.Build();

var config = host.Services.GetService<IConfiguration>();
config?.GetSection("WeatherLinkAPI:HttpClient").Bind(host.Services.GetRequiredService<IAPIHttpClient>());
config?.GetSection("WeatherLinkAPI:APIContext").Bind(host.Services.GetRequiredService<IAPIContext>());

await host.RunAsync();
