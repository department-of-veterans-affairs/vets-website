import React from 'react';
import { Provider } from 'react-redux';
import { Router, useRouterHistory, browserHistory } from 'react-router';
import { createHistory } from 'history';
import { updateRoute } from 'platform/site-wide/user-nav/actions';
import startReactApp from 'platform/startup/react';
import runAxeCheck from 'platform/startup/axe-check';
import setupRtkFunctionality from './setup';

export const asyncStartApp = async props => {
  const {
    analyticsEvents,
    component,
    createRoutesWithStore,
    entryName = 'unknown',
    reducer,
    routes,
    url,
  } = props;

  const store = await setupRtkFunctionality({
    analyticsEvents,
    entryName,
    reducer,
    url,
  });
  let history = browserHistory;
  let content = component;

  if (process.env.NODE_ENV !== 'production') {
    runAxeCheck();
  }

  if (url) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    history = useRouterHistory(createHistory)({ basename: url });

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

  if (createRoutesWithStore) {
    const asyncRoutes = await createRoutesWithStore(store);
    content = <Router history={history}>{asyncRoutes}</Router>;
  } else if (routes) {
    content = <Router history={history}>{routes}</Router>;
  }

  startReactApp(<Provider store={store}>{content}</Provider>);
  return store;
};
