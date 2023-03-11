import { createBrowserRouter } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import { CurrentWeather } from "./utilities/CurrentWeather";

export function configureRoutes(currentWeather: CurrentWeather | undefined) {
    const routes = [
      { path: "/", element: <HomePage weather={currentWeather} />, errorElement: <HomePage weather={currentWeather} /> },
      { path: "/current", element: <HomePage weather={currentWeather} />, errorElement: <HomePage weather={currentWeather} /> },
      { path: "/about", element: <AboutPage />, errorElement: <AboutPage /> }
    ];
  
    const router = createBrowserRouter(routes);
    return router;
  }