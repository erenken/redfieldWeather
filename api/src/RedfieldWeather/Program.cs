using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using myNOC.WeatherLink;
using myNOC.WeatherLink.API;
using RedfieldWeather.Models;

var host = new HostBuilder()
	.ConfigureFunctionsWorkerDefaults()
		.ConfigureServices(services =>
		{
			services
				.AddWeatherLink()
				.AddLogging(config => config.AddConsole())
				.AddScoped<HistoricalWeather>()
				.AddScoped<CurrentWeather>();
		})
	.ConfigureAppConfiguration(config =>
	{
		config.SetBasePath(Directory.GetCurrentDirectory())
			.AddJsonFile("local.settings.json", true, true);
	})
	.Build();

var config = host.Services.GetService<IConfiguration>();
config?.GetSection("WeatherLinkAPI:HttpClient").Bind(host.Services.GetService<IAPIHttpClient>());
config?.GetSection("WeatherLinkAPI:APIContext").Bind(host.Services.GetService<IAPIContext>());

await host.RunAsync();
