import { WeatherAlerts } from "./WeatherAlerts";

export async function getWeatherAlerts(): Promise<WeatherAlerts | undefined> {
  var response = await fetch('https://api.weather.gov/alerts/active?point=41.76760,-86.17275');
  var data = await response.json();
  return new WeatherAlerts(data);
}