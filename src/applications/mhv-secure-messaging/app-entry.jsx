import 'platform/polyfills';
import './sass/compose.scss';
import './sass/message-details.scss';
import './sass/message-list.scss';
import './sass/search.scss';
import './sass/secure-messaging.scss';
import './sass/message-thread.scss';
import './sass/dashboard.scss';

import React from 'react';
import { RouterProvider } from 'react-router-dom-v5-compat';
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
