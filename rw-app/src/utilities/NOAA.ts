import { WeatherAlerts } from "./WeatherAlerts";

var loading = false;
var lastData: WeatherAlerts | undefined;

export async function getActiveWeatherAlerts(): Promise<WeatherAlerts | undefined> {
    if (!loading) {
        loading = true;

        var response = await fetch('https://api.weather.gov/alerts/active?zone=MIZ078');
        var data = await response.json();
        lastData = new WeatherAlerts(data);
        loading = false;
    }

    return lastData;
}

export async function updateActiveWeatherAlerts(setWeatherAlerts: React.Dispatch<React.SetStateAction<WeatherAlerts | undefined>>) {
    const getAlerts = async () => {
      var current = await getActiveWeatherAlerts();
      setWeatherAlerts(current);
    };

    const interval = setInterval(getAlerts, 60000);
    return () => clearInterval(interval);
  }
