import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { getVantagePro2PlusSensor } from '../utilities/CurrentWeather';
import { ICurrentWeather } from '../utilities/interfaces/ICurrentWeather';
import { IDavisVantagePro2Plus } from '../utilities/interfaces/IDavisVantagePro2Plus';

class CurrentConditions extends React.Component<{ weather: ICurrentWeather | undefined }> {
    vantagePro?: IDavisVantagePro2Plus = undefined;

    render(): React.ReactNode {
        this.vantagePro = getVantagePro2PlusSensor(this.props.weather);

        return (
            <>
                <Card>
                    <Card.Header>Current Conditions</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>Temperature</Col>
                            <Col align='end'>{this.vantagePro?.temp}&deg; F</Col>
                        </Row>
                        {this.vantagePro?.thsw_index &&
                            <Row>
                                <Col>Feels Like</Col>
                                <Col align='end'>{this.vantagePro?.thsw_index}&deg; F</Col>
                            </Row>
                        }
                        {this.vantagePro?.temp && this.vantagePro.temp <= 45 &&
                            <Row>
                                <Col>Wind Chill</Col>
                                <Col align='end'>{this.vantagePro?.wind_chill}&deg; F</Col>
                            </Row>
                        }
                        {this.vantagePro?.hum &&
                            <Row>
                                <Col>Humidity</Col>
                                <Col align='end'>{this.vantagePro?.hum}%</Col>
                            </Row>
                        }
                        {this.vantagePro?.dew_point &&
                            <Row>
                                <Col>Dew Point</Col>
                                <Col align='end'>{this.vantagePro?.dew_point}&deg; F</Col>
                            </Row>
                        }
                        <br />
                        <Row>
                            <Col>Wind Speed</Col>
                            <Col align='end'>{this.vantagePro?.wind_speed_last} mph</Col>
                        </Row>
                        <Row>
                            <Col>Wind Direction</Col>
                            <Col align='end'>{this.vantagePro?.wind_dir_last}&deg;</Col>
                        </Row>
                        <Row>
                            <Col>Wind Gust</Col>
                            <Col align='end'>{this.vantagePro?.wind_speed_hi_last_10_min} mph</Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>Rain Rate</Col>
                            <Col align='end'>{this.vantagePro?.rain_rate_last_in} in/hr</Col>
                        </Row>
                        <Row>
                            <Col>Daily Rain</Col>
                            <Col align='end'>{this.vantagePro?.rainfall_daily_in} in</Col>
                        </Row>
                    </Card.Body>
                    {this.vantagePro &&
                        <Card.Footer>
                            <div>{new Date(this.vantagePro.TimeStamp).toLocaleString()}</div>
                        </Card.Footer>
                    }
                </Card>
            </>
        );
    }
}

export default CurrentConditions;