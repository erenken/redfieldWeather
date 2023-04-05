import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CurrentWeather } from '../utilities/CurrentWeather';
import { IVantagePro2Plus } from '../utilities/interfaces/IVantagePro2Plus';

class CurrentConditions extends React.Component<{ weather: CurrentWeather | undefined }> {
    vantagePro?: IVantagePro2Plus = undefined;

    render(): React.ReactNode {
        this.vantagePro = this.props.weather?.vantagePro2Plus;

        return (
            <>
                <br />
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
                        <Row>
                            <Col>Rain Last 24 Hours</Col>
                            <Col align='end'>{this.vantagePro?.rainfall_last_24_hr_in} in</Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>UV Index</Col>
                            <Col align='end'>{this.vantagePro?.uv_index}</Col>
                        </Row>
                        <Row>
                            <Col>Solar Energy</Col>
                            <Col align='end'>{this.vantagePro?.solar_rad.toLocaleString(undefined, { maximumFractionDigits: 2 })} W/m<sup>2</sup></Col>
                        </Row>
                    </Card.Body>
                    {this.vantagePro &&
                        <Card.Footer>
                            <div>{new Date(this.vantagePro.TimeStamp).toDisplayFormat()}</div>
                        </Card.Footer>
                    }
                </Card>
            </>
        );
    }
}

export default CurrentConditions;