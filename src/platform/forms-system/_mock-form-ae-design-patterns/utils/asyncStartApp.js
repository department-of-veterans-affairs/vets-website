import React from 'react';
import { Provider } from 'react-redux';
import { Router, useRouterHistory, browserHistory } from 'react-router';
import { createHistory } from 'history';
import { updateRoute } from 'platform/site-wide/user-nav/actions';
import startReactApp from 'platform/startup/react';
import asyncSetUpCommonFunctionality from './asyncSetUpCommonFunctionality';

// this allows an async function to be passed in to create the routes
// and store, and then start the app
export async function asyncStartApp({
  routes,
  createAsyncRoutesWithStore,
  component,
  reducer,
  url,
  analyticsEvents,
  entryName = 'unknown',
}) {
  const store = await asyncSetUpCommonFunctionality({
    entryName,
    url,
    reducer,
    analyticsEvents,
  });

  if (process.env.NODE_ENV !== 'production') {
    const runAxeCheck = await import('platform/startup/axe-check');
    runAxeCheck.default();
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
      // console.error('Error dispatching route change');
    }
  }

  let content = component;
  if (createAsyncRoutesWithStore) {
    const asyncRoutes = await createAsyncRoutesWithStore(store);
    content = <Router history={history}>{asyncRoutes}</Router>;
  } else if (routes) {
    content = <Router history={history}>{routes}</Router>;
  }

  startReactApp(<Provider store={store}>{content}</Provider>);

  return store;
}
