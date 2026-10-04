# Redfield Weather

A personal weather dashboard for Milton Township, Cass County, Michigan, powered by a Davis Vantage Pro2 weather station and Davis AirLink. The application is a **.NET 10 Blazor WebAssembly single-page app**, with a separate **.NET 10 Azure Functions v4 isolated-worker backend**.

## Features

- Current temperature, feels-like temperature, humidity, dew point, wind, rain, UV, and solar radiation.
- Current and previous rain storms, and AirLink air quality when sensors report data.
- Daily highs, lows, and averages, with observation times.
- Historical temperature, wind, humidity, rain, and UV graphs for 1, 3, 7, or 30 days.
- Active National Weather Service alerts for the station location.

Current conditions, daily statistics, and alerts refresh every minute. The backend collects WeatherLink data every five minutes. This is an informational personal station, not an official emergency notification service.

## Architecture

```text
Davis station / AirLink -> WeatherLink API
                              | every 5 minutes
                    Azure Functions timer triggers
                              |
                      Azure Table Storage
                              | HTTP API
Azure Static Web Apps -> Blazor WebAssembly -> weather dashboard
                              | directly from the browser
                    National Weather Service alerts
```

The frontend is entirely static: there is no ASP.NET Core server, SSR, or Node/React build. The Function App remains independently deployed, preserving scheduled collectors and the existing API hostname. It is **not** packaged as a Static Web Apps managed API. The browser calls the Function App directly, so backend CORS must allow the frontend origins.

## Repository map

| Location | Purpose |
| --- | --- |
| [rw-app/](./rw-app/README.md) | Blazor SPA, routes, API client, styles, and Static Web Apps configuration |
| [api/](./api/README.md) | Functions endpoints, collectors, and Azure Table repositories |
| [apphost/](./apphost/README.md) | Aspire orchestration of the local SPA, Functions, and storage |
| [RedfieldWeather.slnx](./RedfieldWeather.slnx) | Solution containing the app, API, and Aspire AppHost |
| [global.json](./global.json) | Stable .NET 10 SDK selection, rolling forward within .NET 10 feature bands |
| [.github/workflows/](./.github/workflows/) | Independent frontend and backend deployment pipelines |

The previous React application is removed. Git history retains the earlier implementation.

## Prerequisites

- Stable [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0), version 10.0.100 or later.
- For local backend development: current [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local) with .NET 10 support, plus [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite) or an Azure Storage account.
- WeatherLink credentials and a station ID to collect real observations.
- Node.js is optional for npm-based Azurite/Functions tooling. It is not required to build the app.

## Quick start

For the full local stack, see the [Aspire setup guide](./apphost/README.md). It uses the Aspire Azure Storage NuGet integration to manage a local storage container; no standalone Azurite installation is needed. Podman and Functions Core Tools are required; the AppHost launch profile selects Podman:

```powershell
dotnet run --project apphost/RedfieldWeather.AppHost.csproj -p:WasmApplicationEnvironmentName=Aspire
```

Configure WeatherLink user secrets first as described in that guide. Aspire is for local orchestration only; production continues to use the two existing Azure deployment workflows.

To build the solution and run only the frontend, from the repository root:

```powershell
dotnet restore RedfieldWeather.slnx
dotnet build RedfieldWeather.slnx --configuration Release
dotnet run --project rw-app/RedfieldWeather.App.csproj
```

Open `http://localhost:5000`. By default, the app reads the existing public API, which must allow localhost in CORS. For your own backend, follow the [API setup](./api/README.md#local-development) and [frontend configuration](./rw-app/README.md#configuration). No credentials belong in the frontend.

## Build deployable artifacts

```powershell
dotnet publish rw-app/RedfieldWeather.App.csproj --configuration Release --output artifacts/website -warnaserror
dotnet publish api/src/RedfieldWeather/RedfieldWeather.csproj --configuration Release --output artifacts/functionapp -warnaserror
```

Upload **the contents of `artifacts/website/wwwroot`** to Static Web Apps. Deploy **the contents of `artifacts/functionapp`** to the separate Function App. The workflows perform these steps automatically.

## Azure deployment

The existing `redfieldWeatherLink` Function App was inspected on **October 4, 2026**: it uses **Windows Consumption (Y1)** in East US, on `ASP-redfieldWeather-bf9a`, with a **64-bit worker** and Functions v4. This plan supports the .NET 10 isolated application; **do not delete or recreate the Function App or its storage**. The Linux Consumption limitation below does not apply to this existing Windows app. See the [API runtime upgrade and rollback guide](./api/README.md#runtime-upgrade-and-rollback) for the runtime-only change.

With the owner's approval, its Windows runtime setting was updated from `v8.0` to **`v10.0`** on that date and read back successfully. Functions v4, `dotnet-isolated`, and the 64-bit worker were retained. This was a cloud configuration change, **not a code deployment**; the new application code still deploys through the PR's merge to `main`.

Before merging or deploying the migration:

1. Configure the Function App for Functions v4, `FUNCTIONS_WORKER_RUNTIME=dotnet-isolated`, and **.NET 10**. Changing the project target does not change the Azure runtime stack.
2. Verify hosting-plan support. **Linux classic Consumption does not support .NET 10**; use a supported plan, such as Flex Consumption or a supported Windows configuration. This repository does not migrate hosting plans.
3. Set WeatherLink and storage settings from the [API README](./api/README.md#azure-configuration).
4. Allow production Static Web Apps/custom domain and development origins in Function App CORS. Individually add intended PR preview origins rather than a blanket wildcard.
5. Verify the existing GitHub deployment secrets listed in each component README.

Pushes to `main` deploy the affected component. PRs build affected projects, deploy frontend previews for same-repository PRs, and never deploy the API to production. Fork PRs build without deployment secrets. Manual workflows are available; API production deployment is restricted to `main`.

Both publish workflows treat compiler and build warnings as errors. Check the PR workflows before merging. A frontend preview still reads the existing production API; the new backend is not deployed until merge. After merging, confirm that both production workflows succeed, then verify current conditions, highs/lows, every history range, alerts, and a direct reload of `/graphs`. Check Application Insights for worker startup errors and verify fresh observations after at least one five-minute collection interval.

Frontend previews use the configured API URL, defaulting to production. For a staging backend, provision a separate Function App and change the frontend URL. Building this repository changes no cloud resources, runtime settings, or secrets.

## Validation and maintenance

```powershell
dotnet build RedfieldWeather.slnx --configuration Release -warnaserror
dotnet list RedfieldWeather.slnx package --outdated
dotnet list RedfieldWeather.slnx package --vulnerable --include-transitive
```

There is no automated test suite currently. Smoke-test all five pages, a direct reload of `/graphs`, each history range, empty storage, request failures, and CORS from intended origins. A Release publish matters because Blazor output is trimmed; source-generated JSON metadata is used for frontend models.

## More information

- [Frontend setup, routes, and publishing](./rw-app/README.md)
- [Backend settings, endpoints, storage, and troubleshooting](./api/README.md)
- [WeatherLink v2 API](https://weatherlink.github.io/v2-api/)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
- [Azure Functions isolated .NET guide](https://learn.microsoft.com/azure/azure-functions/dotnet-isolated-process-guide)
