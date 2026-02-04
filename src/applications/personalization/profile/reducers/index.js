import createSchemaFormReducer from 'platform/forms-system/src/js/state';

import vapService from '@@vap-svc/reducers';
import hcaEnrollmentStatus from './hcaEnrollmentStatus';
import ratedDisabilities from './rated-disabilities';
import vaProfile from './vaProfile';
import communicationPreferences from '../ducks/communicationPreferences';
import { profileContactsReducer } from './contacts';
import directDeposit from './directDeposit';
import vyeRootReducer from '../components/direct-deposit/vye/reducers';

// Minimal form config for SubTask component
const minimalFormConfig = {};

export default {
  communicationPreferences,
  vaProfile,
  vapService,
  hcaEnrollmentStatus,
  ...ratedDisabilities,
  profileContacts: profileContactsReducer,
  directDeposit,
  ...vyeRootReducer,
  form: createSchemaFormReducer(minimalFormConfig),
};

export const selectCommunicationPreferences = state => {
  return state.communicationPreferences;
};
