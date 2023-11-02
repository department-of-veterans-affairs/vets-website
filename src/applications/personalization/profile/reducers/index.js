import vapService from '@@vap-svc/reducers';
import hcaEnrollmentStatus from './hcaEnrollmentStatus';
import ratedDisabilities from '~/applications/personalization/rated-disabilities/reducers';
import vaProfile from './vaProfile';
import communicationPreferences from '../ducks/communicationPreferences';
import { profileContactsReducer } from './contacts';

export default {
  communicationPreferences,
  vaProfile,
  vapService,
  hcaEnrollmentStatus,
  ...ratedDisabilities,
  profileContacts: profileContactsReducer,
};

export const selectCommunicationPreferences = state => {
  return state.communicationPreferences;
};
