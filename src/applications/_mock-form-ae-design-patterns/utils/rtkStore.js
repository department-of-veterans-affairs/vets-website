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
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(createAnalyticsMiddleware(analyticsEvents)),
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
