import { ISensorData } from "./ISensorData";

export interface IAirLink extends ISensorData {
    hum?: number;
    pm_10_3_hour?: number;
    pm_10_24_hour?: number;
    pm_2p5_1_hour?: number;
    aqi_nowcast_val?: number;
    aqi_type?: string;
    heat_index?: number;
    pm_2p5_nowcast?: number;
    pm_2p5_24_hour?: number;
    pm_1?: number;
    pct_pm_data_nowcast?: number;
    pct_pm_data_24_hour?: number;
    wet_bulb?: number;
    aqi_val?: number;
    aqi_desc?: string;
    temp?: number;
    pm_2p5_3_hour?: number;
    pct_pm_data_3_hour?: number;
    last_report_time?: number;
    LastReportTime?: Date;
    aqi_nowcast_desc?: string;
    aqi_1_hour_val?: number;
    pm_10_nowcast?: number;
    aqi_1_hour_desc?: string;
    pm_10_1_hour?: number;
    dew_point?: number;
    pm_10?: number;
    pct_pm_data_1_hour?: number;
    ts?: number;
    TimeStamp?: Date;
    pm_2p5?: number;
    Type?: number;
    Description?: string;
}