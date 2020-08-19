/**
 * Module for functions related to starting up and application
 * @module platform/startup
 */
import React from 'react';
import * as Sentry from '@sentry/browser';
import { Provider } from 'react-redux';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import createCommonStore from 'platform/startup/store';
import startSitewideComponents from 'platform/site-wide';
import startReactApp from 'platform/startup/react';

/**
 * Starts an application in the default element for standalone React
 * applications. It also sets up the common store, starts the site-wide
 * components (like the header menus and login widget), and wraps the provided
 * routes in the Redux and React Router boilerplate common to most applications.
 *
 * @param {object} appInfo The UI and business logic of your React application
 * @param {Route|array<Route>} appInfo.routes The routes for the application
 * @param {ReactElement} appInfo.component A React element to render. Only used if routes
 * is not passed
 * @param {object} appInfo.reducer An object containing reducer functions. Will have
 * combineReducers run on it after being merged with the common, cross-site reducer.
 * @param {string} appInfo.url The base url for the React application
 * @param {array} appInfo.analyticsEvents An array which contains analytics events to collect
 * when the respective actions are fired.
 */
export default function startApp({
  component,
  componentWithStore,
  reducer,
  url,
  analyticsEvents,
  entryName = 'unknown',
}) {
  // Set further errors to have the appropriate source tag
  Sentry.setTag('source', entryName);

  // Set the app name for use in the apiRequest helper
  window.appName = entryName;

  const store = createCommonStore(reducer, analyticsEvents);
  connectFeatureToggle(store.dispatch);

  if (url?.endsWith('/')) {
    throw new Error(
      'Root urls should not end with a slash. Check your manifest.json file and application entry file.',
    );
  }

  Sentry.withScope(scope => {
    scope.setTag('source', 'site-wide');
    startSitewideComponents(store);
  });

  startReactApp(
    <Provider store={store}>
      {componentWithStore ? componentWithStore(store) : component}
    </Provider>,
  );
}
