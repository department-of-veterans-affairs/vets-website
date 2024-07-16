import { combineReducers } from 'redux';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';
import arpUserReducer from './user';
import form21aSaveInProgress from './form21aSaveInProgress';

const rootReducer = combineReducers({
  user: arpUserReducer,
  featureToggles: FeatureToggleReducer,
  form21aSaveInProgress,
});

export default rootReducer;
