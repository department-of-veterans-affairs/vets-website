import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom-v5-compat';
import { createStore } from 'redux';

import '@department-of-veterans-affairs/platform-polyfills';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';

// Platform code uses this value to set headers during HTTP requests.
window.appName = manifest.entryName;

startReactApp(
  <Provider store={createStore(reducer)}>
    <BrowserRouter basename={manifest.rootUrl}>{routes}</BrowserRouter>
  </Provider>,
);
