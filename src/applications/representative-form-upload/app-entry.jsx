import '@department-of-veterans-affairs/platform-polyfills';

import React from 'react';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import manifest from './manifest.json';
import routes from './routes';
import createReduxStore from './store';
import rootReducer from './reducers';

window.appName = manifest.entryName;
const store = createReduxStore(rootReducer);
connectFeatureToggle(store.dispatch);

// eslint-disable-next-line react-hooks/rules-of-hooks
const history = useRouterHistory(createHistory)({
  basename: manifest.rootUrl,
});

startReactApp(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
);
