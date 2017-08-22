require('../common');  // common javascript.
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';

import initReact from '../common/init-react';
import routes from './routes';
import { store } from './store';
import { updateRoute } from './actions';
import createLoginWidget from '../login/login-entry';

require('../../sass/gi/gi.scss');
createLoginWidget(store);

const history = useRouterHistory(createHistory)({
  basename: '/gi-bill-comparison-tool'
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
