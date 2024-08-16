/**
 * Module for Redux store related startup functions
 * @module platform/startup/store
 * @see module:platform/startup
 */
// Node modules.
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
// Relative imports.
import call from 'applications/seamless-call/reducers';
import i18Reducer from 'applications/static-pages/i18Select/reducers';
import announcements from '../site-wide/announcements/reducers';
import createAnalyticsMiddleware from './analytics-middleware';
import environment from '../utilities/environment';
import externalServiceStatuses from '../monitoring/external-services/reducer';
import headerMenuReducer from '../site-wide/header/containers/Menu/reducer';
import drupalStaticData from '../site-wide/drupal-static-data/reducers';
import login from '../user/authentication/reducers';
import megaMenu from '../site-wide/mega-menu/reducers';
import navigation from '../site-wide/user-nav/reducers';
import layout from '../site-wide/layout/reducers';
import profile from '../user/profile/reducers';
import scheduledDowntime from '../monitoring/DowntimeNotification/reducer';
import { FeatureToggleReducer } from '../site-wide/feature-toggles/reducers';

const brandConsolidatedReducers = {
  megaMenu,
};

/**
 * Reducer object containing all of the site-wide reducers
 * @type {object}
 */
export const commonReducer = {
  announcements,
  headerMenuReducer,
  externalServiceStatuses,
  featureToggles: FeatureToggleReducer,
  drupalStaticData,
  navigation,
  scheduledDowntime,
  i18State: i18Reducer,
  user: combineReducers({ login, profile }),
  layout,
  ...brandConsolidatedReducers,
  call,
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
      persistState('i18State'),
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
