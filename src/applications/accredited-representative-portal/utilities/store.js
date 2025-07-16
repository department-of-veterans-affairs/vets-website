import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
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
