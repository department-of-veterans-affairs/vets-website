import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';

export function createReduxStore() {
  const rootReducer = combineReducers({
    featureToggles: FeatureToggleReducer,
  });

  const useDevTools =
    !environment.isProduction() && window.__REDUX_DEVTOOLS_EXTENSION__;

  return createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      useDevTools ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );
}

export default createReduxStore();
