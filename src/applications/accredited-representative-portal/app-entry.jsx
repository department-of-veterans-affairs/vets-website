import '@department-of-veterans-affairs/platform-polyfills';

import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import './sass/accredited-representative-portal.scss';
import './sass/POARequestCard.scss';
import './sass/POARequestDetails.scss';
import './sass/Header.scss';

import manifest from './manifest.json';
import routes from './routes';
import createReduxStore from './utilities/store';

window.appName = manifest.entryName;

const router = createBrowserRouter(routes, {
  basename: '/representative',
});

startReactApp(
  <Provider store={createReduxStore()}>
    <RouterProvider router={router} />
  </Provider>,
);
