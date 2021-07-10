import React from 'react';
import {connect} from 'react-redux';
import {fetchBooks} from '../../actions';
import {Link, Redirect} from 'react-router-dom';
import { firestoreDB } from '../../config/firebase';

class BookList extends React.Component{
    state = {
        redirect : false,
        selectedChat : null
    }

    componentDidMount = () => {
        this.props.fetchBooks()
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

    renderBooks = () => {
        console.log(this.props.books)
        return this.props.books.map((book, index) => {
            if(book.owner.id === this.props.user.id)return null
            return (
                <div className="col-lg-3 col-md-4 col-sm-5 col-12 p-2 d-flex justify-content-center" key={index} >
                        <div class="card" style={{width:'200px'}}>
                            <Link to={`/books/detail/${book.id}`}>
                                <img
                                    src={book.imageUrl}
                                    className="card-img-top"
                                    alt="..."
                                    style={{height:'220px'}}
                                    />
                            </Link>
                            <div class="card-body">
                                <h5 class="card-title pb-4">{book.title}</h5>
                                <div className="container">
                                    <div className="row">
                                        <div className="col text-center">
                                            <button className="btn btn-outline-primary btn-sm" onClick={() => this.onContactUser(book.owner)}>contact user</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            )
        })
    }

    render(){
        if(this.state.redirect){
            return <Redirect to={`/chats?active=${this.state.selectedChat}`} />
        }

        return (
            <div className= "container">
                <div className="row justify-content-center mt-4">
                    {this.renderBooks()}
                    
                </div>
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

export default connect(mapStateToProps, {fetchBooks})(BookList);