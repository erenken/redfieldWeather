import { RouteObject, createBrowserRouter } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import { CurrentWeather } from "./utilities/CurrentWeather";
import { WeatherAlerts } from "./utilities/WeatherAlerts";
import AlertsPage from "./pages/AlertsPage";

export function configureRoutes(currentWeather: CurrentWeather | undefined, weatherAlerts: WeatherAlerts | undefined) {
    const routes: RouteObject[] = [
      { path: "/current", element: <HomePage weather={currentWeather} alerts={weatherAlerts} /> },
      { path: "/alerts", element: <AlertsPage  alerts={weatherAlerts} /> },
      { path: "/about", element: <AboutPage />, errorElement: <AboutPage /> },
      { path: '*',  element: <HomePage weather={currentWeather} alerts={weatherAlerts} /> }
    ];
  
    const router = createBrowserRouter(routes);
    return router;
  }