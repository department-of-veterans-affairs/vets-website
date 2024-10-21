import { combineReducers } from 'redux';

import createAnalyticsMiddleware from 'platform/startup/analytics-middleware';
import environment from 'platform/utilities/environment';
import { commonReducer } from 'platform/startup/store';
import { configureStore } from '@reduxjs/toolkit';

/**
 * Creates a Redux store and merges the provided reducer with commonReducer.
 * Sets up the Redux devtools in development and adds redux middleware.
 *
 * @param {Object} [appReducer={}] An object with reducer functions as properties
 * @param {Array} analyticsEvents A list of analytics events to capture when redux actions are fired
 * @returns {Store} The Redux store with a combined reducer from the commonReducer and
 * appReducer.
 */
export default function createRtkCommonStore(
  appReducer = {},
  analyticsEvents = [],
) {
  const reducer = {
    ...appReducer,
    ...commonReducer,
  };

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware => {
      // there is an issue with one of the applications (ask VA app) using a Set within their state
      // which causes the serializableCheck to fail
      // setting serializableCheck: false is a temporary fix until the issue is resolved
      // if this is removed prior to fix, the application will report lots of warnings/errors in the console
      return getDefaultMiddleware({
        serializableCheck: false,
      }).concat(createAnalyticsMiddleware(analyticsEvents));
    },
    devTools:
      !environment.isProduction() && window.__REDUX_DEVTOOLS_EXTENSION__,
  });

  store.reducerMap = reducer;

  store.injectReducer = (key, newReducer) => {
    store.reducerMap[key] = newReducer;
    store.replaceReducer(combineReducers(store.reducerMap));
  };

  return store;
}
