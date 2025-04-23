/**
 * Module for functions related to starting up and application
 * @module platform/startup
 */
import React from 'react';
import { Provider } from 'react-redux';
import startReactApp from './react';
import setUpCommonFunctionality from './setup';

/**
 * Starts an application in the default element for standalone React
 * applications. It also sets up the common store, starts the site-wide
 * components (like the header menus and login widget), and wraps the provided
 * routes in the React Router v6 RouterProvider
 *
 * @param {string} entryName The entryName of the application
 * @param {BrowserRouter} router The V6 BrowserRouter component to use
 * @param {object} appInfo.reducer An object containing reducer functions. Will have
 * combineReducers run on it after being merged with the common, cross-site reducer.
 * @param {string} appInfo.url The base url for the React application
 * @param {array} appInfo.analyticsEvents An array which contains analytics events to collect
 * when the respective actions are fired.
 * @param {boolean} preloadScheduledDowntimes Whether to fetch scheduled downtimes - when set
 * to true, the maintenance_windows API request is made without having to wait for the
 * DowntimeNotification component to mount. This can improve startup time for applications
 * that use the DowntimeNotification component.
 * @param {array} appInfo.additionalMiddlewares Array of additional Redux middlewares to include.
 */
export default function startApp({
  router,
  reducer,
  url,
  analyticsEvents,
  entryName = 'unknown',
  preloadScheduledDowntimes = false,
  additionalMiddlewares = [],
}) {
  const store = setUpCommonFunctionality({
    entryName,
    url,
    reducer,
    analyticsEvents,
    preloadScheduledDowntimes,
    additionalMiddlewares,
  });

  startReactApp(<Provider store={store}>{router}</Provider>);
}
