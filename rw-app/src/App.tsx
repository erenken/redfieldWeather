import MainMenu from './MainMenu';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './utilities/AppInsights';
import { CurrentWeather } from './utilities/CurrentWeather';
import { getCurrentWeather, getHighLowWeather } from './utilities/WeatherLink';
import RWRoutes from './RWRoutes';
import { Col, Container, Row } from 'react-bootstrap';
import { WeatherAlerts } from './utilities/WeatherAlerts';
import { getWeatherAlerts } from './utilities/NOAA';
import { BrowserRouter } from 'react-router-dom';
import { HighLowWeather } from './utilities/HighLowWeather';
import React from 'react';
import { IWeatherState } from './_IWeatherState';
import { INameProperty } from './_INameProperty';

class App extends React.Component<INameProperty, IWeatherState>{
  constructor(props: any) {
    super(props);

    this.state = {
      currentWeather: undefined,
      highLowWeather: undefined,
      weatherAlerts: undefined,
    };
  }

  syncWeatherData?: any;

  async componentDidMount() {
    await this.setWeatherState();

    if(!this.syncWeatherData) {
      this.syncWeatherData = setInterval(async () => await this.setWeatherState(), 60000);
    }
  }

  private async setWeatherState() {
    let current: CurrentWeather | undefined;
    let highLow: HighLowWeather | undefined;
    let alerts: WeatherAlerts | undefined;

    current = await getCurrentWeather();
    highLow = await getHighLowWeather();
    alerts = await getWeatherAlerts();

    this.setState({
        currentWeather: current,
        highLowWeather: highLow,
        weatherAlerts: alerts
    });
  }

  render(): React.ReactNode {
 
    return (
      <BrowserRouter >
        <MainMenu weather={this.state.currentWeather} alerts={this.state.weatherAlerts} />
        <br />
        <Container>
          <div>
            <h1>Redfield Weather</h1>
            Weather for the <a href='http://www.bing.com/maps/?q=41.7788401163317%20-86.18628'>Milton Township, Cass County Michigan</a> area.
          </div>
        </Container>
        <RWRoutes weather={this.state.currentWeather} alerts={this.state.weatherAlerts} highLows={this.state.highLowWeather} />
        <br />
        <Container>
          <Row>
            <Col align='end'><a href='https://mynoc.com'>myNOC LLC</a> Copyright &copy;2023</Col>
          </Row>
        </Container>
      </BrowserRouter>
    );
  }
}

export default withAITracking(reactPlugin, App);

