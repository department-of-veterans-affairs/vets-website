import React from 'react';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import createCommonStore from './store';
import startSitewideComponents from '../site-wide';
import startReactApp from './react';

export default function startApp({ routes, reducer, url }) {
  const store = createCommonStore(reducer);

  const history = useRouterHistory(createHistory)({
    basename: url
  });

  startSitewideComponents(store);

  startReactApp(
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>
  );
}
