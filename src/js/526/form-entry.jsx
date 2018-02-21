import 'core-js';
import '../../sass/edu-benefits.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes';
import reducer from './reducer';
import initCommon from '../common/init-common';

const store = initCommon(reducer);

// TODO: Get the real url
const browserHistory = useRouterHistory(createHistory)({
  basename: '/disability-benefits/apply-for-increase/526'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>
  ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
