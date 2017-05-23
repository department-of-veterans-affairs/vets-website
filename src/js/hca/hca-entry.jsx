import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import createCommonStore from '../common/store';

import HealthCareApp from './components/HealthCareApp.jsx';
import initReact from '../common/init-react';
import reducer from './reducers';
import routes from './routes.jsx';
import createLoginWidget from '../login/login-entry';

require('../common');  // Bring in the common javascript.
require('../../sass/hca.scss');

const store = createCommonStore(reducer);
createLoginWidget(store);

const browserHistory = useRouterHistory(createHistory)({
  basename: '/healthcare/apply/application'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={HealthCareApp}>
          <IndexRedirect to="/introduction"/>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
