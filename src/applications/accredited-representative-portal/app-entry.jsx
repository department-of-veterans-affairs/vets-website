import '@department-of-veterans-affairs/platform-polyfills';
// import startApp from '@department-of-veterans-affairs/platform-startup/router';
import React from 'react';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import { BrowserRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import './sass/accredited-representative-portal.scss';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import createReduxStore from './store';

// window.appName = manifest.entryName;

// startReactApp(
//   <Provider store={createReduxStore(reducer)}>
//     <BrowserRouter basename={manifest.rootUrl}>{routes}</BrowserRouter>
//   </Provider>,
// );

// Create the Redux store
const store = createReduxStore(reducer);

// Connect feature toggles to the Redux store dispatch
connectFeatureToggle(store.dispatch);

window.appName = manifest.entryName;

// Start the React application with Redux Provider and Router
startReactApp(
  <Provider store={store}>
    <BrowserRouter basename={manifest.rootUrl}>{routes}</BrowserRouter>
  </Provider>,
);
