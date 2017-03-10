import 'core-js';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { store } from './store';
import initReact from '../common/init-react';
import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

require('../../sass/facility-locator.scss');

require('../login/login-entry.jsx');

const history = useRouterHistory(createHistory)({
  basename: '/facilities'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
