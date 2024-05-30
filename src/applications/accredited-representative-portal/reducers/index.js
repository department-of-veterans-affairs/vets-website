import { combineReducers } from 'redux';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';

import user from './user';

const rootReducer = combineReducers({
  user,
  featureToggles: FeatureToggleReducer,
});

export default rootReducer;
