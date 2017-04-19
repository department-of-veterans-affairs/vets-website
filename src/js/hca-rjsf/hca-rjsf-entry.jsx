import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import initReact from '../common/init-react';
import route from './routes';
import reducer from './reducer';

require('../common');
require('../../sass/hca.scss');

require('../login/login-entry.jsx');

let store;
if (__BUILDTYPE__ === 'development' && window.devToolsExtension) {
  store = createStore(reducer, compose(applyMiddleware(thunk), window.devToolsExtension()));
} else {
  store = createStore(reducer, compose(applyMiddleware(thunk)));
}

const browserHistory = useRouterHistory(createHistory)({
  basename: '/healthcare/rjsf'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        {route}
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
