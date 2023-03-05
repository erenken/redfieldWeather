import React, { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './utilities/AppInsights';
import { ICurrentWeather } from './utilities/interfaces/ICurrentWeather';
import { getCurrentWeather, getVantagePro2PlusSensor } from './utilities/CurrentWeather';

const App = () => {

  const [currentWeather, setCurrentWeather] = useState<ICurrentWeather | undefined>(undefined);
  useEffect(() => {
    const getWeather = async () => {
      var current = await getCurrentWeather();
      setCurrentWeather(current);
    };

    const interval = setInterval(getWeather, 5000);
    return () => clearInterval(interval);
  });

  const vantagePro = getVantagePro2PlusSensor(currentWeather);
  
  return (
    <MainMenu vantagePro={vantagePro} />
  );
}

export default withAITracking(reactPlugin, App);
