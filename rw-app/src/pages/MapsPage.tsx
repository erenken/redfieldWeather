import React from "react";
import { CurrentWeather } from "../utilities/CurrentWeather";
import { IVantagePro2Plus } from "../utilities/interfaces/IVantagePro2Plus";
import { reactPlugin } from "../utilities/AppInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { Container } from "react-bootstrap";

class MapsPage extends React.Component<{
    weather: CurrentWeather | undefined;
}> {
    vantagePro: IVantagePro2Plus | undefined;

    render(): React.ReactNode {
        this.vantagePro = this.props.weather?.vantagePro2Plus;
        const bingMapsKey = 'ArN_uCINsATm3wQuksB_B6P5TV-lwRSZ-x7LXEuBvpMsqDGskYPcCbVmxGNmYhrX';

        return (
            <>
                <br />
                <Container>
                    <img src="https://radar.weather.gov/ridge/standard/KIWX_loop.gif" alt="KIWX Radar Loop" />
                </Container>
            </>
        )
    }
}

export default withAITracking(reactPlugin, MapsPage);