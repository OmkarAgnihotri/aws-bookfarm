import APIConfig from '../apis/server'

export const changeAuthState = (user) => {
    
    return {
        type:'CHANGE_AUTH_STATE',
        payload : user
    }
}

export const fetchBooks = () => {
    return async (dispatch) => {
        const response = await APIConfig.get('/books/');
        dispatch({ type : 'FETCH_BOOKS',payload : response.data});
    };
}

export const addChat = (chat) => {
    return {
        type : 'ADD_CHAT',
        payload : chat
    }
}

export const addMessage = (message) => {
    return {
        type : 'ADD_MESSAGE',
        payload : message
    }
}