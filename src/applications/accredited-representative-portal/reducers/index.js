import { combineReducers } from 'redux';

import scheduledDowntime from 'platform/monitoring/DowntimeNotification/reducer';
import { FeatureToggleReducer } from '@department-of-veterans-affairs/platform-site-wide/feature-toggles/reducers';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import formConfig from '../accreditation/21a/config/form';
import userReducer from './user';

const rootReducer = combineReducers({
  featureToggles: FeatureToggleReducer,
  form: createSaveInProgressFormReducer(formConfig),
  navigation: () => ({ showLoginModal: false }),
  scheduledDowntime,
  user: userReducer,
});

export default rootReducer;
