import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../utilities/AppInsights';
import CurrentWeather from '../components/CurrentWeather';

class HomePage extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                <CurrentWeather />
            </div>
        );
    }
}

export default withAITracking(reactPlugin, HomePage);