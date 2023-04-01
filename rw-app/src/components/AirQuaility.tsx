import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CurrentWeather } from '../utilities/CurrentWeather';
import { IAirLink } from '../utilities/interfaces/IAirLink';

class AirQuaility extends React.Component<{ weather: CurrentWeather | undefined }> {
    airLink?: IAirLink = undefined;

    render(): React.ReactNode {
        this.airLink = this.props.weather?.airLink;

        return (
            <>
                {this.airLink &&
                    <>
                        <br />
                        <Card>
                            <Card.Header>Air Quaility</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>AQI</Col>
                                    <Col align='end'>{this.airLink?.aqi_nowcast_val?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {this.airLink?.aqi_nowcast_desc}</Col>
                                </Row>
                                <Row>
                                    <Col>AQI Type</Col>
                                    <Col align='end'>{this.airLink?.aqi_type}</Col>
                                </Row>
                            </Card.Body>
                            {this.airLink.LastReportTime &&
                                <Card.Footer>
                                    <div>{new Date(this.airLink.LastReportTime).toLocaleString()}</div>
                                </Card.Footer>
                            }
                        </Card>
                    </>
                }
            </>
        );
    }
}

export default AirQuaility;