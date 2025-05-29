import 'platform/polyfills';
import './sass/medications.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom-v5-compat';

import startReactApp from 'platform/startup/react';

// Initialize MSW in development
import './msw-browser';

import router from './routes';
import { store } from './store';

// Wrap RouterProvider with Redux Provider to ensure Redux context is available
const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

startReactApp(<App />);

// Export the store to make it accessible elsewhere in the app
export { store };
