import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, Route, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes.jsx';
import reducer from './reducers';
import createCommonStore from '../common/store';
import createLoginWidget from '../login/login-entry';

import Post911GIBStatusApp from './containers/Post911GIBStatusApp';

require('../common');
require('../../sass/post-911-gib-status.scss');

const store = createCommonStore(reducer);

createLoginWidget(store);

const history = useRouterHistory(createHistory)({
  basename: '/education/gi-bill/post-9-11/ch-33-benefit'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Post911GIBStatusApp}>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

initReact(init);
