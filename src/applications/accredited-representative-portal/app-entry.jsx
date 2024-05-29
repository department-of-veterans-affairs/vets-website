import '@department-of-veterans-affairs/platform-polyfills';
// import startApp from '@department-of-veterans-affairs/platform-startup/router';
import React from 'react';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import { BrowserRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import './sass/accredited-representative-portal.scss';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import createReduxStore from './store';

window.appName = manifest.entryName;

startReactApp(
  <Provider store={createReduxStore(reducer)}>
    <BrowserRouter basename={manifest.rootUrl}>{routes}</BrowserRouter>
  </Provider>,
);
