import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { IDavisVantagePro2Plus } from './utilities/interfaces/IDavisVantagePro2Plus';


class MainMenu extends React.Component<{ vantagePro?: IDavisVantagePro2Plus | undefined }> {
    render(): React.ReactNode {
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
                        { this.props.vantagePro &&
                            <Nav.Link href='#currentConditions'>
                            { this.props.vantagePro.temp }° F
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainMenu;
