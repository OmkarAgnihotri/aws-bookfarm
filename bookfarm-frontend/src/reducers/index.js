import { combineReducers } from 'redux';

const AuthStateReducer = (currentState = null, action) => {    
    if(action.type === 'CHANGE_AUTH_STATE'){
        return action.payload;
    }
    return currentState;
}

const booksReducer = (books = [], action) => {
    if(action.type === 'FETCH_BOOKS'){
        return action.payload;
    }
    return books;
}

const chatsReducer = (chats = [], action) => {
    if(action.type === 'ADD_CHAT'){
        return [...chats, action.payload]
    }
    return chats
}

const messagesReducer = (messages = {}, action) => {
    if(action.type === 'ADD_MESSAGE'){  
        const message = action.payload;
        const messagesCollection = {...messages};

        if(messagesCollection.hasOwnProperty(message.chatID)){
            messagesCollection[message.chatID] = [...messagesCollection[message.chatID], message]
        }
        else {
            messagesCollection[message.chatID] = [message]
        }
        return messagesCollection;    
    }
    return messages
}

// const messagesReducer = (messages = [], action) => {
//     if(action.type === 'POST_MESSAGE'){
//         const index = messages.findIndex(message => message.key === action.payload.key)
//         if(index === -1)return [...messages, action.payload];
        
//         return [
//             ...messages.slice(0, index),
//             action.payload, ...messages.slice(index + 1)
//         ]
//     }
//     return messages;
// }


export default combineReducers({
    user:AuthStateReducer,
    books:booksReducer,
    chats : chatsReducer,
    messages : messagesReducer
});