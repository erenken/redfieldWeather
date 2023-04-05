import React from "react";
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { reactPlugin } from "../utilities/AppInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { CurrentWeather } from "../utilities/CurrentWeather";
import { getHistoricWeather } from "../utilities/WeatherLink";
import { INameProperty } from "../_INameProperty";
import { Line, LineChart, ResponsiveContainer, TooltipProps, Tooltip, XAxis, YAxis, Label } from "recharts";
import { IVantagePro2Plus } from "../utilities/interfaces/IVantagePro2Plus";
import { IGraphState } from "./interfaces/IGraphState";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import moment from "moment";

const TemperatureTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element => {
    if (active && payload && payload.length) {
        return (
            <div className='tooltipLabel'>
                &nbsp;{new Date(label).toLocaleString()}&nbsp;<br />
                &nbsp;&nbsp;&nbsp;{payload[0].value}° F`&nbsp;
            </div>
        );
    }

    return (
        <div></div>
    );
};

const HumidityTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element => {
    if (active && payload && payload.length) {
        return (
            <div className='tooltipLabel'>
                &nbsp;{new Date(label).toLocaleString()}&nbsp;<br />
                &nbsp;&nbsp;&nbsp;{payload[0].value}%&nbsp;
            </div>
        );
    }

    return (
        <div></div>
    );
};

const RainTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element => {
    if (active && payload && payload.length) {
        return (
            <div className='tooltipLabel'>
                &nbsp;{new Date(label).toLocaleString()}&nbsp;<br />
                &nbsp;&nbsp;&nbsp;{payload[0].value} in&nbsp;<br />
                &nbsp;&nbsp;&nbsp;{payload[1].value} in/hr&nbsp;<br />
            </div>
        );
    }

    return (
        <div></div>
    );
};

const UVIndexTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element => {
    if (active && payload && payload.length) {
        return (
            <div className='tooltipLabel'>
                &nbsp;{new Date(label).toLocaleString()}&nbsp;<br />
                &nbsp;&nbsp;&nbsp;{payload[0].value} Index&nbsp;<br />
            </div>
        );
    }

    return (
        <div></div>
    );
};

const WindTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element => {
    if (active && payload && payload.length) {
        return (
            <div className='tooltipLabel'>
                &nbsp;{new Date(label).toLocaleString()}&nbsp;<br />
                &nbsp;&nbsp;&nbsp;{payload[0].value} mph&nbsp;<br />
            </div>
        );
    }

    return (
        <div></div>
    );
};

const CustomDateAxisLabel = (value: any): string => {
    return ` ${moment(value).format('M/D')} `;
}

class GraphsPage extends React.Component<INameProperty, IGraphState> {
    constructor(props: any) {
        super(props);

        this.state = { 
            historical: undefined,
            days: 0
        };
    }

    async componentDidMount() {
        await this.getHistoric(0);
    }

    private async getHistoric(days: number) {
        let historical: CurrentWeather[] | undefined;
        historical = await getHistoricWeather(days);

        this.setState({ 
            historical: historical,
            days: days
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <br />
                <Container>
                    {this.state.historical
                        ? this.graphsPage()
                        : <div className='d-flex justify-content-center'><Spinner variant='primary'></Spinner></div>
                    }
                </Container>
            </>
        );
    }

    async daysChanged(e: React.ChangeEvent<HTMLSelectElement>) {
        await this.getHistoric(parseInt(e.target.value));
    }

    graphsPage(): React.ReactNode {
        let vantagePro: (IVantagePro2Plus | undefined)[] | undefined;
        vantagePro = this.state.historical?.map(x => x.vantagePro2Plus);

        return (
            <>
                <Row>
                    <Col align='end'>
                        <select title='Days' onChange={async (e) => await this.daysChanged(e)} value={this.state.days} >
                            <option value={0}>1 day</option>
                            <option value={1}>2 days</option>
                            <option value={2}>3 days</option>
                            <option value={3}>4 days</option>
                            <option value={4}>5 days</option>
                            <option value={5}>6 days</option>
                            <option value={6}>7 days</option>
                        </select>
                    </Col>
                </Row>
                <br />
                <Card>
                    <Card.Header>
                        Temperature
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={vantagePro}>
                                <XAxis dataKey='TimeStamp' tickFormatter={CustomDateAxisLabel}>
                                    <Label value='Date' offset={-5} position='insideBottom' />
                                </XAxis>
                                <YAxis dataKey='temp'>
                                    <Label value='° F' angle={-90} position='insideLeft' />
                                </YAxis>
                                <Line type='monotone' dataKey='temp' stroke='blue' />
                                <Tooltip content={<TemperatureTooltip />} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
                <br />
                <Card>
                    <Card.Header>
                        Wind
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={vantagePro}>
                                <XAxis dataKey='TimeStamp' tickFormatter={CustomDateAxisLabel}>
                                    <Label value='Date' offset={-5} position='insideBottom' />
                                </XAxis>
                                <YAxis dataKey='wind_speed_last'>
                                    <Label value='mph' angle={-90} position='insideLeft' />
                                </YAxis>
                                <Line type='monotone' dataKey='wind_speed_last' stroke='blue' />
                                <Tooltip content={<WindTooltip />} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
                <br />
                <Card>
                    <Card.Header>
                        Humidity
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={vantagePro}>
                                <XAxis dataKey='TimeStamp' tickFormatter={CustomDateAxisLabel}>
                                    <Label value='Date' offset={-5} position='insideBottom' />
                                </XAxis>
                                <YAxis dataKey='hum'>
                                    <Label value='%' angle={-90} position='insideLeft' />
                                </YAxis>
                                <Line type='monotone' dataKey='hum' stroke='blue' />
                                <Tooltip content={<HumidityTooltip />} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
                <br />
                <Card>
                    <Card.Header>
                        Rain
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={vantagePro}>
                                <XAxis dataKey='TimeStamp' tickFormatter={CustomDateAxisLabel}>
                                    <Label value='Date' offset={-5} position='insideBottom' />
                                </XAxis>
                                <YAxis>
                                    <Label value='in' angle={-90} position='insideLeft' />
                                </YAxis>
                                <Line type='monotone' dataKey='rainfall_daily_in' stroke='blue' />
                                <Line type='monotone' dataKey='rain_rate_last_in' stroke='green' />
                                <Tooltip content={<RainTooltip />} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
                <br />
                <Card>
                    <Card.Header>
                        UV Index
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={vantagePro}>
                                <XAxis dataKey='TimeStamp' tickFormatter={CustomDateAxisLabel}>
                                    <Label value='Date' offset={-5} position='insideBottom' />
                                </XAxis>
                                <YAxis dataKey='uv_index'>
                                    <Label value='Index' angle={-90} position='insideLeft' />
                                </YAxis>
                                <Line type='monotone' dataKey='uv_index' stroke='blue' />
                                <Tooltip content={<UVIndexTooltip />} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default withAITracking(reactPlugin, GraphsPage);