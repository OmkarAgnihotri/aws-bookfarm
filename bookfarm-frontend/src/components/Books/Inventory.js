import React from 'react';
import {connect} from 'react-redux';
import {fetchBooks, changeAuthState} from '../../actions';
import {Link} from 'react-router-dom';
import APIConfig from '../../apis/server';
import { faInfoCircle, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate'

import createNotification from '../util/Notification';

class Inventory extends React.Component{
    state = {
        books : [],
        filteredCollection : [],
        queryText : '',
        offset : 0,
        booksPerPage : 10
    }

    componentDidMount = () => {
        
        this.setState({queryText : this.props.location.state?this.props.location.state.queryText:''})
        APIConfig.get(`/users/${this.props.userId}/books/`,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => this.setState({books : response.data, filteredCollection : response.data}))
        .catch((err) => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        });
    }

    onInputChange = (e) => {
        
        this.setState({
            queryText : e.target.value,
            filteredCollection : this.state.books.filter(book => book.title.toLowerCase().indexOf(e.target.value) > -1)
        });

    }

    renderAvailableBooks = () => {
        const availableBooks =  this.state.filteredCollection.slice(this.state.offset, this.state.booksPerPage)
        .filter(book => book.isAvailable)
        .map((book, index) => {
            return (
                <div className="col-lg-3 col-md-4 col-sm-5 col-12 p-2 d-flex justify-content-center" key={index} >
                    <Link to={{
                        pathname:`/books/detail/${book.id}`,
                        state : {
                            previousPage : '/inventory',
                            queryText : this.state.queryText
                        }
                    }}>
                        <div class="card" style={{width:'200px'}}>
                            <img
                                src={book.imageUrl}
                                className="card-img-top"
                                alt="..."
                                style={{height:'220px'}}
                            />
                            <div class="card-body">
                                <h5 class="card-title">{book.title}</h5>

                            </div>
                        </div>
                    </Link>
                </div>
            )
        })

        if(availableBooks.length === 0){
            return (
                <div className="container">
                    <div className="row mt-3 justify-content-center">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="alert alert-warning">No books present</div>
                    </div>
                    </div>
                </div>
            )
        }
        else return availableBooks;
    }

    renderSoldBooks = () => {
        const soldBooks =  this.state.filteredCollection
        .slice(this.state.offset, this.state.booksPerPage)
        .filter(book => !book.isAvailable)
        .map((book, index) => {
            return (
                <div className="col-lg-3 col-md-4 col-sm-5 col-12 p-2 d-flex justify-content-center" key={index} >
                    <Link to={{
                        pathname:`/books/detail/${book.id}`,
                        state : {
                            previousPage : '/inventory',
                            queryText : this.state.queryText
                        }
                    }}>
                        <div class="card" style={{width:'200px'}}>
                            <img
                                src={book.imageUrl}
                                className="card-img-top"
                                alt="..."
                                style={{height:'220px', filter:'grayscale(1)'}}
                            />
                            <div class="card-body">
                                <h5 class="card-title">{book.title}</h5>

                            </div>
                        </div>
                    </Link>
                </div>
            )
        })
        
        if(soldBooks.length === 0){
            return (
                <div className="container">
                    <div className="row mt-3 justify-content-center">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="alert alert-warning">No Sold books present</div>
                    </div>
                    </div>
                </div>
            );
        }
        else return soldBooks;
    }

  

    render(){
       
        return (
            <div className= "container">
                <div className="row justify-content-center mt-2 py-2">
                    <div className="col-lg-4 col-md-10 col-12">
                        <div className="alert alert-primary">
                            <span><FontAwesomeIcon icon={faInfoCircle} /></span> These are books added by you
                        </div>
                    </div>
                </div>
                {
                    this.state.books.length > 0 ?
                    <div className="row justify-content-center mt-2 py-2">
                        <div className="col-lg-4 col-md-8 col-12">
                            <input 
                                className="form-control" 
                                value={this.state.queryText}
                                onChange={this.onInputChange}
                                placeholder="Enter title of the book"
                            />
                        </div>
                    </div> : null
                }
                <div className="row justify-content-center mt-2 py-2">
                    <div className="col d-flex justify-content-center">
                        <Link to='/books/new' className="btn btn-primary-outline d-flex align-items-center">
                        <span><FontAwesomeIcon icon={faPlusCircle} className="text-info mr-1" size='2x'/></span> 
                        <div className="ms-3">Add Book</div>
                        </Link>
                    </div>
                    
                </div>
                <div className="row justify-content-center mt-4">
                    {this.renderAvailableBooks()}
                    
                </div>
                <div className="row justify-content-center mt-4 pt-4">
                    <div className="col-lg-4 col-md-10 col-12 ">
                        <div className="h4">Sold/Exchanged Books</div>
                        <div className="dropdown-divider"></div>
                    </div>
                </div>
                <div className="row justify-content-center mt-4">
                    {this.renderSoldBooks()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userId : state.user.id
    }
}

export default connect(mapStateToProps, {
    fetchBooks,
    changeAuthState
})(Inventory);

