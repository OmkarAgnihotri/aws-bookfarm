import React from 'react';
import Navigation from './Navigation/Navigation';


import { Redirect, Route } from 'react-router-dom'

import BookList from '../Books/BookList';
import BookDetail from '../Books/BookDetail';
import CreateBook from '../Books/CreateBook';
import EditBook from '../Books/EditBook';

import {connect} from 'react-redux';
import Inventory from '../Books/Inventory';
import ChatContainer from '../chats/ChatContainer';

const AppContainer = (props) => {
    return (
        <>
            <Navigation />
            <Route 
                path='/books' exact 
                render={()=>{
                    return props.user?<BookList />:<Redirect to='/signin' />
                }}
            />
            
            <Route 
                path='/books/new' exact 
                render={(params)=>{
                    return props.user?<CreateBook />:<Redirect to='/signin' />
                }}
            />
            <Route 
                path='/books/detail/:bookId' exact 
                render={(params)=>{
                    return props.user?<BookDetail {...params}/>:<Redirect to='/signin' />
                }}
            />

            <Route 
                path='/books/edit/:bookId' exact 
                render={(params)=>{
                    return props.user?<EditBook {...params}/>:<Redirect to='/signin' />
                }}
            />
            <Route 
                path='/inventory' exact 
                render={(params)=>{
                    return props.user?<Inventory {...params}/>:<Redirect to='/signin' />
                }}
            />
            <Route 
                path='/chats' exact 
                render={(params)=>{
                    return props.user?<ChatContainer {...params}/>:<Redirect to='/signin' />
                }}
            />
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        user : state.user
    };
}
export default connect(mapStateToProps, {})(AppContainer);