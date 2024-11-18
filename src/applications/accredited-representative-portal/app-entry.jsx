import '@department-of-veterans-affairs/platform-polyfills';

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom-v5-compat';

import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import './sass/accredited-representative-portal.scss';
import './sass/POARequestsTable.scss';

import manifest from './manifest.json';
import routes from './routes';
import createReduxStore from './store';
import rootReducer from './reducers';

window.appName = manifest.entryName;
const store = createReduxStore(rootReducer);
connectFeatureToggle(store.dispatch);

startReactApp(
  <Provider store={store}>
    <BrowserRouter basename={manifest.rootUrl}>{routes}</BrowserRouter>
  </Provider>,
);
