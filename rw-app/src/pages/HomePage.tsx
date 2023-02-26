import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../AppInsights';

class HomePage extends React.Component {
    render(): React.ReactNode {
        return (
            <div>
                <h1>Redfield Weather</h1>
            </div>
        );
    }
}

export default withAITracking(reactPlugin, HomePage);