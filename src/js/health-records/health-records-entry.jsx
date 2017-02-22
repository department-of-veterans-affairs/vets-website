// polyfilled elements, ie. Map, Set should theoretically
// be included with babel-polyfill but only this import allowed
// them to be recognized in phantomjs/e2e tests
import 'core-js';
require('../common');  // common javascript.
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';

import initReact from '../common/init-react';
import routes from './routes';
import { commonStore } from '../common/store';

require('../../sass/health-records/health-records.scss');

require('../login/login-entry.jsx');

const history = useRouterHistory(createHistory)({
  basename: '/healthcare/health-records'
});

function init() {
  ReactDOM.render((
    <Provider store={commonStore}>
      <Router history={history} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

initReact(init);
