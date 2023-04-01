import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CurrentWeather } from '../utilities/CurrentWeather';
import { IVantagePro2Plus } from '../utilities/interfaces/IVantagePro2Plus';
import Moment from 'react-moment';

class RainStorm extends React.Component<{ weather: CurrentWeather | undefined }> {
    vantagePro?: IVantagePro2Plus = undefined;

    render(): React.ReactNode {
        this.vantagePro = this.props.weather?.vantagePro2Plus;

        return (
            <>
                {this.vantagePro && this.vantagePro.rain_storm_start_time &&
                    <>
                        <br />
                        <Card>
                            <Card.Header>
                                Current Rain Storm
                            </Card.Header>
                            <Card.Body>
                                {this.vantagePro.rain_storm_start_time &&
                                    <>
                                        <Row>
                                            <Col>Started</Col>
                                            <Col align='end'>{new Date(this.vantagePro?.RainStormStartTime).toLocaleString()}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Length</Col>
                                            <Col align='end'>
                                                <Moment duration={this.vantagePro?.RainStormStartTime} format="h [hours] mm [minutes]" durationFromNow={true}></Moment>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>Rain Total</Col>
                                            <Col align='end'>{this.vantagePro?.rain_storm_in} in</Col>
                                        </Row>
                                    </>
                                }
                            </Card.Body>
                            <Card.Footer>
                                It takes 24 hours without rain to end a storm event.
                            </Card.Footer>
                        </Card>
                    </>
                }
                {this.vantagePro && this.vantagePro.rain_storm_last_start_at &&
                    <>
                        <br />
                        <Card>
                            <Card.Header>
                                Last Rain Storm
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>Started</Col>
                                    <Col align='end'>{new Date(this.vantagePro.RainStormLastStartAt).toLocaleString()}</Col>
                                </Row>
                                <Row>
                                    <Col>Ended</Col>
                                    <Col align='end'>{new Date(this.vantagePro.RainStormLastEndAt).toLocaleString()}</Col>
                                </Row>
                                <Row>
                                    <Col>Duration</Col>
                                    <Col align='end'>
                                        <Moment duration={this.vantagePro.RainStormLastStartAt} format="h [hours] mm [minutes]" date={this.vantagePro.RainStormLastEndAt}></Moment>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Rain Total</Col>
                                    <Col align='end'>{this.vantagePro?.rain_storm_last_in} in</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </>
                }
            </>
        );
    }
}

export default RainStorm;