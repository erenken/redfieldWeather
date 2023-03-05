import { IAirLink } from "./IAirLink";
import { IDavisVantagePro2Plus } from "./IDavisVantagePro2Plus";
import { ISensorData } from "./ISensorData";

export interface ISensor {
    lsid: number;
    sensor_type: number;
    data_structure_type: number;
    data: ISensorData[] | IDavisVantagePro2Plus[] | IAirLink[];
}