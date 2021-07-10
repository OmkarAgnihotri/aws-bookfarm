import React from 'react';
import {connect} from 'react-redux';
import qs from 'qs'


import {Link, Route, Redirect} from 'react-router-dom';
import defaultProfilePic from '../../assets/images/user.png';

import ActiveChat from './ActiveChat';

class ChatContainer extends React.Component{

    state = {
        activeChat : null,
    }

    componentDidMount = () => {
        const queryParams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        
        if(queryParams.active){
            const index = this.props.chat.findIndex(chat => chat.id === queryParams.active);
            if(index != -1){
                this.setState({activeChat : queryParams.active})
            }
        }
    }

    renderUserList = () => {
        
        return this.props.chats.map(chat => {
            return (
                <a onClick={(e)=>{
                    e.preventDefault();
                    this.setState({
                        activeChat : chat.id
                    });
                }}>
                    <div class="item py-4 px-2 d-flex">
                        
                        <img class="ui avatar image inline"  src={defaultProfilePic}/>
                        <div class="content w-100">
                            <div class="header p-1 inline">{
                                chat.user1.id !== this.props.userID?
                                `${chat.user1.firstName} ${chat.user1.lastName}`:`${chat.user2.firstName} ${chat.user2.lastName}`
                            }</div>
                            <small class="text-muted small p-1 "></small>
                        </div>
                    </div>
                </a>
            )
        })
    }
    
    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="container-fluid" >
                            <div className="ui list divided">
                                {this.renderUserList()}
                            </div>
                        </div>
                    </div>
                    {
                        this.state.activeChat?<div className="col-lg-8 col-md-7">
                            <ActiveChat messages={this.props.messages[this.state.activeChat] || []} chatId={this.state.activeChat}/>
                        </div>:null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userID : state.user.id,
        chats : state.chats,
        messages : state.messages
    }
}
export default connect(mapStateToProps, {})(ChatContainer);