import { DataStructureType } from "./DataStructureType";
import { SensorType } from "./SensorType";
import { ISensor } from "./interfaces/ISensor";
import { IAirLinkArchive } from "./interfaces/IAirLinkArchive";
import { IVantagePro2PlusArchive } from "./interfaces/IVantagePro2PlusArchive";

export class HighLowWeather {
    station_id: number = 0;
    sensors: ISensor[] = [];
    generated_at: number = 0;
    GeneratedAt: Date = new Date();

    constructor(data: HighLowWeather) {
        this.station_id = data.station_id;
        this.sensors = data.sensors;
        this.generated_at = data.generated_at;
        this.GeneratedAt = data.GeneratedAt;
    }

    public get vantagePro2Plus(): IVantagePro2PlusArchive | undefined {
        return this.getSensorData(SensorType.VantagePro2Plus, DataStructureType.ISSArchiveRecord) as IVantagePro2PlusArchive;
    }

    public get airLink(): IAirLinkArchive | undefined {
        return this.getSensorData(SensorType.AirLink, DataStructureType.AirLinkArchiveRecord) as IAirLinkArchive;
    }

    private getSensorData(sensorType: SensorType, dataType: DataStructureType): any {
        var sensor = this.sensors.filter(x => x.sensor_type === sensorType && x.data_structure_type === dataType);

        if (sensor.length > 0 && sensor[0].data.length > 0)
            return sensor[0].data[0];
        
        return undefined;
    }
}