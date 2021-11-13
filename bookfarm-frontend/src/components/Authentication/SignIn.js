import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jwt from 'jwt-decode';

import ForgotPasswordModal from './ForgotPasswordModal';
import APIConfig from '../../apis/server';
import createNotification from '../util/Notification';
import { changeAuthState } from '../../actions';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class SignIn extends Component{
    state = {
        show : false,
        email : '',
        password : '',
        disabled : false
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({disabled : true});
        const {email,password} = this.state;

        const payload = {email,password};

        APIConfig.post('/auth/login/',payload,{
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            const user = jwt(response.data.token);
            // console.log(user)
            localStorage.setItem('token', response.data.token);
            this.props.changeAuthState(user);
            
        })
        .catch(err => {
            if(err.response && err.response.data && err.response.data.detail)createNotification(err.response.data.detail, 'error');
            else createNotification('Some error occurred! Please try again', 'error');
            this.setState({disabled:false});
        })
    }

    render = () => {
        return (
            <div className="container">
                <ForgotPasswordModal 
                    show={this.state.show} 
                    handleClose={() => this.setState({show : false})}
                />  
            <div className="row">
                <div className="col-lg-4 col-md-3 col-sm-6 col-6"></div>
                <div className="col-lg-4 col-md-6 p-3">
                    {/* <div className="alert alert-danger" >{{ error_message }} </div> */}
                    <div className="card text-center" >
                        <div className="header my-3">Login Form</div>
                        <div className="card-body">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label for="email">email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="form-control"  
                                        name="email" 
                                        value={this.state.email}
                                        onChange={event => this.setState({email:event.target.value})}
                                        required 
                                    />
                                </div> 
                                <div className="form-group">
                                    <label for="password">password</label>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        className="form-control"  
                                        name="password" 
                                        value={this.state.password}
                                        onChange={event => this.setState({password:event.target.value})}
                                        required
                                    />
                                </div>
                                <button className="m-3 btn btn-primary" type="submit"> Log In</button>
                                <div className="form-group">
                                    <a href="" onClick={
                                        (event) => {
                                            event.preventDefault();
                                            this.setState({show : true})
                                        }
                                    }>Forgot Password ?</a>
                                </div>  
                                <div className="p-3">
                                    Don't have an Account? 
                                    <Link to='/signup' >Sign Up</Link>
                                </div>
                                
                            </form>
                        </div>
                    </div>       
                </div>
                <div className="col"></div>
            </div>    
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
}

export default connect(mapStateToProps,{
    changeAuthState
})(SignIn);