import { Route, Routes } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import { CurrentWeather } from "./utilities/CurrentWeather";
import { WeatherAlerts } from "./utilities/WeatherAlerts";
import AlertsPage from "./pages/AlertsPage";
import React from "react";

class RWRoutes extends React.Component<{
  weather: CurrentWeather | undefined;
  alerts: WeatherAlerts | undefined
}> {
  render(): React.ReactNode {
    return (
      <Routes>
        <Route key='conditions' path='/conditions' element={<HomePage weather={this.props.weather} alerts={this.props.alerts} />} />
        <Route key='alerts' path='/alerts' element={<AlertsPage alerts={this.props.alerts} />} />
        <Route key='about' path='/about' element={<AboutPage />} />
        <Route key='default' path='*' element={<HomePage weather={this.props.weather} alerts={this.props.alerts} />} />
      </Routes>
    )
  }
}

export default RWRoutes;