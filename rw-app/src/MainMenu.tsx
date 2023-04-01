import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { CurrentWeather } from './utilities/CurrentWeather';
import { IVantagePro2Plus } from './utilities/interfaces/IVantagePro2Plus';
import { WeatherAlerts } from './utilities/WeatherAlerts';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class MainMenu extends React.Component<{
    weather: CurrentWeather | undefined;
    alerts: WeatherAlerts | undefined
}> {

    vantagePro?: IVantagePro2Plus = undefined;
    alerts?: boolean = false;

    render(): React.ReactNode {
        this.vantagePro = this.props.weather?.vantagePro2Plus;
        this.alerts = this.props.alerts?.anyAlerts;

        return (
            <Navbar bg='primary' variant='dark' collapseOnSelect expand='lg'>
                <Navbar.Brand href='/current' className='px-4 me-auto'>
                    Redfield Weather
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link href='/current'>Current Conditions</Nav.Link>
                        <Nav.Link href='/alerts'>
                            Alerts
                            {this.alerts &&
                                <>
                                    &nbsp;
                                    <FontAwesomeIcon icon={faTriangleExclamation} className='weatherAlerts' aria-label='Weather Alerts' />
                                </>
                            }
                        </Nav.Link>
                        {/* <Nav.Link href='/maps'>Maps</Nav.Link> */}
                        <Nav.Link href='/about'>About</Nav.Link>
                    </Nav>
                    <Nav>
                        {this.vantagePro &&
                            <Nav.Link href='/current'>{this.vantagePro.temp}° F</Nav.Link>
                        }
                        <div className='px-4'></div>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainMenu;
