import 'core-js';
import '../../sass/facility-locator.scss';

import { createHistory } from 'history';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import initReact from '../common/init-react';
import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import { store } from './store';
import createLoginWidget from '../login/login-entry';

createLoginWidget(store);

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
