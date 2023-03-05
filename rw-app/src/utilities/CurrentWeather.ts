import { ICurrentWeather } from "./interfaces/ICurrentWeather";
import { IDavisVantagePro2Plus } from "./interfaces/IDavisVantagePro2Plus";

export async function getCurrentWeather(): Promise<ICurrentWeather> {
    var response = await fetch('https://redfieldweatherlink.azurewebsites.net/api/GetCurrentWeather');
    var data = await response.json();
    return data as ICurrentWeather;
}

export function getVantagePro2PlusSensor(currentWeather?: ICurrentWeather): IDavisVantagePro2Plus | undefined {
    if (!currentWeather)
        return undefined;

    var sensor = currentWeather.sensors.filter(x => x.sensor_type === 46);
    return sensor[0].data[0] as IDavisVantagePro2Plus;
}

