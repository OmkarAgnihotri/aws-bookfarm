import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faBookmark, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import {changeAuthState} from '../../actions';
import APIConfig from '../../apis/server';
import createNotification from '../util/Notification';
import {connect} from 'react-redux';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import {Redirect} from 'react-router-dom';

import LoadingSpinner from '../util/LoadingSpinner'


class ViewUserProfile extends React.Component{
    state = {
        redirect : false,
        user : null,
        initialValues : {
            email : '',
            firstName : '',
            lastName : '',
            current_password : '',
            password : '',
            confirmPassword : ''
        }
    }

    componentDidMount = () => {
        APIConfig.get(`users/${this.props.user.id}`, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            const { email, first_name, last_name} = response.data;
            this.setState({
                user : response.data,
                initialValues : {
                    email,
                    firstName: first_name,
                    lastName : last_name, 
                    current_password : '',
                    password : '',
                    confirmPassword : ''
                }
            });
        })
        .catch(err => {
            console.log(err.response.data);
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        })
    }

    handleSubmit = (values, {resetForm}) => {
        const {email, firstName, lastName, password} = values;
        this.setState({disabled : true});
        
        const payload = {
            first_name : firstName,
            last_name : lastName
        };

        if(values.password.length > 0){
            payload.current_password = values.current_password;
            payload.new_password = values.password
        }

        

        APIConfig.put(`users/${this.props.user.id}/`,payload,{
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(response => {
            createNotification('Profile updated successfully!', 'success');
            resetForm();
            this.setState({disabled:false, 
                initialValues : {...values, current_password:'', password:'', confirmPassword:''}
            });
            
        })
        .catch(err => {

            if(err.response && err.response.data && err.response.data.email)createNotification(err.response.data.email[0], 'error');
            else if(err.response && err.response.data && err.response.data.detail)createNotification(err.response.data.detail, 'error');
            else createNotification('Some error occurred! Please try again', 'error');
            this.setState({disabled:false});
        })
    }

    
    validationSchema = Yup.object().shape({
        email : Yup.string().email(),
        firstName : Yup.string(),
        lastName : Yup.string(),
        current_password : Yup.string(),
        password : Yup.string(),
        confirmPassword : Yup.string()
    })

    render() {

        if(this.state.redirect)return <Redirect to='/books' />;
        if(this.state.user === null){
            return (
                <div className="container d-flex justify-content-center" style={{paddingTop:'15%'}}>
                    <LoadingSpinner  />
                </div>
            )
        }

        return (
            <div className="container mt-2">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-10 col-12">
                        <div className="card p-3">
                            <div className="container">
                                <div className="row">
                                    <div className="col text-center text-primary">
                                        <span><FontAwesomeIcon icon = {faUserCircle} size='5x' /></span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="card-body">
                                <Formik
                                        initialValues={this.state.initialValues}
                                        validationSchema={this.validationSchema}
                                        onSubmit={this.handleSubmit}
                                        enableReinitialize 
                                >
                                    {
                                        ({values, errors, touched}) => {
                                            return (
                                                <Form>
                                                    <div className="form-group my-2 px-2 pt-2 pb-1">
                                                        <label htmlFor="email" >Email Address</label>
                                                        <Field 
                                                            id="email" 
                                                            name="email" 
                                                            className={
                                                                `form-control ${errors.email&&touched.email?'is-invalid':null}`
                                                            }
                                                            disabled={true}
                                                        />
                                                        {<small className="text-danger">You cannot change your email</small>}
                                                    </div>
                                                    <div className="form-group my-2 px-2 pt-2 pb-1">
                                                        <label htmlFor="firstName" >First Name</label>
                                                        <Field 
                                                            id="firstName" 
                                                            name="firstName" 
                                                            className={
                                                                `form-control ${errors.firstName&&touched.firstName?'is-invalid':null}`
                                                            }
                                                        />
                                                        {errors.firstName&&touched.firstName?<small className="text-danger">{errors.firstName}</small>:null}
                                                    </div>
                                                    <div className="form-group my-2 px-2 pt-2 pb-1">
                                                        <label htmlFor="lastName" >Last Name</label>
                                                        <Field 
                                                            id="lastName" 
                                                            name="lastName" 
                                                            className={
                                                                `form-control ${errors.lastName&&touched.lastName?'is-invalid':null}`
                                                            }
                                                        />
                                                        {errors.lastName&&touched.lastName?<small className="text-danger">{errors.lastName}</small>:null}
                                                    </div>
                                                    <div className="form-group my-2 px-2 pt-2 pb-1">
                                                        <label htmlFor="current_password" >Current Password</label>
                                                        <Field 
                                                            type="password" 
                                                            id="current_password" 
                                                            name="current_password" 
                                                            className={
                                                                `form-control ${errors.current_password&&touched.current_password?'is-invalid':null}`
                                                            }
                                                            validate={value => {
                                                                if(values.password.length > 0 && value.length === 0)return `Current password required`
                                                            }}
                                                            
                                                        />
                                                        {errors.current_password?<small className="text-danger">{errors.current_password}<br/></small>:null}
                                                        <small className="text-info">If you just reset your password, then Current password will be the one sent in mail.</small>
                                                    </div>
                                                    <div className="form-group my-2 px-2 pt-2 pb-1">
                                                        <label htmlFor="password" >New Password</label>
                                                        
                                                        <Field 
                                                            type="password" 
                                                            id="password" 
                                                            name="password" 
                                                            className={
                                                                `form-control ${errors.password&&touched.password?'is-invalid':null}`
                                                            }
                                            
                                                        />
                                                        
                                                        {errors.password&&touched.password?<small className="text-danger">{errors.password}</small>:null}
                                                        
                                                    </div>
                                                    <div className="form-group my-2 px-2 pt-2 pb-1">
                                                        <label htmlFor="confirmPassword" >Confirm new Password</label>
                                                        <Field 
                                                            type="password" 
                                                            id="confirmPassword" 
                                                            name="confirmPassword" 
                                                            className={
                                                                `form-control ${errors.confirmPassword&&touched.confirmPassword?'is-invalid':null}`
                                                            }
                                                            validate={value => {
                                                                if(values.password !== value)return `Passwords don't match.`
                                                            }}
                                                        />
                                                        {errors.confirmPassword&&touched.confirmPassword?<small className="text-danger">{errors.confirmPassword}</small>:null}
                                                    </div>
                                                    <div className="form-group my-2 px-2 pt-2 pb-1">
                                                        <button className="m-3 btn btn-primary" type="submit" disabled={this.state.disabled}> SAVE</button>  
                                                        <button className="m-3 btn btn-danger float-end" type="button" onClick={
                                                            (e) => {
                                                                this.setState({redirect : true});
                                                            }
                                                        } disabled={this.state.disabled}> cancel</button>  
                                                    </div>
                                                   
                                                </Form>
                                            )
                                        }
                                    }
                                </Formik>

                                    
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user
    }
}

export default connect(mapStateToProps, {
    changeAuthState
})(ViewUserProfile);