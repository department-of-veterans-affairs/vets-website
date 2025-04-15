import React from 'react';
import { RouterProvider } from 'react-router-dom-v5-compat';
import '@department-of-veterans-affairs/platform-polyfills';
import './sass/avs.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/withoutRouter';

import router from './router';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  router: <RouterProvider router={router} />,
});
