import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ICurrentWeather } from "./utilities/interfaces/ICurrentWeather";

export function configureRoutes(currentWeather: ICurrentWeather | undefined) {
    const routes = [
      { path: "/", element: <HomePage weather={currentWeather} />, errorElement: <HomePage weather={currentWeather} /> }
    ];
  
    const router = createBrowserRouter(routes);
    return router;
  }