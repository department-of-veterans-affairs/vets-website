import { combineReducers } from 'redux';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';

import arfUserReducer from './user';

const rootReducer = combineReducers({
  user: arfUserReducer,
  featureToggles: FeatureToggleReducer,
});

export default rootReducer;
