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
                    <div>
                        Data on this site is powered by a Davis Vantage Pro/2 weather station and a Davis AirLink, and is currently being
                        uploaded to <a href='https://www.weatherlink.com/embeddablePage/show/94b5cab2a1f34a9c889e09cf33b9b2b8/summary'>WeatherLink</a> using
                        a Davis <a href='https://www.davisinstruments.com/pages/weatherlink-live'>WeatherLink Live</a>.
                    </div>
                    <br />
                    <div>
                        I am in the process of converting this site to a ReactJS site using Azure Functions as the API.  There is a Azure Function
                        &nbsp;<a href='https://github.com/erenken/redfieldweather/blob/main/api/src/RedfieldWeather/WeatherLink/WeatherLinkGetCurrent.cs'>WeatherLinkGetCurrent</a> that pulls
                        data from the <a href='https://weatherlink.github.io/v2-api/'>WeatherLink API</a> every five minutes and stores it to Azure Table Storage.  I am using this storage for current weather and history.
                        This function uses a NuGet package <a href='https://www.nuget.org/packages/myNOC.WeatherLink'>myNOC.WeatherLink</a> I created to communicate with the WeatherLink API.
                    </div>
                    <br />
                    <div>
                        You can view the code to this website on GitHub in the <a href='https://github.com/erenken/redfieldweather'>redfieldweather Repository</a>.
                    </div>
                    <div>
                        On my <a href='https://github.com/erenken'>GitHub</a> you can also find the code to my myNOC.WeatherLink NuGet package as well as other projects.
                        One of my projects is an <a href='https://github.com/erenken/gateMonitor/blob/main/projects/remootio-angular/README.md'>Angular Service</a> that
                        works with a Remootio smart gate conroller.
                    </div>
                </Container>
            </>
        );
    }
}

export default withAITracking(reactPlugin, AboutPage);