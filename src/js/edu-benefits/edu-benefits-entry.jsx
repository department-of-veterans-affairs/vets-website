import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import createRoutes from './routes';
import createLoginWidget from '../login/login-entry';
import createCommonStore from '../common/store';

require('../../sass/edu-benefits.scss');

const emptyState = {};
const reducer = () => emptyState;

const store = createCommonStore(reducer);
createLoginWidget(store);

const browserHistory = useRouterHistory(createHistory)({
  basename: '/education/apply-for-education-benefits/application'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        {createRoutes(store)}
      </Router>
    </Provider>
  ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
