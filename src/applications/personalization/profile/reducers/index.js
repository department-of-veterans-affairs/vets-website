import vapService from '@@vap-svc/reducers';
import hcaEnrollmentStatus from '~/applications/hca/reducers/enrollment-status';
import ratedDisabilities from '~/applications/personalization/rated-disabilities/reducers';
import vaProfile from './vaProfile';
import communicationPreferences from '../ducks/communicationPreferences';
import { emergencyContactsReducer } from './ec';
import { nextOfKinReducer } from './nok';

export default {
  communicationPreferences,
  vaProfile,
  vapService,
  hcaEnrollmentStatus,
  ...ratedDisabilities,
  emergencyContactsReducer,
  nextOfKinReducer,
};

export const selectCommunicationPreferences = state => {
  return state.communicationPreferences;
};
