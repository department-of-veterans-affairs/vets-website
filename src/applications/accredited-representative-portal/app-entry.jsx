import '@department-of-veterans-affairs/platform-polyfills';

import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import './sass/accredited-representative-portal.scss';
import './sass/POARequestsCard.scss';
import './sass/POARequestDetails.scss';

import manifest from './manifest.json';
import router from './routes';
import createReduxStore from './store';
import rootReducer from './reducers';

window.appName = manifest.entryName;
const store = createReduxStore(rootReducer);
connectFeatureToggle(store.dispatch);

startReactApp(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
