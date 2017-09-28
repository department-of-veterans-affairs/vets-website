import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import LettersApp from './containers/LettersApp.jsx';
import initReact from '../common/init-react';
import routes from './routes.jsx';
import reducer from './reducers';
import createCommonStore from '../common/store';
import createLoginWidget from '../login/login-entry';

require('../common');
require('../../sass/letters.scss');

const store = createCommonStore(reducer);
createLoginWidget(store);
const history = useRouterHistory(createHistory)({
  basename: '/letters'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={LettersApp}>
          {routes}
        </Route>
      </Router>
    </Provider>
  ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
