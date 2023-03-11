import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { CurrentWeather } from './utilities/CurrentWeather';
import { IVantagePro2Plus } from './utilities/interfaces/IVantagePro2Plus';


class MainMenu extends React.Component<{ weather: CurrentWeather | undefined }> {
    vantagePro?: IVantagePro2Plus = undefined;

    render(): React.ReactNode {
        this.vantagePro = this.props.weather?.vantagePro2Plus;
        
        return (
            <Navbar bg='primary' variant='dark' collapseOnSelect expand='lg'>
                <Navbar.Brand href='#currentConditions' className='px-4 me-auto'>
                    Redfield Weather
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link href='/current'>Current Conditions</Nav.Link>
                        {/* <Nav.Link href='/maps'>Maps</Nav.Link> */}
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
