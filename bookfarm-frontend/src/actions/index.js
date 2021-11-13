import APIConfig from '../apis/server'
import createNotification from '../components/util/Notification';

export const changeAuthState = (user) => {
    
    return {
        type:'CHANGE_AUTH_STATE',
        payload : user
    }
}

export const fetchBooks = () => {
    return async (dispatch) => {
        try{
            const response = await APIConfig.get('/books/',{
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch({ type : 'FETCH_BOOKS',payload : response.data});
        }
        catch(e){
            if(e.response && e.response.status === 403){
                localStorage.removeItem('token');
                dispatch(changeAuthState(null));
                createNotification('Please login again !', 'error');
            }
            else createNotification('Some error occurred! Please try again.', 'error');
            
        }
        
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