import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import VALettersApp from './containers/VALettersApp.jsx';
import initReact from '../common/init-react';
import routes from './routes.jsx';
import reducer from './reducers';
import createCommonStore from '../common/store';
import createLoginWidget from '../login/login-entry';

require('../common');  // Bring in the common javascript.
require('../../sass/va-letters.scss');

const store = createCommonStore(reducer);
createLoginWidget(store);

const history = useRouterHistory(createHistory)({
  basename: '/va-letters'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
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
