import '@department-of-veterans-affairs/platform-polyfills';
import React from 'react';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import routes from './accreditation/21a/routes';
import reducer from './reducers';
import manifest from './manifest.json';
import createReduxStore from './store';

import './sass/accredited-representative-portal.scss';

const store = createReduxStore(reducer);

connectFeatureToggle(store.dispatch);

window.appName = manifest.entryName;

// eslint-disable-next-line react-hooks/rules-of-hooks
const history = useRouterHistory(createHistory)({
  basename: manifest.rootUrl,
});

startReactApp(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
);
