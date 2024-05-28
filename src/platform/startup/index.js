/**
 * Module for functions related to starting up and application
 * @module platform/startup
 */
import React from 'react';
import { Provider } from 'react-redux';
import { Router, useRouterHistory, browserHistory } from 'react-router';
import { createHistory } from 'history';
import { updateRoute } from 'platform/site-wide/user-nav/actions';
import startReactApp from './react';
import runAxeCheck from './axe-check';
import setUpCommonFunctionality from './setup';

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
  routes,
  createRoutesWithStore,
  component,
  reducer,
  url,
  analyticsEvents,
  entryName = 'unknown',
}) {
  const store = setUpCommonFunctionality({
    entryName,
    url,
    reducer,
    analyticsEvents,
  });

  // If the build is not production, run an axe check in the browser
  if (process.env.NODE_ENV !== 'production') {
    runAxeCheck();
  }

  let history = browserHistory;
  if (url) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    history = useRouterHistory(createHistory)({
      basename: url,
    });

    try {
      store.dispatch(updateRoute(history.getCurrentLocation()));

      history.listen(location => {
        if (location) {
          store.dispatch(updateRoute(location));
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error dispatching route change');
    }
  }

  let content = component;
  if (createRoutesWithStore) {
    content = <Router history={history}>{createRoutesWithStore(store)}</Router>;
  } else if (routes) {
    content = <Router history={history}>{routes}</Router>;
  }

  startReactApp(<Provider store={store}>{content}</Provider>);

  return store;
}
