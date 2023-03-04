import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { currentWeather } from './utilities/WeatherContext';

class MainMenu extends React.Component {

    render(): React.ReactNode {
        const weather = currentWeather;
        const sensor = weather.sensors.filter((x: { Type: number; }) => x.Type === 46);
        const vantageSensor = sensor.data[0];

        return (
            <Navbar bg='primary' variant='dark' fixed='top' collapseOnSelect expand='lg'>
                <Navbar.Brand href='#currentConditions' className='px-4 me-auto'>
                    Redfield Weather
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link href='#currentConditions'>Current Conditions</Nav.Link>
                        <Nav.Link href='#maps'>Maps</Nav.Link>
                        <Nav.Link href='#about'>About</Nav.Link>
                     </Nav>
                    <Nav>
                        <Nav.Link href='#currentConditions'>
                           { vantageSensor.temp } ° F
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainMenu;
