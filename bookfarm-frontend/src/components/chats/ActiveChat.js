import React from 'react';
import { MDBInput, MDBCard } from 'mdbreact';
import {connect} from 'react-redux';

import MessageList from './MessageList';
import { firestoreDB } from '../../config/firebase';
import defaultProfilePic from '../../assets/images/profile_placeholder.png';

class ActiveChat extends React.Component{
    state = {
        queryText : ''
    }

    handleQuerySubmit = (event) => {
        event.preventDefault();
        firestoreDB.collection(`chats/${this.props.chatId}/messages`)
        .add({
            userId : this.props.user.id,
            photoUrl : defaultProfilePic,
            firstName : this.props.user.first_name,
            text : this.state.queryText,
            timestamp : Date.now()
        })

        this.setState({queryText : ''})
    }

    render(){
        
        return (
            <div className="container mt-4 ">
                <div className="row d-flex justify-content-center">
                    <div className="col" style={{position:'relative'}}>
                        <MDBCard style={{height:'85vh'}} >
                            <MessageList messages={this.props.messages}/>
                            <div className="container align-bottom" style={{position:'absolute', bottom:'0', height:'80px'}}>
                                <form onSubmit={this.handleQuerySubmit}>
                                    <div className="row flex-nowrap">
                                        <div className="col-9">
                                            <MDBInput
                                                label="Type your query here"
                                                type="text"
                                                value={this.state.queryText}
                                                onChange={(e)=>this.setState({queryText : e.target.value})}
                                            />
                                        </div>
                                        <div className="col d-flex justify-content-center align-items-center">
                                            <button className="btn btn-default btn-md" >Send</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </MDBCard>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user : state.user
    };
}

export default connect(mapStateToProps, {})(ActiveChat);