import '@department-of-veterans-affairs/platform-polyfills';
import React from 'react';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom-v5-compat';

import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import createReduxStore from './store';

import './sass/accredited-representative-portal.scss';

const store = createReduxStore(reducer);

connectFeatureToggle(store.dispatch);

window.appName = manifest.entryName;

startReactApp(
  <Provider store={store}>
    <BrowserRouter basename={manifest.rootUrl}>{routes}</BrowserRouter>
  </Provider>,
);
