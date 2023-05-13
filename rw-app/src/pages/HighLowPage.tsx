import React from "react";
import { HighLowWeather } from "../utilities/HighLowWeather";
import { Card, Col, Container, Row } from "react-bootstrap";
import { reactPlugin } from "../utilities/AppInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { IVantagePro2PlusArchive } from "../utilities/interfaces/IVantagePro2PlusArchive";
import { IAirLinkArchive } from "../utilities/interfaces/IAirLinkArchive";
import { CurrentWeather } from "../utilities/CurrentWeather";
import { IVantagePro2Plus } from "../utilities/interfaces/IVantagePro2Plus";

class HighLowPage extends React.Component<{
    highLows: HighLowWeather | undefined;
    weather: CurrentWeather | undefined;
}> {
    vantageProArchive: IVantagePro2PlusArchive | undefined;
    airLinkArchive: IAirLinkArchive | undefined;
    vantagePro: IVantagePro2Plus | undefined;

    render(): React.ReactNode {
        this.vantageProArchive = this.props.highLows?.vantagePro2Plus;
        this.vantagePro = this.props.weather?.vantagePro2Plus;

        this.airLinkArchive = this.props.highLows?.airLink;

        return (
            <>
                <br />
                <Container>
                    <Card>
                        <Card.Header>
                            Temperature
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>High</Col>
                                <Col align='end'>{this.vantageProArchive?.temp_hi}&deg; F</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.TemperatureHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Low</Col>
                                <Col align='end'>{this.vantageProArchive?.temp_lo}&deg; F</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.TemperatureLowAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Average</Col>
                                <Col align='end'>{this.vantageProArchive?.temp_avg}&deg; F</Col>
                                <Col align='end'></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>Heat Index</Col>
                                <Col align='end'>{this.vantageProArchive?.heat_index_hi}&deg; F</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.HeatIndexHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            {this.vantageProArchive?.temp_lo && this.vantageProArchive?.temp_lo <= 45 &&
                                <>
                                    <Row>
                                        <Col>Low Wind Chill</Col>
                                        <Col align='end'>{this.vantageProArchive?.wind_chill_lo}&deg; F</Col>
                                        <Col align='end'>{new Date(this.vantageProArchive?.WindChillLowAt!).toDisplayFormat()}</Col>
                                    </Row>
                                </>
                            }
                            <Row>
                                <Col>Feels Like High</Col>
                                <Col align='end'>{this.vantageProArchive?.thsw_index_hi}&deg; F</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.THSWIndexHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Feels Like Low</Col>
                                <Col align='end'>{this.vantageProArchive?.thsw_index_lo}&deg; F</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.THSWIndexLowAt!).toDisplayFormat()}</Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {new Date(this.props.highLows?.GeneratedAt!).toDisplayFormat()}
                        </Card.Footer>
                    </Card>
                    <br />
                    <Card>
                        <Card.Header>
                            Wind
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>High</Col>
                                <Col align='end'>{this.vantageProArchive?.wind_speed_hi} mph</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.WindSpeedHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Total Run</Col>
                                <Col align='end'>{this.vantageProArchive?.wind_run.toLocaleString(undefined, { maximumFractionDigits: 2 })} miles</Col>
                                <Col></Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {new Date(this.props.highLows?.GeneratedAt!).toDisplayFormat()}
                        </Card.Footer>
                    </Card>
                    <br />
                    <Card>
                        <Card.Header>
                            Rain
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>Rate High</Col>
                                <Col align='end'>{this.vantageProArchive?.rain_rate_hi_in} in</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.RainRateHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Total Day</Col>
                                <Col align='end'>{this.vantagePro?.rainfall_daily_in} in</Col>
                                <Col align='end'></Col>
                            </Row>
                            <Row>
                                <Col>Total Month</Col>
                                <Col align='end'>{this.vantagePro?.rainfall_monthly_in} in</Col>
                                <Col align='end'></Col>
                            </Row>
                            <Row>
                                <Col>Total Year</Col>
                                <Col align='end'>{this.vantagePro?.rainfall_year_in} in</Col>
                                <Col align='end'></Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {new Date(this.props.highLows?.GeneratedAt!).toDisplayFormat()}
                        </Card.Footer>
                    </Card>                    <br />
                    <Card>
                        <Card.Header>
                            Humidity
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>High</Col>
                                <Col align='end'>{this.vantageProArchive?.hum_hi}%</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.HumidityHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Low</Col>
                                <Col align='end'>{this.vantageProArchive?.hum_lo}%</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.HumidityLowAt!).toDisplayFormat()}</Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {new Date(this.props.highLows?.GeneratedAt!).toDisplayFormat()}
                        </Card.Footer>
                    </Card>
                    <br />
                    <Card>
                        <Card.Header>
                            Dew Point
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>High</Col>
                                <Col align='end'>{this.vantageProArchive?.dew_point_hi}&deg; F</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.DewPointHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Low</Col>
                                <Col align='end'>{this.vantageProArchive?.dew_point_lo}&deg; F</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.DewPointLowAt!).toDisplayFormat()}</Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {new Date(this.props.highLows?.GeneratedAt!).toDisplayFormat()}
                        </Card.Footer>
                    </Card>
                    <br />
                    <Card>
                        <Card.Header>
                            UV
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>High</Col>
                                <Col align='end'>{this.vantageProArchive?.uv_index_hi} Index</Col>
                                <Col align='end'>{new Date(this.vantageProArchive?.UVIndexHighAt!).toDisplayFormat()}</Col>
                            </Row>
                            <Row>
                                <Col>Average</Col>
                                <Col align='end'>{this.vantageProArchive?.uv_index_avg} Index</Col>
                                <Col align='end'></Col>
                            </Row>
                            <Row>
                                <Col>Solar Energy</Col>
                                <Col align='end'>{this.vantageProArchive?.solar_energy.toLocaleString(undefined, { maximumFractionDigits: 2 })} W/m<sup>2</sup></Col>
                                <Col align='end'></Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {new Date(this.props.highLows?.GeneratedAt!).toDisplayFormat()}
                        </Card.Footer>
                    </Card>
                    <br />
                    <Card>
                        <Card.Header>
                            Air Quality
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>High</Col>
                                <Col align='end'>{this.airLinkArchive?.aqi_hi_val.toLocaleString(undefined, { maximumFractionDigits: 2 })} </Col>
                                <Col align='end'>{this.airLinkArchive?.aqi_hi_desc}</Col>
                            </Row>
                            <Row>
                                <Col>Average</Col>
                                <Col align='end'>{this.airLinkArchive?.aqi_avg_val.toLocaleString(undefined, { maximumFractionDigits: 2 })} </Col>
                                <Col align='end'>{this.airLinkArchive?.aqi_avg_desc}</Col>
                            </Row>
                            <Row>
                                <Col>AQI Type</Col>
                                <Col align='end'>{this.airLinkArchive?.aqi_type}</Col>
                                <Col align='end'></Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {new Date(this.props.highLows?.GeneratedAt!).toDisplayFormat()}
                        </Card.Footer>
                    </Card>
                </Container>
            </>
        );
    }
}

export default withAITracking(reactPlugin, HighLowPage);