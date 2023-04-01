import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../utilities/AppInsights';
import { Card, Container } from 'react-bootstrap';
import { WeatherAlerts } from '../utilities/WeatherAlerts';
import { IFeature } from '../utilities/interfaces/IFeatures';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

class AlertsPage extends React.Component<{
    alerts: WeatherAlerts | undefined
}> {
    features?: IFeature[];

    render(): React.ReactNode {
        this.features = this.props.alerts?.features;

        return (
            <Container>
                {this.features && this.features.map((feature) => (
                    <>
                        <br />
                        <Card>
                            <Card.Header>
                                <>
                                    <FontAwesomeIcon icon={faTriangleExclamation} className='weatherAlerts' aria-label='Weather Alerts' />&nbsp;{feature.properties.headline}<br />
                                </>
                            </Card.Header>
                            <Card.Body>
                                <div dangerouslySetInnerHTML={{ __html: feature.properties.description.replaceAll('\n', '<br />') }} />
                            </Card.Body>
                            <Card.Footer>
                                <>
                                    Effective: {new Date(feature.properties.effective).toLocaleString()}
                                </>
                            </Card.Footer>
                        </Card>
                    </>
                ))}
                {(!this.features || this.features?.length === 0) &&
                    <>
                        <br />
                        <div>No alerts or warnings at this time.</div>
                    </>
                }
            </Container>
        );
    }
}

export default withAITracking(reactPlugin, AlertsPage);