import React, {Component} from 'react';
import { Form, Formik, Field } from 'formik';
import APIConfig from '../../apis/server';
import createNotification from '../util/Notification';
import {Link} from 'react-router-dom';

import * as Yup from 'yup';

class SignUp extends Component{

    state = {
        disabled : false
    }

    handleSubmit = (values, {resetForm}) => {
        const {email, firstName, lastName, password} = values;

        this.setState({disabled : true});

        const payload = {
            email,
            first_name : firstName,
            last_name : lastName,
            password
        };

        APIConfig.post('/auth/signup/',payload,{
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            createNotification('Verification email sent. Follow instructions given in the email.', 'success');
            this.setState({disabled:false});
            resetForm();
        })
        .catch(err => {
            createNotification(err.response.data.email[0], 'error');
            this.setState({disabled:false});
        })
    }

    initialValues = {
        email : '',
        firstName : '',
        lastName : '',
        password : '',
        confirmPassword : ''
    }
    validationSchema = Yup.object().shape({
        email : Yup.string().email().required('Required'),
        firstName : Yup.string().required('Required'),
        lastName : Yup.string().required('Required'),
        password : Yup.string().required('Required'),
        confirmPassword : Yup.string().required('Required')
    })

    render = () => {
        return (
            <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-3 col-sm-6 col-6"></div>
                <div className="col-lg-4 col-md-6 p-3">
                    {/* <div className="alert alert-danger" >{{ error_message }} </div> */}
                    <div className="card text-center" >
                        <div className="header my-3">
                            <div className="h4 text-primary">Sign Up</div>
                        </div>
                        <div className="card-body">
                           <Formik
                                initialValues={this.initialValues}
                                validationSchema={this.validationSchema}
                                onSubmit={this.handleSubmit}
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
                                                />
                                                {errors.email&&touched.email?<small className="text-danger">{errors.email}</small>:null}
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
                                                <label htmlFor="password" >Password</label>
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
                                                <label htmlFor="confirmPassword" >Confirm Password</label>
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
                                                <button className="m-3 btn btn-primary" type="submit" disabled={this.state.disabled}> Sign Up</button>  
                                            </div>
                                            
                                        </Form>
                                       )
                                   }
                               }
                           </Formik>

                            <div className="p-3">
                                Already have an Account? <Link to='/signin' >Sign In</Link>
                            </div>
                        </div>
                    </div>       
                </div>
                <div className="col"></div>
            </div>    
        </div>
        )
    }
}

export default SignUp;