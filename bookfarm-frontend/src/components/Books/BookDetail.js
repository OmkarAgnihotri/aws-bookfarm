import React from 'react';
import APIConfig from '../../apis/server';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from '../util/LoadingSpinner';
import defaultBookImage from '../../assets/images/book.png';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import { firestoreDB } from '../../config/firebase';

import { changeAuthState } from '../../actions';
import createNotification from '../util/Notification';


class BookDetail extends React.Component{
    state = {
        selectedBook : null,
        selectedChat : null,
        redirect : false
    }

    componentDidMount(){
        
        const bookId = this.props.match.params.bookId;

        APIConfig.get(`/books/${bookId}`,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            this.setState({
                selectedBook : response.data
            })
        })
        .catch((err) => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again.', 'error');
        });
    }

    renderTags = (tags = [] ,cssClass) => {
        return tags.map(tag => {
            return (<><div className={`col-lg-6 col-md-6 col-sm-6 col-6`}>
                    <div className={`p-3 ${cssClass}`}>
                        {tag.name}
                    </div>
                </div></>);
        });
    }

    onContactUser = async (owner) => {
        const index = this.props.chats.findIndex(chat => {
            // console.log(this.props.user, owner, chat);
            if(chat.user1.id === this.props.user.id && chat.user2.id === owner.id
                || chat.user2.id === this.props.user.id && chat.user1.id === owner.id){
                
                return true
            }
            return false
        })
        

        if(index == -1){
            const document = await firestoreDB.collection('chats')
            .add({
                user1 : {
                    id : this.props.user.id,
                    firstName : this.props.user.first_name,
                    lastName : this.props.user.last_name
                },
                user2 : {
                    id : owner.id,
                    firstName : owner.first_name,
                    lastName : this.props.user.last_name
                }
            })
            this.setState({
                selectedChat : document.id,
                redirect : true
            })
        }
        else {
            const document = this.props.chats[index]
            this.setState({
                selectedChat : document.id,
                redirect : true
            })
        }

    }

    renderOutput = () => {

        

        if(this.state.selectedBook){
            return (
                    <div className="card p-3">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                        <img  
                                            src={this.state.selectedBook.imageUrl || defaultBookImage } 
                                            style={{height:'220px', width:'200px'}}
                                            className="p-2" 
                                        />
                                </div>
                                <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col mt-2">
                                                <div className="h5">Uploaded By</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col  mt-3">
                                                
                                                <div className="h4 text-primary">
                                                    <FontAwesomeIcon icon={faUserCircle} size='2x' className="text-primary" /> {'\u00A0'}{'\u00A0'}
                                                    {`${this.state.selectedBook.owner.first_name}  ${this.state.selectedBook.owner.last_name}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-2">
                                    <div className="dropdown-divider"></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                    <div className="h5">Title</div>
                                </div>
                                <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                    {this.state.selectedBook.title}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-2">
                                    <div className="dropdown-divider"></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                    <div className="h5">Description</div>
                                </div>
                                <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                    {'No description available.'}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-2">
                                    <div className="dropdown-divider"></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                    <div className="h5">Authors</div>
                                </div>
                                <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                    <div className="container">
                                        <div className="row">
                                            {this.renderTags(this.state.selectedBook.authors, 'alert alert-warning')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-2">
                                    <div className="dropdown-divider"></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                    <div className="h5">Tags</div>
                                </div>
                                <div className="col-lg-8 col-md-7 col-sm-12 col-12 align-items-center p-2">
                                    <div className="container">
                                        <div className="row">
                                            {this.renderTags(this.state.selectedBook.tags, 'alert alert-primary')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-2">
                                    <div className="dropdown-divider"></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                    <div className="h5">Price</div>
                                </div>
                                <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                    {this.state.selectedBook.price}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col w-100 mt-4">
                                    {
                                        this.props.user.id === this.state.selectedBook.owner.id?(
                                            <Link to={{
                                                pathname:`/books/edit/${this.props.match.params.bookId}`,
                                                    state : {
                                                        previousPage : (this.props.location.state)?
                                                                        this.props.location.state.previousPage || '/books':'/books',
                                                        queryText : (this.props.location.state)?
                                                                        this.props.location.state.queryText || '':'',

                                                    }
                                                }}
                                                className="btn btn-primary"
                                            >
                                                Edit
                                            </Link>
                                        ):null
                                        
                                    }
                                    {
                                        this.props.user.id !== this.state.selectedBook.owner.id?(
                                            <button className="btn btn-outline-primary" onClick={() => this.onContactUser(this.state.selectedBook.owner)}>contact owner</button>
                                        ):null
                                        
                                    }
                                </div>
                                <div className="col w-100 mt-4">
                                    <Link to={{
                                        pathname : this.props.location.state?this.props.location.state.previousPage || '/books':'/books',
                                        state : {
                                            queryText : this.props.location.state?this.props.location.state.queryText || '':''
                                        }
                                    }} className="btn btn-primary">
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
            );
        }

        return (
            <div className="container d-flex justify-content-center" style={{paddingTop:'15%'}}>
                <LoadingSpinner />
            </div>
        );
    }

    
        render(){

            if(this.state.redirect){
                return <Redirect to={`/chats?active=${this.state.selectedChat}`} />
            }

            return (
                <div className="container mt-2">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-12">
                           {this.renderOutput()}
                        </div>
                    </div>
                </div>
            )
        }
    }

    const mapStateToProps = (state) => {
        return {
            user : state.user,
            chats : state.chats
        }
    }

export default connect(mapStateToProps, {
    changeAuthState
})(BookDetail);