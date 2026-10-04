# Redfield Weather Aspire AppHost

Local orchestration using **Aspire 13.6 / .NET 10**. The AppHost starts the Blazor WebAssembly development server, Azure Functions, and local Azure Storage through the Aspire Azure Storage NuGet integration. The integration runs an Azurite container automatically: there is no separate emulator installation or manual storage connection-string setup.

This is a development convenience, not a new production hosting architecture. Static Web Apps and the separate Function App still deploy using their existing workflows.

## Prerequisites

- Stable .NET 10 SDK.
- Current Azure Functions Core Tools v4 (`func` available on PATH), supporting .NET 10 isolated workers.
- Podman installed and its machine running (`podman machine start` if needed). The AppHost launch profile selects Podman using `ASPIRE_CONTAINER_RUNTIME=podman`. Image download needs internet access on first launch.
- WeatherLink API key/secret and station ID.
- Free local ports 5000, 7071, 15888, 18889, and 18890. Storage container ports are allocated by Aspire.

The Storage SDK alone cannot provide a storage server. The Aspire Storage package supplies orchestration, while its managed emulator container provides the Blob, Queue, and Table services.

## Configure credentials

From the repository root, put credentials into AppHost user secrets, not committed files:

```powershell
dotnet user-secrets set "Parameters:weatherlink-api-key" "YOUR_KEY" --project apphost/RedfieldWeather.AppHost.csproj
dotnet user-secrets set "Parameters:weatherlink-api-secret" "YOUR_SECRET" --project apphost/RedfieldWeather.AppHost.csproj
dotnet user-secrets set "Parameters:weatherlink-station-id" "152788" --project apphost/RedfieldWeather.AppHost.csproj
```

The station defaults to 152788; change it for another station. Secret parameters are passed only to the Functions process, never the browser. User secrets are local development storage, not encrypted production secret management. Avoid entering real secrets on a shared computer or leaving them in shell history.

## Run

```powershell
dotnet run --project apphost/RedfieldWeather.AppHost.csproj -p:WasmApplicationEnvironmentName=Aspire
```

Use the token-bearing dashboard URL printed in the terminal. From the dashboard, view resources, console logs, status, and endpoints:

| Resource | Address / purpose |
| --- | --- |
| `weather-app` | `http://localhost:5000` - Blazor WASM development server |
| `weather-api` | `http://localhost:7071/api/` - Functions HTTP endpoints and collectors |
| `storage` | Aspire-managed emulator for host coordination and weather tables |
| `weather-storage` | Table Storage child resource |
| Dashboard | `http://localhost:15888` with local token authentication |

The API waits for storage; the SPA waits for the API. Fixed browser-visible ports keep frontend configuration and Functions CORS aligned. The browser cannot use server-side Aspire service discovery, so the SPA's dedicated `Aspire` environment reads the public [appsettings.Aspire.json](../rw-app/wwwroot/appsettings.Aspire.json) file with the local API URL. Production still reads the production URL from the main settings.

.NET 10 embeds the WebAssembly environment at build time. The `WasmApplicationEnvironmentName=Aspire` property in the run command is required as well as the AppHost's development-server environment. Rebuild with that property after a standalone frontend build; do not use `--no-build` against a build made for another environment. Normal frontend publishing without this property uses Production.

No API `local.settings.json` is needed for Aspire: it injects host storage, weather storage, and WeatherLink settings. Existing local settings may still load, but injected environment settings take precedence. The Azure Storage emulator uses a persistent data volume, so collected local history survives restarts. It is separate from production data.

Collectors still call the real WeatherLink service every five minutes. An empty local store initially returns `204` for current/daily data and `[]` for history; wait for collection. NWS alerts still come directly from the public NWS API.

## Troubleshooting

- Missing `func`: install current Core Tools v4 and restart your terminal/editor so PATH updates.
- Container failure: check `podman machine list` and `podman info`, start your existing Podman machine if stopped, and check image-pull connectivity. If running without the launch profile, set `ASPIRE_CONTAINER_RUNTIME=podman` explicitly.
- Missing parameter: set the two WeatherLink secrets with the exact parameter names above.
- Port conflict: stop the conflicting app. If changing 5000/7071, update the SPA Aspire settings, project launch profiles, and backend CORS together.
- WeatherLink errors: verify credentials and station ID in local user secrets.
- Dashboard unauthorized: open the login URL emitted at startup rather than disabling dashboard authentication.

The dashboard uses unsecured HTTP transport only on localhost for development. Do not expose it to the network. See the [API README](../api/README.md) to run without Aspire and the [main README](../README.md) for deployment.
