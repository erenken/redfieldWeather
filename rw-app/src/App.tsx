import { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './utilities/AppInsights';
import { CurrentWeather } from './utilities/CurrentWeather';
import { updateCurrentWeather, getCurrentWeather } from './utilities/WeatherLink';
import RWRoutes from './RWRoutes';
import { Col, Container, Row } from 'react-bootstrap';
import { WeatherAlerts } from './utilities/WeatherAlerts';
import { getActiveWeatherAlerts, updateActiveWeatherAlerts } from './utilities/NOAA';
import { BrowserRouter } from 'react-router-dom';


const App = () => {

  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | undefined>(undefined);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlerts | undefined>(undefined);

  //  Update Weather every 1 minute
  updateCurrentWeather(setCurrentWeather).then();
  updateActiveWeatherAlerts(setWeatherAlerts).then();

  //  If weather isn't set lets go get it.
  if (!currentWeather) getCurrentWeather().then(weather => setCurrentWeather(weather));
  if (!weatherAlerts) getActiveWeatherAlerts().then(alerts => setWeatherAlerts(alerts));

  return (
    <BrowserRouter >
      <MainMenu weather={currentWeather} alerts={weatherAlerts} />
      <br />
      <Container>
        <div>
          <h1>Redfield Weather</h1>
          Weather for the <a href='http://www.bing.com/maps/?q=41.7788401163317%20-86.18628'>Milton Township, Cass County Michigan</a> area.
        </div>
      </Container>
      <RWRoutes weather={currentWeather} alerts={weatherAlerts} />
      <br />
      <Container>
        <hr />
        <Row>
          <Col align='end'><a href='https://mynoc.com'>myNOC LLC</a> Copyright &copy;2023</Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
}

export default withAITracking(reactPlugin, App);

