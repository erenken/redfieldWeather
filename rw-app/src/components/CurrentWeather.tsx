import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../utilities/AppInsights';

class CurrentWeather extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                Temp
            </div>
        );
    }
}

export default withAITracking(reactPlugin, CurrentWeather);