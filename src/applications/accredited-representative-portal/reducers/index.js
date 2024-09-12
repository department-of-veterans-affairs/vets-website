import { combineReducers } from 'redux';

import { FeatureToggleReducer as featureToggles } from 'platform/site-wide/feature-toggles/reducers';
import scheduledDowntime from 'platform/monitoring/DowntimeNotification/reducer';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import user from './user';
import navigation from './navigation';
import formConfig from '../accreditation/21a/config/form';

const form = createSaveInProgressFormReducer(formConfig);

const rootReducer = combineReducers({
  scheduledDowntime,
  featureToggles,
  navigation,
  user,
  form,
});

export default rootReducer;
