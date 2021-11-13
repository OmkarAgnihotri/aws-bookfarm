import React, {Component} from 'react';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons'
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import '../../../assets/css/Navigation.css';
import { changeAuthState } from '../../../actions';
 
class Navigation extends Component{

    state = {
        redirect : false
    }

    onSignOut = () => {
        localStorage.removeItem('token');
        this.props.changeAuthState(null);
        this.setState({redirect : true});
    }

    render = () => {
        if(this.state.redirect){
            return <Redirect to='/signin' />;
        }
        
        return (
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light" id="navigation">
                <div className="container">
                    <Navbar.Brand style={{fontSize:'20px', fontWeight:'80px'}}>Book Farm</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse  id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link >
                                <Link to='/inventory'>Inventory</Link>
                            </Nav.Link>
                            <Nav.Link>
                                <Link to='/books' >Books</Link>
                            </Nav.Link>
                            <Nav.Link>
                                <Link to='/chats' >chats</Link>
                            </Nav.Link>
                            <Nav.Link>
                                <Link to='/wishlist' >Wish List</Link>
                            </Nav.Link>
                        </Nav>
                        <Nav className ="ms-auto align-middle">
                            <NavDropdown  title={
                                <>
                                    <span><FontAwesomeIcon icon = {faUserCircle} size='1x' /> {this.props.user.first_name}</span>
                                </>
                            } id="basic-nav-dropdown">
                                <NavDropdown.Item ><Link to='/profile' >Profile</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={this.onSignOut}>Log out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
   return {
       user : state.user
   }
}

export default connect(mapStateToProps, {changeAuthState})(Navigation);