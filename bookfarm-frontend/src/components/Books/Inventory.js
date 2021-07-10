import React from 'react';
import {connect} from 'react-redux';
import {fetchBooks} from '../../actions';
import {Link} from 'react-router-dom';
import APIConfig from '../../apis/server';

class Inventory extends React.Component{
    state = {
        books : []
    }

    componentDidMount = () => {
        APIConfig.get(`/users/${this.props.userId}/books/`)
        .then(response => this.setState({books : response.data}))
        .catch(err => console.error(err));
    }

    renderBooks = () => {
        
        return this.state.books.map((book, index) => {
            return (
                <div className="col-lg-3 col-md-4 col-sm-5 col-12 p-2 d-flex justify-content-center" key={index} >
                    <Link to={`/books/detail/${book.id}`}>
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
    }

    render(){
        return (
            <div className= "container">
                <div className="row justify-content-center my-4 py-2">
                    <div className="col d-flex justify-content-center">
                        <Link to='/books/new' className="btn btn-primary-outline">
                            Add Book
                        </Link>
                    </div>
                    
                </div>
                <div className="row justify-content-center mt-4">
                    {this.renderBooks()}
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userId : state.user.id,
        books : state.books
    }
}

export default connect(mapStateToProps, {fetchBooks})(Inventory);

