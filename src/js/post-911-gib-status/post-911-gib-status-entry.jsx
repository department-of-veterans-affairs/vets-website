import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes.jsx';
import createCommonStore from '../common/store';
import createLoginWidget from '../login/login-entry';

require('../common');
require('../../sass/post-911-gib-status.scss');

const store = createCommonStore({});
createLoginWidget(store);

const history = useRouterHistory(createHistory)({
  basename: '/education/gi-bill/post-9-11/status'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

initReact(init);

