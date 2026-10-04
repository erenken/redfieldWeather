# Redfield Weather frontend

A standalone **.NET 10 Blazor WebAssembly SPA** hosted on Azure Static Web Apps. It runs in the browser and calls the separate weather Function App and National Weather Service. There is no React application, npm dependency tree, SSR, or web server to deploy.

## Run locally

To run the full stack, use the [Aspire AppHost](../apphost/README.md). It starts this app, Functions, and managed local storage. Aspire selects the dedicated `Aspire` environment with a local API URL; no Development override is needed for that mode.

From the repository root, with .NET 10 installed:

```powershell
dotnet run --project rw-app/RedfieldWeather.App.csproj
```

Open `http://localhost:5000`. The launch profile selects Development. The default API is `https://redfieldweatherlink.azurewebsites.net/api/`; it must allow localhost in CORS, or you can run the [API locally](../api/README.md#local-development).

## Configuration

Public configuration lives in [wwwroot/appsettings.json](./wwwroot/appsettings.json):

| Key | Meaning |
| --- | --- |
| `Weather:ApiBaseUrl` | Absolute API base URL, **including the trailing `/api/` slash** |
| `Weather:AlertPoint` | Latitude/longitude for NWS active alerts |

For local backend development, create ignored `wwwroot/appsettings.Development.json`:

```json
{
  "Weather": {
    "ApiBaseUrl": "http://localhost:7071/api/"
  }
}
```

The local Function App example allows `http://localhost:5000`. If you change the port, also update backend CORS. Production reads the main `appsettings.json`; environment overrides only apply when the Blazor hosting environment selects that environment.

**Every file in `wwwroot` is downloadable by visitors.** Never put WeatherLink credentials, storage connections, deployment tokens, or other secrets here. Static Web Apps application settings do not rewrite static Blazor configuration: change public JSON before publishing when targeting another backend.

## Pages and behavior

| Route | Content |
| --- | --- |
| `/`, `/conditions` | Current observations, rain storms, and AirLink readings |
| `/highLows` | Daily statistics and high/low times |
| `/graphs` | SVG history charts and selectable 1/3/7/30-day ranges |
| `/alerts` | NWS alerts, descriptions, and instructions |
| `/about` | Station and application information |

- Current conditions, highs/lows, and alerts load independently and refresh every minute without overlapping polls.
- Request failures do not block other feeds; previously loaded data remains visible with a notice.
- Missing readings display as `—`, not zero. Empty snapshots show a no-observations notice.
- Unix timestamps display in the browser's local timezone. Daily statistics use the Eastern-time station day.
- Graphs reload when opened or when the selected range changes; they do not automatically poll.
- Rain totals and rates have separate charts because their units differ. SVG horizontal axes use actual observation timestamps; legends and latest-readings details provide textual values.
- Rain-rate axes start at zero, including when every observation is zero. Hover over a chart point to see its series, value, unit, and local timestamp instead of the chart title.
- Browser Application Insights is not configured; the former React-specific telemetry integration was removed with React.
- Startup and data-loading screens show a locally bundled animated weather GIF, with a still image for visitors who prefer reduced motion. No third-party image service is used.

## Code map

| Location | Responsibility |
| --- | --- |
| [Program.cs](./Program.cs) | WebAssembly startup and services |
| [App.razor](./App.razor) | Routing and not-found UI |
| [Layout/](./Layout/) | Navigation and cancellable refresh loop |
| [Pages/](./Pages/) | Dashboard routes |
| [Components/](./Components/) | Cards, SVG charts, and shared-state subscriptions |
| [Models/](./Models/) | WeatherLink/NWS models and source-generated JSON metadata |
| [Services/](./Services/) | HTTP client, refresh state, and per-feed failures |
| [wwwroot/](./wwwroot/) | Public assets and deployment configuration |

The client uses **myNOC.WeatherLink 0.2.4** directly: `WeatherDataResponse` contains sensors deserialized by the package's `SensorJsonConverterFactory` into `Sensor<TReading>`. A `SensorFactory` is configured with the four supported payloads: `VantagePro2Plus`, `AirLink`, `VantagePro2PlusArchive`, and `AirLinkArchive`. The SDK handles sensor/data-structure matching. `WeatherSnapshot` only selects typed observations and caches their formatting wrappers; it no longer copies the wire envelope or deserializes JSON inside `FindSensor`.

`SensorReading<TReading>` wraps the SDK object (`Value`) and supplies null-safe, culture-aware formatting with compile-time-checked selectors:

```csharp
air.Format(reading => reading.PM2p5, " µg/m³");
station.Format(reading => reading.Temperature, " °F");
station.Time(reading => reading.UnixRainStormStartTime);
```

Cards use `WeatherMetric<TReading>` and charts use `ChartSeries<TReading>` with the same typed delegates, rather than string JSON keys. Missing/nonfinite numbers still display as `—`; missing timestamps remain absent rather than turning into the Unix epoch. Empty/unsupported sensors are skipped. WeatherLink API authentication and polling remain in the backend; no authenticated SDK client is registered in the browser.

JSON mappings now live in the SDK's models, rather than duplicated `JsonPropertyName` attributes in the app. Do not apply a global snake-case policy to these models: computed DateTimeOffset properties can collide with explicitly mapped Unix timestamp fields.

`WeatherJsonContext.WithSensors` attaches the SDK converter to source-generated response metadata. The converter also uses reflection and creates generic sensor/converter types internally. The project intentionally enables JSON reflection and roots the `myNOC.WeatherLink` assembly during trimming so its model properties and constructors survive Release publishing. This trades a somewhat larger download for direct reuse of the package's converter. Recheck a published WASM build whenever updating the SDK; a successful Debug build alone is not enough.

No external charting JavaScript or CSS CDN is required.

## Build and deploy

```powershell
dotnet publish rw-app/RedfieldWeather.App.csproj --configuration Release --output artifacts/website -warnaserror
```

The deployment root is **`artifacts/website/wwwroot`**, not the project or its parent publish directory. It contains `index.html`, `_framework`, configuration, styles, and favicons.

[websiteDeploy.yml](../.github/workflows/websiteDeploy.yml) installs .NET 10, publishes, and uploads prebuilt assets with `skip_app_build: true`, avoiding dependence on the Oryx container's SDK. `api_location` is empty because collectors and API stay in the separate Function App.

Compiler/build warnings fail the workflow. After publishing, smoke-test the deployed WASM output rather than only the Debug app: its trimmed assemblies must still support the WeatherLink sensor converter. A PR preview uses the production API by default; it does not deploy this branch's updated Functions code. Check both production workflows after merging and reload `/graphs` directly to confirm the SPA fallback.

Required GitHub secret:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_FLOWER_053A4890F
```

Same-repository PRs receive previews, removed when the PR closes. Fork PRs build without deploying. Preview sites call the configured backend, not an automatically created API preview; allow preview origins in backend CORS or configure a staging backend.

[staticwebapp.config.json](./wwwroot/staticwebapp.config.json) rewrites client routes to `index.html`, excludes framework/static/API assets, and supplies WASM MIME types. Missing framework files must return missing-file responses rather than HTML.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Browser blocks API requests | Function App CORS must include the exact current origin, including the development port |
| Wrong API endpoint | `ApiBaseUrl` must be absolute and end with `/api/` |
| Direct `/graphs` reload returns 404 | Confirm the SWA configuration was uploaded at the deployment root |
| Blazor never loads | Inspect `_framework` requests, WASM MIME types, and console errors; publish the full web root |
| Old configuration | Reload and inspect served `appsettings.json`; this is not a PWA and has no service-worker cache |
| Alerts fail independently | NWS is a separate public service; failures are reported per feed |
| All readings are dashes | Verify the API has collected observations and returned supported sensors |

See the [main README](../README.md) for architecture and [API README](../api/README.md) for backend setup.
