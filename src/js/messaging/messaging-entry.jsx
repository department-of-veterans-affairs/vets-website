// polyfilled elements, ie. Map, Set should theoretically
// be included with babel-polyfill but only this import allowed
// them to be recognized in phantomjs/e2e tests
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';

import initReact from '../common/init-react';
import routes from './routes';
import { commonStore } from '../common/store';
import { updateRoute } from './actions';

require('../../sass/messaging/messaging.scss');
require('../common');  // Bring in the common javascript.

require('../login/login-entry.jsx');

const history = useRouterHistory(createHistory)({
  basename: '/healthcare/messaging'
});

function init() {
  history.listen((location) => commonStore.dispatch(updateRoute(location)));

  ReactDOM.render((
    <Provider store={commonStore}>
      <Router history={history} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

initReact(init);
