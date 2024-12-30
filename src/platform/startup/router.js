/**
 * Module for functions related to starting up and application
 * @module platform/startup
 */
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';
import startReactApp from './react';
import setUpCommonFunctionality from './setup';

/**
 * Starts an application in the default element for standalone React
 * applications. It also sets up the common store, starts the site-wide
 * components (like the header menus and login widget), and wraps the provided
 * routes in the Redux and React Router v5 boilerplate common to most applications.
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
 * @param {boolean} preloadScheduledDowntimes Whether to fetch scheduled downtimes - when set
 * to true, the maintenance_windows API request is made without having to wait for the
 * DowntimeNotification component to mount. This can improve startup time for applications
 * that use the DowntimeNotification component.
 */
export default function startApp({
  routes,
  createRoutesWithStore,
  component,
  reducer,
  url,
  analyticsEvents,
  entryName = 'unknown',
  preloadScheduledDowntimes = false,
}) {
  const store = setUpCommonFunctionality({
    entryName,
    url,
    reducer,
    analyticsEvents,
    preloadScheduledDowntimes,
  });

  let content = component;
  if (createRoutesWithStore) {
    content = (
      <BrowserRouter basename={url}>
        <CompatRouter>{createRoutesWithStore(store)}</CompatRouter>
      </BrowserRouter>
    );
  } else if (routes) {
    content = (
      <BrowserRouter basename={url}>
        <CompatRouter>{routes}</CompatRouter>
      </BrowserRouter>
    );
  }

  startReactApp(<Provider store={store}>{content}</Provider>);
}
