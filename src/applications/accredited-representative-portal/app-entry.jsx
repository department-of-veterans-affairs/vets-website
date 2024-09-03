import '@department-of-veterans-affairs/platform-polyfills';
import React from 'react';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import { Provider } from 'react-redux';
import { Router } from 'react-router-dom-v5-compat';
import { createHistory } from 'history';

import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import routes from './accreditation/21a/routes';
import manifest from './manifest.json';
import createReduxStore from './store';

import './sass/accredited-representative-portal.scss';

const store = createReduxStore();

connectFeatureToggle(store.dispatch);

window.appName = manifest.entryName;

const history = createHistory();

startReactApp(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
);
