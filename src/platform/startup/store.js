/**
 * Module for Redux store related startup functions
 * @module platform/startup/store
 * @see module:platform/startup
 */
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import scheduledDowntime from '../monitoring/DowntimeNotification/reducer';
import externalServiceStatuses from '../monitoring/external-services/reducer';
import announcements from '../site-wide/announcements/reducers';
import { FeatureToggleReducer } from '../site-wide/feature-toggles/reducers';
import megaMenu from '../site-wide/mega-menu/reducers';
import navigation from '../site-wide/user-nav/reducers';
import login from '../user/authentication/reducers';
import profile from '../user/profile/reducers';
import environment from '../utilities/environment';
import createAnalyticsMiddleware from './analytics-middleware';

const brandConsolidatedReducers = {
  megaMenu,
};

/**
 * Reducer object containing all of the site-wide reducers
 * @type {object}
 */
export const commonReducer = {
  announcements,
  externalServiceStatuses,
  featureToggles: FeatureToggleReducer,
  navigation,
  scheduledDowntime,
  user: combineReducers({ login, profile }),
  ...brandConsolidatedReducers,
};

/**
 * Creates a Redux store and merges the provided reducer with commonReducer. It also
 * sets up the Redux devtools in development and adds redux-thunk as middleware.
 *
 * @param {Object} [appReducer={}] An object with reducer functions as properties
 * @param {Array} analyticsEvents A list of analytics events to capture when redux actions are fired
 * @returns {Store} The Redux store with a combined reducer from the commonReducer and
 * appReducer.
 */
export default function createCommonStore(
  appReducer = {},
  analyticsEvents = [],
) {
  const reducer = {
    ...appReducer,
    ...commonReducer,
  };
  const useDevTools =
    !environment.isProduction() && window.__REDUX_DEVTOOLS_EXTENSION__;

  const store = createStore(
    combineReducers(reducer),
    compose(
      applyMiddleware(thunk, createAnalyticsMiddleware(analyticsEvents)),
      useDevTools ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );

  store.reducerMap = reducer;

  store.injectReducer = (key, newReducer) => {
    store.reducerMap[key] = newReducer;
    store.replaceReducer(combineReducers(store.reducerMap));
  };

  return store;
}
