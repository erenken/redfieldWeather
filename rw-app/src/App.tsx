import { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './utilities/AppInsights';
import { CurrentWeather } from './utilities/CurrentWeather';
import { updateCurrentWeather, getCurrentWeather } from './utilities/WeatherLink';
import { RouterProvider } from 'react-router';
import { configureRoutes } from './Routes';
import { Col, Container, Row } from 'react-bootstrap';

const App = () => {

  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | undefined>(undefined);

  //  Update Weather every 1 minute
  useEffect(() => {
    updateCurrentWeather(setCurrentWeather).then();
  }, []);

  //  If weather isn't set lets go get it.
  if (!currentWeather) {
    getCurrentWeather().then(weather => setCurrentWeather(weather));
  }

  return (
    <>
      <MainMenu weather={currentWeather} />
      <br />
      <Container>
        <div>
          <h1>Redfield Weather</h1>
          Weather for the <a href='http://www.bing.com/maps/?q=41.7788401163317%20-86.18628'>Milton Township, Cass County Michigan</a> area.
        </div>
      </Container>
      <RouterProvider router={configureRoutes(currentWeather)} />
      <br />
      <Container>
        <hr />
        <Row>
          <Col align='end'><a href='https://mynoc.com'>myNOC LLC</a> Copyright &copy;2023</Col>
        </Row>
      </Container>
    </>
  );
}

export default withAITracking(reactPlugin, App);

