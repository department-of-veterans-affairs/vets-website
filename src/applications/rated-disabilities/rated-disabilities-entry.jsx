import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom-v5-compat';
import '@department-of-veterans-affairs/platform-polyfills';

import startApp from '@department-of-veterans-affairs/platform-startup/routerNext';

import './sass/rated-disabilities.scss';

import manifest from './manifest.json';
import routes from './routes';

const { entryName, rootUrl: url } = manifest;

const router = createBrowserRouter([{ path: '*', element: routes }], {
  basename: url,
});

startApp({
  entryName,
  reducer: null,
  router: <RouterProvider router={router} />,
  url,
});
