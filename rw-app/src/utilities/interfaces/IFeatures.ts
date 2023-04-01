export interface IFeature {
    id: string;
    type: string;
    properties: {
        '@type': string;
        areaDesc: string;
        sent: Date;
        effective: Date;
        expires: Date;
        status: string;
        messageType: string;
        severity: string;
        certainty: string;
        senderName: string;
        headline: string;
        description: string;
        instructions: string;
    }
}