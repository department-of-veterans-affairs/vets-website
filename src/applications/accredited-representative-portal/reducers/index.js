import { combineReducers } from 'redux';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';
import userReducer from './user';

const rootReducer = combineReducers({
  user: userReducer,
  featureToggles: FeatureToggleReducer,
});

export default rootReducer;
