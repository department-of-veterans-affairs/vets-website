import { combineReducers } from 'redux';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';
import arpUserReducer from './user';

const rootReducer = combineReducers({
  user: arpUserReducer,
  featureToggles: FeatureToggleReducer,
});

export default rootReducer;
