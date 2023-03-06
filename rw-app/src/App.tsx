import { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './utilities/AppInsights';
import { ICurrentWeather } from './utilities/interfaces/ICurrentWeather';
import { updateCurrentWeather, getCurrentWeather } from './utilities/CurrentWeather';
import { RouterProvider } from 'react-router';
import { configureRoutes } from './Routes';

const App = () => {

  const [currentWeather, setCurrentWeather] = useState<ICurrentWeather | undefined>(undefined);
  
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
      <RouterProvider router={configureRoutes(currentWeather)} />
    </>
  );
}

export default withAITracking(reactPlugin, App);

