import { combineReducers } from 'redux';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';

const rootReducer = combineReducers({
  featureToggles: FeatureToggleReducer,
});

export default rootReducer;
