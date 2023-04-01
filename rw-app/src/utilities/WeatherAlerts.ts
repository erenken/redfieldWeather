import { IFeature } from "./interfaces/IFeatures";

export class WeatherAlerts {
    title: string = ''
    updated: Date = new Date();
    features: IFeature[] = [];

    constructor(data: WeatherAlerts) {
        this.title = data.title;
        this.updated = data.updated;
        this.features = data.features;
    }

    public get anyAlerts(): boolean {
        var alerts = this.features?.find(x => x.properties["@type"] === 'wx:Alert')
        return alerts ? true : false;
    }

    public get anyWarnings(): boolean {
        var warnings = this.features?.find(x => x.properties["@type"] === 'wx:Warning')
        return warnings ? true : false;
    }
}