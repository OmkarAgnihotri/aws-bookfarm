
import React from 'react';
import { connect } from 'react-redux';

class MessageDetail extends React.Component{
    
    render(){
        const {text, firstName, photoUrl, userId, uid} = this.props;
        
        return (

            <div class={
                `item py-4 px-3 d-flex ${userId === uid?`alert-info`:''}`
            }>
                <img class="ui avatar image inline"  src={photoUrl}/>
                <div class="content w-100">
                    <div class="header p-1">{text}</div>
                    <small class="text-muted small p-1 ">{firstName}</small>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uid : state.user.id
    }
}

export default connect(mapStateToProps, {})(MessageDetail);
