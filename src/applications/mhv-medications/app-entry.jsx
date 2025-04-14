// TODO: unable to implement suggested fix without crashing app, once this issue is resolved, change the import
import 'platform/polyfills';
import './sass/medications.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom-v5-compat';

import startApp from '@department-of-veterans-affairs/platform-startup/withoutRouter';
import createCommonStore from 'platform/startup/store';
import router from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

const store = createCommonStore(reducer);

startApp({
  router: (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  ),
  reducer,
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  preloadScheduledDowntimes: true,
});
