import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';

import initReact from '../common/init-react';
import routes from './routes';
import { store } from './store';

require('../common');  // Bring in the common javascript.
require('../../sass/messaging/messaging.scss');

require('../login/login-entry.jsx');

const history = useRouterHistory(createHistory)({
  basename: '/healthcare/messaging'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

initReact(init);
