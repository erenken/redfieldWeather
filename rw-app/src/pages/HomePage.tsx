import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../utilities/AppInsights';
import { Container, Spinner } from 'react-bootstrap';
import { CurrentWeather } from '../utilities/CurrentWeather';
import CurrentConditions from '../components/CurrentConditions';
import RainStorm from '../components/RainStorm';
import AirQuaility from '../components/AirQuaility';

class HomePage extends React.Component<{ weather: CurrentWeather | undefined }> {
    render(): React.ReactNode {
        return (
            <Container>
                {this.props.weather
                    ? this.mainPage()
                    : <div className='d-flex justify-content-center'><Spinner variant='primary'></Spinner></div>
                }
            </Container>
        );
    }

    mainPage(): React.ReactNode {
        return (
            <>
                <CurrentConditions weather={this.props.weather} />
                <AirQuaility weather={this.props.weather} />
                <RainStorm weather={this.props.weather} />
            </>
        )
    }
}

export default withAITracking(reactPlugin, HomePage);