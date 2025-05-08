import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

// Minimal reducer setup - just for feature toggles
const rootReducer = combineReducers({
  featureToggles: FeatureToggleReducer,
});

export const createReduxStore = () => {
  const store = createStore(rootReducer, applyMiddleware(thunk));

  // Initialize feature toggles
  store.dispatch(connectFeatureToggle);

  // Make the Redux state accessible globally for feature toggle checks
  if (!window.__REDUX_STATE__) {
    window.__REDUX_STATE__ = {};
  }

  // Sync Redux state with window object whenever state changes
  store.subscribe(() => {
    window.__REDUX_STATE__.featureToggles = store.getState().featureToggles;
  });

  return store;
};

export default createReduxStore;
