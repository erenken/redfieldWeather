import { CurrentWeather } from "./CurrentWeather";
import { HighLowWeather } from "./HighLowWeather";

export async function getCurrentWeather(): Promise<CurrentWeather | undefined> {
  var response = await fetch('https://redfieldweatherlink.azurewebsites.net/api/GetCurrentWeather');
  var data = await response.json();
  return new CurrentWeather(data);
}

export async function getHighLowWeather(): Promise<HighLowWeather | undefined> {
  var response = await fetch('https://redfieldweatherlink.azurewebsites.net/api/GetHighLow');
  var data = await response.json();
  return new HighLowWeather(data);
}

export async function getHistoricWeather(): Promise<CurrentWeather[] | undefined> {
  var response = await fetch('https://redfieldweatherlink.azurewebsites.net/api/GetHistoric?days=7');
  var data = await response.json() as CurrentWeather[];
  return data.map(x => new CurrentWeather(x));
}
