import { IAirLink } from "./IAirLink";
import { IVantagePro2Plus } from "./IVantagePro2Plus";
import { ISensorData } from "./ISensorData";
import { SensorType } from "../SensorType";

export interface ISensor {
    lsid: number;
    sensor_type: SensorType;
    data_structure_type: number;
    data: ISensorData[] | IVantagePro2Plus[] | IAirLink[];
}