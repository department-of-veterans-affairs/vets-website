import 'platform/polyfills';
import './sass/compose.scss';
import './sass/message-details.scss';
import './sass/message-list.scss';
import './sass/search.scss';
import './sass/secure-messaging.scss';
import './sass/message-thread.scss';
import './sass/dashboard.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom-v5-compat';

import startReactApp from 'platform/startup/react';

import router from './routes';
import { store } from './store';

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

startReactApp(<App />);

export { store };
