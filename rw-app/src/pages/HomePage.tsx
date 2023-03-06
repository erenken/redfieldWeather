import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../utilities/AppInsights';
import CurrentConditions from '../components/CurrentConditions';
import { Container, Spinner } from 'react-bootstrap';
import { ICurrentWeather } from '../utilities/interfaces/ICurrentWeather';

class HomePage extends React.Component<{ weather: ICurrentWeather | undefined }> {
    render(): React.ReactNode {
        return (
            <Container>
                {this.props.weather
                    ? <CurrentConditions weather={this.props.weather} />
                    : <div className='d-flex justify-content-center'><Spinner variant='primary'></Spinner></div>
                }
            </Container>
        );
    }
}

export default withAITracking(reactPlugin, HomePage);