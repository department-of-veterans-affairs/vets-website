import 'core-js';
import '../common';
import '../../sass/post-911-gib-status.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, Route, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes.jsx';
import reducer from './reducers';
import initCommon from '../common/init-common';
import manifest from './manifest.json';

const store = initCommon(reducer);

const history = useRouterHistory(createHistory)({
  basename: manifest.rootUrl
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/">
          {routes}
        </Route>
      </Router>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
