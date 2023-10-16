import vapService from '@@vap-svc/reducers';
import hcaEnrollmentStatus from '~/applications/hca/reducers/enrollment-status';
import ratedDisabilities from './rated-disabilities';
import vaProfile from './vaProfile';
import communicationPreferences from '../ducks/communicationPreferences';

export default {
  communicationPreferences,
  vaProfile,
  vapService,
  hcaEnrollmentStatus,
  ...ratedDisabilities,
};

export const selectCommunicationPreferences = state => {
  return state.communicationPreferences;
};
