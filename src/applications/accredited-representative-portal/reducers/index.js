import { combineReducers } from 'redux';

import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';
import scheduledDowntime from 'platform/monitoring/DowntimeNotification/reducer';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import userReducer from './user';
import formConfig from '../accreditation/21a/config/form';

const rootReducer = combineReducers({
  user: userReducer,
  form: createSaveInProgressFormReducer(formConfig),
  featureToggles: FeatureToggleReducer,
  navigation: () => ({ showLoginModal: false }),
  scheduledDowntime,
});

export default rootReducer;
