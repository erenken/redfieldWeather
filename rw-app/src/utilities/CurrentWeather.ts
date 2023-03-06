import { ICurrentWeather } from "./interfaces/ICurrentWeather";
import { IDavisVantagePro2Plus } from "./interfaces/IDavisVantagePro2Plus";

var loading = false;
var lastData: ICurrentWeather | undefined;

export async function getCurrentWeather(): Promise<ICurrentWeather | undefined> {
    if (!loading) {
        loading = true;

        var response = await fetch('https://redfieldweatherlink.azurewebsites.net/api/GetCurrentWeather');
        var data = await response.json();
        lastData = data as ICurrentWeather;
        loading = false;
    }

    return lastData;
}

export function getVantagePro2PlusSensor(currentWeather?: ICurrentWeather): IDavisVantagePro2Plus | undefined {
    if (!currentWeather)
        return undefined;

    var sensor = currentWeather.sensors.filter(x => x.sensor_type === 46);
    return sensor[0].data[0] as IDavisVantagePro2Plus;
}

export async function updateCurrentWeather(setCurrentWeather: React.Dispatch<React.SetStateAction<ICurrentWeather | undefined>>) {
    const getWeather = async () => {
      var current = await getCurrentWeather();
      setCurrentWeather(current);
    };

    const interval = setInterval(getWeather, 60000);
    return () => clearInterval(interval);
  }

