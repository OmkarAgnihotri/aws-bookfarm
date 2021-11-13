import React from 'react';
import {connect} from 'react-redux';
import {fetchBooks, changeAuthState} from '../../actions';
import {Link, Redirect} from 'react-router-dom';
import { firestoreDB } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faBookmark, faTrash, faTrashAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { MDBTooltip } from 'mdbreact';
import APIConfig from '../../apis/server';
import createNotification from '../util/Notification';

class WishList extends React.Component{
    state = {
        redirect : false,
        selectedChat : null,
        queryText : '',
        wishlistedBooks : []
    }

    componentDidMount = () => {
        APIConfig.get(`users/${this.props.user.id}/wishlisted-books`,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response.data);
            this.setState({wishlistedBooks : response.data.map(item => {
                return {
                    itemId : item.id,
                    ...item.book
                }
            })});
        })
        .catch(err => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        })
    }

    onContactUser = async (owner) => {
        const index = this.props.chats.findIndex(chat => {
            // console.log(this.props.user, owner, chat);
            if((chat.user1.id === this.props.user.id && chat.user2.id === owner.id)
                || (chat.user2.id === this.props.user.id && chat.user1.id === owner.id)){
                
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

    onRemoveFromWishList = (itemId) => {
        APIConfig.delete(`users/${this.props.user.id}/wishlisted-books/${itemId}`,
        {
            headers : {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            createNotification('Book removed from Wish List!', 'warning');
            this.setState({
                wishlistedBooks : this.state.wishlistedBooks.filter(book => book.itemId !== itemId)
            })
        })
        .catch(err => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        })
    }

    onInputChange = (e) => {
        
        this.setState({
            queryText : e.target.value
        });

    }


    renderBooks = () => {
        if(this.state.wishlistedBooks.length === 0){
            return <div className="col-lg-4 col-md-5 col-12">
                    <div className="alert alert-warning">No books present</div>
                </div>
        }


        const booksToDisplay = this.state.wishlistedBooks
            .filter(book => book.title.toLowerCase().indexOf(this.state.queryText) > -1)
            .filter(book => book.owner.id !== this.props.user.id)
            .map((book, index) => {
            return (
                <div className="col-lg-3 col-md-4 col-sm-5 col-12 p-2 d-flex justify-content-center"  key={index} >
                    <div class="card" style={{width:'200px'}}>
                        <Link to={{
                            pathname:`/books/detail/${book.id}`,
                            state : {
                                previousPage : '/books',
                                queryText : this.state.queryText
                            }
                        }}>
                            <img
                                src={book.imageUrl}
                                className="card-img-top"
                                alt="..."
                                style={{height:'220px'}}
                                />
                        </Link>
                        <div class="card-body">
                            <div style={{maxHeight:'50px', minHeight:'50px',overflow:'hidden',textOverflow:'ellipsis'}}>
                                <h5 class="card-title pb-4">{book.title}</h5>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col text-center">
                                        <span className="float-start px-2">
                                            <MDBTooltip 
                                                domElement
                                                tag="span"
                                                placement="top">
                                                    <span>
                                                        <a href="" onClick={(e) => {
                                                            e.preventDefault();
                                                            this.onContactUser(book.owner);
                                                        }}>
                                                            <FontAwesomeIcon icon={faComments} size='2x' className="text-primary" /> 
                                                        </a>
                                                    </span>
                                                    <span>Click to contact owner</span>
                                            </MDBTooltip>
                                        </span>
                                        <span className=" px-2 float-end">
                                            <MDBTooltip domElement
                                                tag="span"
                                                placement="top">
                                                    <span>
                                                        <a href="" onClick={(e) => {
                                                            e.preventDefault();
                                                            this.onRemoveFromWishList(book.itemId);
                                                        }}>
                                                            <FontAwesomeIcon icon={faTrashAlt} size='2x' className="text-danger" /> 
                                                        </a>
                                                    </span>
                                                    <span>Remove from Wish List</span>
                                            </MDBTooltip>
                                        </span>
                                        
                                    
                                        {/* <button data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top" className="btn btn-outline-primary btn-sm" onClick={() => this.onContactUser(book.owner)}><small>contact owner</small></button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
            )
        })

        if(booksToDisplay.length === 0){
            return (
                <div className="row justify-content-center mt-4">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="alert alert-warning">No books present</div>
                    </div>
                </div>
                
            )
        }
        else {
            return (
                <>

                    <div className="row justify-content-center mt-2 py-2">
                        
                        <div className="col-lg-4 col-md-8 col-12">
                            <input 
                                className="form-control" 
                                value={this.state.queryText}
                                onChange={this.onInputChange}
                                placeholder="Enter title of the book"
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        {booksToDisplay}
                    </div>
                </>
            )
        }
    }

    render(){
        if(this.state.redirect){
            return <Redirect to={`/chats?active=${this.state.selectedChat}`} />
        }

        return (
            <div className= "container">
                <div className="row justify-content-center mt-2 py-2">
                    <div className="col-lg-4 col-md-10 col-12">
                        <div className="alert alert-primary">
                            <span><FontAwesomeIcon icon={faInfoCircle} /></span> These are books that you bookmarked
                        </div>
                    </div>
                </div>
                {this.renderBooks()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user,
        books : state.books,
        chats : state.chats
    }
}

export default connect(mapStateToProps, {
    fetchBooks,
    changeAuthState

})(WishList);