import React from 'react';
import { Provider } from 'react-redux';
import { Router, useRouterHistory, browserHistory } from 'react-router';
import { createHistory } from 'history';
import { updateRoute } from 'platform/site-wide/user-nav/actions';
import startReactApp from 'platform/startup/react';
import runAxeCheck from 'platform/startup/axe-check';
import setUpCommonFunctionality from 'platform/startup/setup';

export async function asyncStartApp({
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
      // console.error('Error dispatching route change');
    }
  }

  let content = component;
  if (createRoutesWithStore) {
    const asyncRoutes = await createRoutesWithStore(store);
    content = <Router history={history}>{asyncRoutes}</Router>;
  } else if (routes) {
    content = <Router history={history}>{routes}</Router>;
  }

  startReactApp(<Provider store={store}>{content}</Provider>);

  return store;
}
