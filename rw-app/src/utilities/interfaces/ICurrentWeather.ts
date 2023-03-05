import { ISensor } from "./ISensor";

export interface ICurrentWeather {
    station_id: number;
    sensors: ISensor[]    
}