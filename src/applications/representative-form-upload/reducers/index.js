import { combineReducers } from 'redux';

import { FeatureToggleReducer as featureToggles } from 'platform/site-wide/feature-toggles/reducers';
import scheduledDowntime from 'platform/monitoring/DowntimeNotification/reducer';
import createSchemaFormReducer from 'platform/forms-system/src/js/state';

import user from './user';
import formConfig from '../config/form';

const config = formConfig();
const rootReducer = combineReducers({
  form: createSchemaFormReducer(config),
  navigation: state => ({ ...state, showLoginModal: false }),
  scheduledDowntime,
  featureToggles,
  user,
});

export default rootReducer;
