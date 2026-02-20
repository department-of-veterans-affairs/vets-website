import '@department-of-veterans-affairs/platform-polyfills';

import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import './sass/accredited-representative-portal.scss';
import './sass/POARequestCard.scss';
import './sass/POARequestDetails.scss';
import './sass/POARequestSearchDetails.scss';
import './sass/GetHelp.scss';
import './sass/SubmissionsPage.scss';
import './sass/Dashboard.scss';

import routes from './routes';
import store from './utilities/store';

const router = createBrowserRouter(routes, {
  basename: '/representative',
});

startReactApp(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
