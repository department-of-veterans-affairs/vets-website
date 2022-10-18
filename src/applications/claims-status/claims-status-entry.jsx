import 'platform/polyfills';

import './sass/claims-status.scss';

import React from 'react';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import startReactApp from 'platform/startup/react';
import createCommonStore from 'platform/startup/store';
import startSitewideComponents from 'platform/site-wide';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import { setLastPage } from './actions';
import ClaimsStatusApp from './containers/ClaimsStatusApp';
import manifest from './manifest.json';
import routes from './routes';
import reducer from './reducers';

window.appName = manifest.entryName;

const store = createCommonStore(reducer);
connectFeatureToggle(store.dispatch);

/* eslint-disable react-hooks/rules-of-hooks */
const history = useRouterHistory(createHistory)({
  basename: manifest.rootUrl,
});

history.listen(location => {
  store.dispatch(setLastPage(location.pathname));
});

startSitewideComponents(store);

startReactApp(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={ClaimsStatusApp}>
        <IndexRedirect to="/your-claims" />
        {routes}
      </Route>
    </Router>
  </Provider>,
);
