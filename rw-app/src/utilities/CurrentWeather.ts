import { SensorType } from "./SensorType";
import { ISensor } from "./interfaces/ISensor";
import { IVantagePro2Plus } from "./interfaces/IVantagePro2Plus";
import { IAirLink } from "./interfaces/IAirLink";

export class CurrentWeather {
    station_id: number = 0;
    sensors: ISensor[] = [];
    generated_at: number = 0;
    generatedAt: Date = new Date();

    constructor(data: CurrentWeather) {
        this.station_id = data.station_id;
        this.sensors = data.sensors;
        this.generated_at = data.generated_at;
        this.generatedAt = data.generatedAt;
    }

    public get vantagePro2Plus(): IVantagePro2Plus | undefined {
        return this.getSensorData(SensorType.VantagePro2Plus) as IVantagePro2Plus;
    }

    public get airLink(): IAirLink | undefined {
        return this.getSensorData(SensorType.AirLink) as IAirLink;
    }

    private getSensorData(sensorType: SensorType): any {
        var sensor = this.sensors.filter(x => x.sensor_type === sensorType);

        if (sensor.length > 0 && sensor[0].data.length > 0)
            return sensor[0].data[0];
        
        return undefined;
    }
}