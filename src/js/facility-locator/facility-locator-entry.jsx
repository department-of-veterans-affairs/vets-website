import React from 'react';
import ReactDOM from 'react-dom';

import initReact from '../common/init-react';
import { Provider } from 'react-redux';

import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import routes from './routes';
import { store } from './store';

require('../../sass/facility-locator.scss');

require('../login/login-entry.jsx');

const history = useRouterHistory(createHistory)({
  basename: '/facilities/'
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
