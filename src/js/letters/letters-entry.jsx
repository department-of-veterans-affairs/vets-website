import 'core-js';
import '../common';
import '../../sass/letters.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import LettersApp from './containers/LettersApp.jsx';
import initReact from '../common/init-react';
import routes from './routes.jsx';
import reducer from './reducers';
import initCommon from '../common/init-common';

const store = initCommon(reducer);
const history = useRouterHistory(createHistory)({
  basename: '/download-va-letters/letters'
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
