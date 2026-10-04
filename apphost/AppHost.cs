var builder = DistributedApplication.CreateBuilder(args);

var apiKey = builder.AddParameter("weatherlink-api-key", secret: true);
var apiSecret = builder.AddParameter("weatherlink-api-secret", secret: true);
var stationId = builder.AddParameter("weatherlink-station-id", "152788");

var storage = builder.AddAzureStorage("storage")
    .RunAsEmulator(emulator => emulator.WithDataVolume());
var tables = storage.AddTables("weather-storage");

var api = builder.AddAzureFunctionsProject<Projects.RedfieldWeather>("weather-api")
    .WithHostStorage(storage)
    .WithReference(tables)
    .WithEnvironment("ConnectionStrings__weatherStorage", tables.Resource.ConnectionStringExpression)
    .WithEnvironment("WeatherLinkAPI__APIContext__APIKey", apiKey)
    .WithEnvironment("WeatherLinkAPI__APIContext__APISecret", apiSecret)
    .WithEnvironment("WeatherLinkAPI__StationId", stationId)
    .WaitFor(storage);

builder.AddProject<Projects.RedfieldWeather_App>("weather-app")
    .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Aspire")
    .WithEndpoint("http", endpoint =>
    {
        endpoint.Port = 5000;
        endpoint.TargetPort = 5000;
        endpoint.IsProxied = false;
    })
    .WaitFor(api);

builder.Build().Run();
