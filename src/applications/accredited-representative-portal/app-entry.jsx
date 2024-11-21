import '@department-of-veterans-affairs/platform-polyfills';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import router from './routes';

import manifest from './manifest.json';
import store from './store';
import './sass/accredited-representative-portal.scss';
import './sass/POARequestsTable.scss';

window.appName = manifest.entryName;

startReactApp(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
