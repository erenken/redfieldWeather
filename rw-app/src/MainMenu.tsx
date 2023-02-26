import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

class MainMenu extends React.Component {
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
                        <Nav.Link href='#currentConditions'>
                            ° F
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainMenu;
