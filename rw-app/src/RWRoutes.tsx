import { Route, Routes } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import ConditionsPags from "./pages/ConditionsPage";
import { CurrentWeather } from "./utilities/CurrentWeather";
import { WeatherAlerts } from "./utilities/WeatherAlerts";
import AlertsPage from "./pages/AlertsPage";
import React from "react";
import { HighLowWeather } from "./utilities/HighLowWeather";
import HighLowPage from "./pages/HighLowPage";
import GraphsPage from "./pages/GraphsPage";

class RWRoutes extends React.Component<{
  weather: CurrentWeather | undefined;
  alerts: WeatherAlerts | undefined;
  highLows: HighLowWeather | undefined;
}> {
  render(): React.ReactNode {
    return (
      <Routes>
        <Route key='conditions' path='/conditions' element={<ConditionsPags weather={this.props.weather} alerts={this.props.alerts} />} />
        <Route key='highLow' path='/highLows' element={<HighLowPage highLows={this.props.highLows} weather={this.props.weather} />} />
        <Route key='graphs' path='/graphs' element={<GraphsPage name='Graphs' />} />
        <Route key='alerts' path='/alerts' element={<AlertsPage alerts={this.props.alerts} />} />
        <Route key='about' path='/about' element={<AboutPage />} />
        <Route key='default' path='*' element={<ConditionsPags weather={this.props.weather} alerts={this.props.alerts} />} />
      </Routes>
    )
  }
}

export default RWRoutes;