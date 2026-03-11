/**
 * Module for functions related to starting up and application
 * @module platform/startup
 */
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history-v4';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { updateRoute } from 'platform/site-wide/user-nav/actions';
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
 * @param {array} appInfo.additionalMiddlewares Array of additional Redux middlewares to include.
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

  // Create a history instance we control, rather than relying on
  // BrowserRouter's internal history. This lets us dispatch updateRoute
  // to Redux synchronously on every navigation — matching the v3 startup
  // behavior in platform/startup/index.js. Without this, Redux route state
  // lags one render frame behind the actual URL.
  const history = createBrowserHistory({
    basename: url || '',
  });

  try {
    store.dispatch(updateRoute(history.location));

    history.listen(location => {
      if (location) {
        store.dispatch(updateRoute(location));
      }
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error dispatching route change', e);
  }

  let content = component;
  if (createRoutesWithStore) {
    content = (
      <Router history={history}>
        <CompatRouter>{createRoutesWithStore(store)}</CompatRouter>
      </Router>
    );
  } else if (routes) {
    content = (
      <Router history={history}>
        <CompatRouter>{routes}</CompatRouter>
      </Router>
    );
  }

  startReactApp(<Provider store={store}>{content}</Provider>);

  return store;
}
