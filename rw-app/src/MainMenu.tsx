import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { getVantagePro2PlusSensor } from './utilities/CurrentWeather';
import { ICurrentWeather } from './utilities/interfaces/ICurrentWeather';
import { IDavisVantagePro2Plus } from './utilities/interfaces/IDavisVantagePro2Plus';


class MainMenu extends React.Component<{ weather: ICurrentWeather | undefined }> {
    vantagePro?: IDavisVantagePro2Plus = undefined;

    render(): React.ReactNode {
        this.vantagePro = getVantagePro2PlusSensor(this.props.weather);
        
        return (
            <Navbar bg='primary' variant='dark' collapseOnSelect expand='lg'>
                <Navbar.Brand href='#currentConditions' className='px-4 me-auto'>
                    Redfield Weather
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link href='/current'>Current Conditions</Nav.Link>
                        <Nav.Link href='/maps'>Maps</Nav.Link>
                        <Nav.Link href='/about'>About</Nav.Link>
                     </Nav>
                    <Nav>
                        { this.vantagePro &&
                            <Nav.Link href='#currentConditions'>
                            { this.vantagePro.temp }° F
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainMenu;
