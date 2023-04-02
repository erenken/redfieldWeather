import { CurrentWeather } from "../../utilities/CurrentWeather";

export interface IGraphState {
    historical?: CurrentWeather[];
    days: number
}
