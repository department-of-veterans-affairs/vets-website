import 'core-js';
import '../../../sass/edu-benefits.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../../common/init-react';
import routes from './routes';
import reducer from './reducer';
import createLoginWidget from '../../login/login-entry';
import createCommonStore from '../../common/store';

const store = createCommonStore(reducer);

createLoginWidget(store);

const browserHistory = useRouterHistory(createHistory)({
  basename: '/education/apply-for-education-benefits/application/1995'
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
