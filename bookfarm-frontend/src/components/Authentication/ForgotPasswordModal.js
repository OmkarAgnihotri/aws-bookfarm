import React from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik'
import {connect} from 'react-redux';

import APIConfig from '../../apis/server';
import createNotification from '../util/Notification';

class ForgotPasswordModal extends React.Component{
    state = {
        email : ''
    }
    handleSubmit = () => {
        APIConfig.post('/auth/forgot-password/',{
            email : this.state.email
        })
        .then(response => {
            createNotification(response.data.detail, 'success');
        })
        .catch(err=>{
            
            createNotification(err.response.data.detail, 'error');
        });

        this.setState({email:''});
        this.props.handleClose();
    }

    render(){
        const { handleClose, show} = this.props;
        return (
            <Modal show={show} onHide={handleClose}>
                
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="h4">Forgot Password</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group my-2 p-2">
                                    <label htmlFor="email" >Enter your registered Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={this.state.email}
                                        onChange={(event)=>this.setState({email : event.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary " type="button" onClick={this.handleSubmit} >send email</button>
                    <button className="btn btn-danger float-end" type="button" onClick={handleClose}>cancel</button>
                </Modal.Footer>
                   
            </Modal>
        )
    }
}

export default ForgotPasswordModal;