import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CurrentWeather } from '../utilities/CurrentWeather';
import { IVantagePro2Plus } from '../utilities/interfaces/IVantagePro2Plus';

class RainStorm extends React.Component<{ weather: CurrentWeather | undefined }> {
    vantagePro?: IVantagePro2Plus = undefined;

    render(): React.ReactNode {
        this.vantagePro = this.props.weather?.vantagePro2Plus;

        return (
            <>
                <br />
                {this.vantagePro && (this.vantagePro.rain_storm_start_time || this.vantagePro.RainStormLastStartAt) &&
                    <Card>
                        <Card.Header>
                            Rain Storm
                        </Card.Header>
                        <Card.Body>
                            {this.vantagePro.rain_storm_start_time &&
                                <>
                                    <Row>
                                        <Col>Current Storm Started</Col>
                                        <Col align='end'>{new Date(this.vantagePro.RainStormStartTime).toLocaleString()}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Rain Total</Col>
                                        <Col align='end'>{this.vantagePro?.rain_storm_in} in</Col>
                                    </Row>
                                    <br />
                                </>
                            }
                            {this.vantagePro.rain_storm_last_start_at &&
                                <>
                                    <Row>
                                        <Col>Last Storm Started</Col>
                                        <Col align='end'>{new Date(this.vantagePro.RainStormLastStartAt).toLocaleString()}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Rain Total</Col>
                                        <Col align='end'>{this.vantagePro?.rain_storm_last_in} in</Col>
                                    </Row>
                                    <Row>
                                        <Col>Last Storm Ended</Col>
                                        <Col align='end'>{new Date(this.vantagePro.RainStormLastEndAt).toLocaleString()}</Col>
                                    </Row>
                                </>
                            }
                        </Card.Body>
                    </Card>
                }
            </>
        );
    }
}

export default RainStorm;