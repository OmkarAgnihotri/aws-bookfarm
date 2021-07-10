import React from 'react';
import { connect } from 'react-redux';

import MessageDetail from './MessageDetail';

class MessageList extends React.Component{
 
    componentDidMount = () => {
        
    }

    componentDidUpdate = () => {
        this.scrollToBottom();
    }

    renderMessages = () => {

        return this.props.messages.map((message) => {
            return <MessageDetail {...message} />
        });
    }


    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }


    render(){
        return (
            <div className="container-fluid p-0" style={{overflowY:'scroll',overflowX:'hidden', position:'absolute', height:'90%'}}>
                <div className="ui list divided ">
                    {this.renderMessages()}
                    <div className="dummy-div" style={{height:'50px'}}
                    ref={(el) => { this.messagesEnd = el; }} ></div>
                </div>
            </div>
        );
    }
}

// const mapStateToProps = (state) => {
//     if(!state.user)return {};

//     return {
//         userID : state.user.uid,
//         messages : state.messages
//     };
// }

export default MessageList;
