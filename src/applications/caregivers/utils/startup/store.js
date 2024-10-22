import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import persistState from 'redux-localstorage';
import createAnalyticsMiddleware from 'platform/startup/analytics-middleware';
import { commonReducer } from 'platform/startup/store';
import environment from 'platform/utilities/environment';

const createRtkStore = async props => {
  const { analyticsEvents = [], appReducer = {} } = props;

  const reducer = { ...appReducer, ...commonReducer };
  const useDevTools =
    !environment.isProduction() && window.__REDUX_DEVTOOLS_EXTENSION__;

  const store = configureStore({
    reducer,
    useDevTools,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(createAnalyticsMiddleware(analyticsEvents)),
    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(persistState('i18State')),
  });

  store.reducerMap = reducer;
  store.injectReducer = (key, newReducer) => {
    store.reducerMap[key] = newReducer;
    store.replaceReducer(combineReducers(store.reducerMap));
  };

  return store;
};

export default createRtkStore;
