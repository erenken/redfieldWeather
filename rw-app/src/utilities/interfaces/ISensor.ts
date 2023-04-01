import { IAirLink } from "./IAirLink";
import { IAirLinkArchive } from "./IAirLinkArchive";
import { IVantagePro2Plus } from "./IVantagePro2Plus";
import { IVantagePro2PlusArchive } from "./IVantagePro2PlusArchive";
import { ISensorData } from "./ISensorData";
import { SensorType } from "../SensorType";
import { DataStructureType } from "../DataStructureType";

export interface ISensor {
    lsid: number;
    sensor_type: SensorType;
    data_structure_type: DataStructureType;
    data: ISensorData[] | IVantagePro2Plus[] | IAirLink[] | IVantagePro2PlusArchive[] | IAirLinkArchive[];
}