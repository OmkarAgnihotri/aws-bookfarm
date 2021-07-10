import React from 'react';
import SignIn from '../Authentication/SignIn';
import SignUp from '../Authentication/SignUp';

import {Route} from 'react-router-dom';

class Auth extends React.Component{
    render() {

        return (
            <>
                <Route path='/signin' exact component={SignIn} />
                <Route path='/signup' exact component={SignUp} />
            </>
        )
        
    }
}

export default Auth;