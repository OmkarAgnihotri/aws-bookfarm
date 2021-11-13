import React, {Component} from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {connect} from 'react-redux';
import { NotificationContainer } from 'react-notifications';
import jwt from 'jwt-decode';

import AppContainer from '../AppContainer/AppContainer';
import SignIn from '../Authentication/SignIn';
import { firestoreDB } from '../../config/firebase';
import { changeAuthState, addChat, addMessage } from '../../actions';
import createNotification  from '../util/Notification'; 
import VerifyEmail from '../VerifyEmai';
import LoadingSpinner from '../util/LoadingSpinner';
import SignUp from '../Authentication/SignUp';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import APIConfig from '../../apis/server';

library.add(fab);

class App extends Component {

    state = {
        isLoading : true
    }

    
    componentDidMount = () => {
        const token = localStorage.getItem('token');
        
        if(token){
            try {
                const user = jwt(token);

                firestoreDB.collection('chats').where('user2.id','==',user.id)
                .onSnapshot(querySnapshot => {
                    querySnapshot.docChanges().forEach(change => {
                        const chatID = change.doc.id;
                        
                        if(change.type === 'added'){
                            this.props.addChat({id:chatID, ...change.doc.data()});

                            firestoreDB.collection(`chats/${chatID}/messages`).orderBy('timestamp', 'asc').limit(15)
                            .onSnapshot(snapshot => {
                                snapshot.docChanges().forEach(addedMessage => {
                                    const message = {
                                        chatID,
                                        id : addedMessage.doc.id,
                                        ...addedMessage.doc.data()
                                    }

                                    this.props.addMessage(message);
                                })
                            });
                        }
                       
                    })
                });

                firestoreDB.collection('chats').where('user1.id','==',user.id)
                .onSnapshot(querySnapshot => {
                    querySnapshot.docChanges().forEach(change => {
                        const chatID = change.doc.id;
                        
                        if(change.type === 'added'){
                            this.props.addChat({id:chatID, ...change.doc.data()});

                            firestoreDB.collection(`chats/${chatID}/messages`).orderBy('timestamp', 'asc').limit(15)
                            .onSnapshot(snapshot => {
                                snapshot.docChanges().forEach(addedMessage => {
                                    const message = {
                                        chatID,
                                        id : addedMessage.doc.id,
                                        ...addedMessage.doc.data()
                                    }

                                    this.props.addMessage(message);
                                })
                            });
                        }
                    })
                });


                this.props.changeAuthState(user);
                this.setState({isLoading:false});

            } catch (error) {
                console.log(error);
                this.setState({isLoading : false});
            }
        }
        else{
            this.setState({isLoading : false});
        }
    }

    renderApp = () => {
        
        if(this.state.isLoading){
            return (
                <div className="container d-flex justify-content-center" style={{paddingTop:'15%'}}>
                    <LoadingSpinner  />
                </div>
            )
        }
        if(this.props.user){
            
            return <AppContainer />
        }
        
        return <Redirect to='/signin' />
    }

    render = ()=>{
        return (
            <div>
                <BrowserRouter>
                    <NotificationContainer />
                    {this.renderApp()}
                    <Route exact path="/verify-email" component={VerifyEmail} />
                    <Route path='/signin' render={()=>{
                        return this.props.user?<Redirect to='/books' />:<SignIn />
                    }}/>
                    <Route path='/signup' exact render={()=>{
                        return this.props.user?<Redirect to='/books' />:<SignUp />
                    }}/>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user
    };
}
export default connect(mapStateToProps,{
    changeAuthState,
    addChat,
    addMessage
})(App);