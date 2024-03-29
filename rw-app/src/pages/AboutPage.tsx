import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../utilities/AppInsights';
import { Container } from 'react-bootstrap';

class AboutPage extends React.Component {
    render(): React.ReactNode {
        return (
            <>
                <br />
                <Container>
                    <p>
                        Data on this site is powered by a Davis Vantage Pro/2 weather station and a Davis AirLink, and is currently being
                        uploaded to <a href='https://www.weatherlink.com/embeddablePage/show/94b5cab2a1f34a9c889e09cf33b9b2b8/summary'>WeatherLink</a> using
                        a Davis <a href='https://www.davisinstruments.com/pages/weatherlink-live'>WeatherLink Live</a>.
                    </p>
                    <p>
                        I am in the process of converting this site to a ReactJS site using Azure Functions as the API.  There are two Azure Functions
                        <ul>
                            <li><a href='https://github.com/erenken/redfieldweather/blob/main/api/src/RedfieldWeather/WeatherLink/GetCurrent.cs'>GetCurrent</a></li>
                            <li><a href='https://github.com/erenken/redfieldweather/blob/main/api/src/RedfieldWeather/WeatherLink/GetTodayHighLow.cs'>GetTodayHighLow</a></li>
                        </ul>
                        These function pull data from the <a href='https://weatherlink.github.io/v2-api/'>WeatherLink API</a> every five minutes and stores it to Azure Table Storage.  
                        I am using this storage for current weather, highs &amp; lows, and history. This function uses a NuGet package <a href='https://www.nuget.org/packages/myNOC.WeatherLink'>myNOC.WeatherLink</a> 
                        I created to communicate with the WeatherLink API.
                    </p>
                    <p>
                        You can view the code to this website on GitHub in the <a href='https://github.com/erenken/redfieldweather'>redfieldweather Repository</a>.
                    </p>
                    <p>
                        On my <a href='https://github.com/erenken'>GitHub</a> you can also find the code to my myNOC.WeatherLink NuGet package as well as other projects.
                        One of my projects is an <a href='https://github.com/erenken/gateMonitor/blob/main/projects/remootio-angular/README.md'>Angular Service</a> that
                        works with a Remootio smart gate conroller.
                    </p>
                    <hr />
                </Container>
            </>
        );
    }
}

export default withAITracking(reactPlugin, AboutPage);