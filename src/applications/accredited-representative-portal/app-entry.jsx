import '@department-of-veterans-affairs/platform-polyfills';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import router from './routes';
import { AppProvider } from './context/AppContext';
import manifest from './manifest.json';
import store from './store';

window.appName = manifest.entryName;

startReactApp(
  <Provider store={store}>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </Provider>,
);
