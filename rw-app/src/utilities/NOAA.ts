import { WeatherAlerts } from "./WeatherAlerts";

export async function getWeatherAlerts(): Promise<WeatherAlerts | undefined> {
  var response = await fetch('https://api.weather.gov/alerts/active?zone=MIZ078');
  var data = await response.json();
  return new WeatherAlerts(data);
}