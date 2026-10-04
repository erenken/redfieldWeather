# Redfield Weather API and collectors

A **.NET 10 Azure Functions v4 isolated-worker application**. HTTP functions use ASP.NET Core integration; timer functions retrieve WeatherLink observations every five minutes. It is deployed as a separate Function App, not a Static Web Apps managed API.

## Functions

| Function | Trigger | Behavior |
| --- | --- | --- |
| `WeatherLinkGetCurrent` | `0 */5 * * * *` | Stores a new current/history snapshot when the Vantage sensor timestamp changes |
| `WeatherLinkGetTodayHighLow` | `0 */5 * * * *` | Stores statistics for the current Eastern-time station day |
| `GetCurrentWeather` | Anonymous `GET /api/GetCurrentWeather` | Returns stored current JSON; `204` before the first collection |
| `GetHighLow` | Anonymous `GET /api/GetHighLow` | Returns stored daily statistics; `204` before the first collection |
| `GetHistoric` | Anonymous `GET /api/GetHistoric?days=7` | Returns observations for the rolling requested window, in timestamp order |

`days` defaults to 1 and must be an integer from 1 through 30; invalid values return `400` with a JSON error. Empty history returns `[]`. Existing route names and WeatherLink JSON fields (`station_id`, `generated_at`, `sensors`) are preserved. Current and high/low endpoints serve stored JSON directly rather than reserializing it on every request.

Endpoints deliberately serve public weather data without function keys. CORS controls browser access, not authentication. Credentials and storage details are not returned. NWS alerts are requested directly by the frontend.

## Local development

**Recommended:** follow the [Aspire AppHost guide](../apphost/README.md) to start the frontend, Functions, and managed local storage together. Aspire uses its Azure Storage integration to start the emulator container automatically; no standalone Azurite install is necessary. WeatherLink secrets come from AppHost user secrets.

For running Functions separately, install .NET 10, current Functions Core Tools v4, and either Azurite or use an Azure Storage account. From the repository root:

```powershell
Copy-Item api/src/RedfieldWeather/local.settings.example.json api/src/RedfieldWeather/local.settings.json
```

Edit the copied settings with your WeatherLink key, secret, and station ID. The copy is ignored by Git and never published. Keep credentials out of committed configuration.

For standalone emulated storage, start Azurite in another terminal:

```powershell
npx azurite --location .azurite
```

Enable Blob, Queue, and Table services. The example uses `UseDevelopmentStorage=true` for host and weather storage. Alternatively replace both storage settings with real Azure connection strings. Then:

```powershell
dotnet build api/src/RedfieldWeather/RedfieldWeather.csproj
Set-Location api/src/RedfieldWeather
func start
```

Core Tools exports the flat `Values` settings into environment variables; double underscores identify nested .NET paths. The default host is `http://localhost:7071`, allowing `http://localhost:5000` in CORS. See [frontend configuration](../rw-app/README.md#configuration) to point the standalone SPA at this host.

Local timer triggers use real WeatherLink credentials. To disable collection when only testing HTTP endpoints, add these local `Values` settings:

```json
"AzureWebJobs.WeatherLinkGetCurrent.Disabled": "true",
"AzureWebJobs.WeatherLinkGetTodayHighLow.Disabled": "true"
```

Otherwise wait for the next five-minute tick. Repositories create the tables automatically; the collector handles an empty current table.

## Configuration

[appsettings.json](./src/RedfieldWeather/appsettings.json) has non-secret defaults: base URI and station ID. Local JSON loads next, then environment variables override it. Existing nested local `WeatherLinkAPI` and `ConnectionStrings` sections remain supported.

| Setting / environment variable | Purpose |
| --- | --- |
| `FUNCTIONS_WORKER_RUNTIME` | `dotnet-isolated` |
| `FUNCTIONS_EXTENSION_VERSION` | Azure runtime, `~4` |
| `AzureWebJobsStorage` | Host storage for timer coordination |
| `ConnectionStrings__weatherStorage` | Station Table Storage connection string |
| `WeatherLinkAPI__APIContext__APIKey` | WeatherLink key |
| `WeatherLinkAPI__APIContext__APISecret` | WeatherLink secret |
| `WeatherLinkAPI__StationId` | Numeric station ID |
| `WeatherLinkAPI__HttpClient__BaseUri` | Optional override of `https://api.weatherlink.com/v2` |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Optional Azure host telemetry |

Use Azure app settings or Key Vault references for cloud secrets. Local settings and the example are excluded from publish output. Weather storage may be a different account from host storage. Aspire injects both connection strings for its local emulator, overriding local JSON.

## Storage and time

| Table | Partition key | Row key | Contents |
| --- | --- | --- | --- |
| `current` | `weather` | `current` | Latest current JSON |
| `current` | `weather` | `highLow` | Latest daily-statistics JSON |
| `historical` | `yyyyMMdd` of generated date | Sortable generated datetime | Current-observation snapshots |

Existing tables are reused, not renamed or deleted. History queries include the earliest relevant Eastern-time partition and filter Unix timestamps to return a rolling `days × 24 hours` window. HTTP reads propagate cancellation into Table Storage operations.

Daily highs/lows use `Eastern Standard Time`, a Windows timezone ID that observes daylight-saving rules. Browser times use the visitor's timezone. Do not change partition conventions without considering existing history.

## Dependencies

| Package | Version |
| --- | --- |
| `Microsoft.Azure.Functions.Worker` | 2.52.0 |
| `Microsoft.Azure.Functions.Worker.Sdk` | 2.1.0 |
| `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore` | 2.1.1 |
| `Microsoft.Azure.Functions.Worker.Extensions.Timer` | 4.3.1 |
| `Azure.Data.Tables` | 12.13.0 |
| `myNOC.WeatherLink` | 0.2.4 |

Stable versions were checked during migration. WeatherLink 0.2.4 is the latest listed release and targets .NET 10. The numerically higher, unlisted 1.0.0 is an old incomplete API and is intentionally not used. Redundant explicit JSON/logging/HTTP package references were removed where supplied by the framework or ASP.NET extension.

## Azure configuration

Configure the existing Function App for **.NET 10 isolated**, Functions v4, and the settings above before deploying. The workflow uploads files but does not update runtime stacks or hosting plans.

**.NET 10 does not support Linux classic Consumption.** The existing `redfieldWeatherLink` app was inspected on **October 4, 2026** and is on **Windows Consumption (Y1)** in East US, using `ASP-redfieldWeather-bf9a` and a **64-bit worker**. Keep this compatible plan, Function App, hostname, and storage accounts; no plan migration or resource recreation is needed. The workflow preserves current publish-profile deployment to `redfieldWeatherLink`. A future move to Linux Flex would require separate provisioning and deployment configuration/authentication changes.

Allow exact production Static Web Apps/custom domain origins in Function App CORS. Include localhost and specific PR-preview origins as needed. Static Web Apps navigation fallback is not an API proxy.

### Runtime upgrade and rollback

**Migration status, October 4, 2026:** the owner approved upgrading the live runtime before the PR merge. Azure CLI successfully changed `netFrameworkVersion` from `v8.0` to `v10.0` and confirmed `use32BitWorkerProcess=false`. Existing Functions v4 / `dotnet-isolated` settings, the Windows Consumption plan, hostname, storage, and credentials were not changed. The .NET 10 code is not deployed by this setting change; merge the PR and check the API deployment workflow.

Use Azure Cloud Shell or an authenticated Azure CLI. Verify that your active subscription contains the existing `redfieldWeather` resource group before running these commands. The configuration command changes only the Windows .NET runtime and worker bitness; it does not create, delete, or move resources, or overwrite WeatherLink/storage credentials.

Record the current non-secret runtime settings before changing anything:

```azurecli
az functionapp config show --resource-group redfieldWeather --name redfieldWeatherLink --query "{netFrameworkVersion:netFrameworkVersion,use32BitWorkerProcess:use32BitWorkerProcess}" --output json
az functionapp config appsettings list --resource-group redfieldWeather --name redfieldWeatherLink --query "[?name=='FUNCTIONS_WORKER_RUNTIME' || name=='FUNCTIONS_EXTENSION_VERSION'].{name:name,value:value}" --output table
```

The worker must be `dotnet-isolated` and Functions must use `~4`. The following command is repeatable for this existing Windows app; it updates and reads back the runtime:

```azurecli
az functionapp config set --resource-group redfieldWeather --name redfieldWeatherLink --net-framework-version v10.0 --use-32bit-worker-process false --output none
az functionapp config show --resource-group redfieldWeather --name redfieldWeatherLink --query "{netFrameworkVersion:netFrameworkVersion,use32BitWorkerProcess:use32BitWorkerProcess}" --output json
```

Expect `v10.0` and `false`. **A runtime change can restart the live app.** Coordinate it with the .NET 10 deployment; upgrading the host setting does not deploy the new code. During this migration the owner explicitly requested the runtime change before merging the PR. The production API continues to use its previous deployment until the API workflow runs on `main`.

After deployment, check all three HTTP endpoints for successful responses, confirm all five functions are enabled, and verify the timer collectors produce fresh data. A build or publish passing locally does not prove that production credentials, storage permissions, or CORS are correct.

For rollback, redeploy the last known-good .NET 8 artifact and restore the recorded runtime setting. The original app was .NET 8 isolated; its recorded setting was `v8.0`, with a 64-bit worker. Restore that runtime with:

```azurecli
az functionapp config set --resource-group redfieldWeather --name redfieldWeatherLink --net-framework-version v8.0 --use-32bit-worker-process false --output none
```

Restore code and runtime together in a maintenance window. Do not delete the tables or storage accounts: they contain the existing weather history. See Microsoft's [isolated-worker deployment guidance](https://learn.microsoft.com/azure/azure-functions/dotnet-isolated-process-guide#deploy-to-azure-functions) for Windows runtime requirements.

## Build and deploy

From the repository root:

```powershell
dotnet publish api/src/RedfieldWeather/RedfieldWeather.csproj --configuration Release --output artifacts/functionapp -warnaserror
```

Deploy the whole output, including `host.json`, `functions.metadata`, `worker.config.json`, and `.azurefunctions`. Do not deploy just the main assembly.

[redfieldWeatherLink.yml](../.github/workflows/redfieldWeatherLink.yml) publishes with .NET 10, includes hidden files in its artifact, and deploys with the existing secret:

```text
redfieldWeatherLink_69CB
```

PRs only build. Production deployment runs on `main` pushes or manual runs on `main`. Deploy and verify API runtime/settings before relying on the frontend migration. The Aspire AppHost is not deployed by either workflow.

The workflow fails on compiler/build warnings as well as errors. The existing publish-profile secret name is retained; its presence was checked during migration, but only a successful production deployment verifies that its credential is still valid.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Worker fails after deploying | .NET 10 isolated stack, Functions v4, and full publish output including `.azurefunctions` |
| Missing weather storage setting | Nested environment variable or local connection-string section |
| Storage connection refused locally | Emulator is running and Table service is reachable |
| Storage permissions fail | Connection string needs table read/write/create access |
| WeatherLink rejects requests | Credentials, account access, and station ID |
| Current endpoint returns `204` | Inspect collection logs and wait for a timer tick |
| History returns `400` | Integer `days` from 1 to 30 |
| curl works but SPA fails | Function App CORS for the exact browser origin |
| Local timers write cloud data | Check both connection strings; use Aspire local storage or disable timers |

Host logging and optional Application Insights settings are in [host.json](./src/RedfieldWeather/host.json). See the [main README](../README.md) for solution-wide commands.
