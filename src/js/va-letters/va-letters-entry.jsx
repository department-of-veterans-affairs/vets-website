import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import VALettersApp from './containers/VALettersApp.jsx';
import initReact from '../common/init-react';
import { commonStore } from '../common/store';
import routes from './routes.jsx';

require('../common');
require('../../sass/va-letters.scss');
require('../login/login-entry.jsx');

const history = useRouterHistory(createHistory)({
  basename: '/va-letters'
});

function init() {
  ReactDOM.render((
    <Provider store={commonStore}>
      <Router history={history}>
        <Route path="/" component={VALettersApp}>
          <IndexRedirect to="/confirm-address"/>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
