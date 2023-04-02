import { CurrentWeather } from './utilities/CurrentWeather';
import { WeatherAlerts } from './utilities/WeatherAlerts';
import { HighLowWeather } from './utilities/HighLowWeather';

export interface IWeatherState {
  currentWeather?: CurrentWeather;
  highLowWeather?: HighLowWeather;
  weatherAlerts?: WeatherAlerts;
}
