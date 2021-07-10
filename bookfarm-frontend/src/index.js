
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import 'semantic-ui-css/semantic.min.css'
import 'react-notifications/lib/notifications.css';

import React from 'react';
import reactDom from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './components/App/App';
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))

reactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
);