import { CurrentWeather } from "./CurrentWeather";

var loading = false;
var lastData: CurrentWeather | undefined;

export async function getCurrentWeather(): Promise<CurrentWeather | undefined> {
    if (!loading) {
        loading = true;

        var response = await fetch('https://redfieldweatherlink.azurewebsites.net/api/GetCurrentWeather');
        var data = await response.json();
        lastData = new CurrentWeather(data);
        loading = false;
    }

    return lastData;
}

export async function updateCurrentWeather(setCurrentWeather: React.Dispatch<React.SetStateAction<CurrentWeather | undefined>>) {
    const getWeather = async () => {
      var current = await getCurrentWeather();
      setCurrentWeather(current);
    };

    const interval = setInterval(getWeather, 60000);
    return () => clearInterval(interval);
  }

