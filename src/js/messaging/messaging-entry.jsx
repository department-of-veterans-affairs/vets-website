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
import reducer from './reducers';
import createCommonStore from '../common/store';
import createLoginWidget from '../login/login-entry';
import { updateRoute } from './actions';

require('../../sass/messaging/messaging.scss');
require('../common');  // Bring in the common javascript.

const store = createCommonStore(reducer);
createLoginWidget(store);

const history = useRouterHistory(createHistory)({
  basename: '/health-care/messaging'
});

function init() {
  history.listen((location) => store.dispatch(updateRoute(location)));

  ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

initReact(init);
