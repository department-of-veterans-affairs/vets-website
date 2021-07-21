import vapService from '@@vap-svc/reducers';
import hcaEnrollmentStatus from '~/applications/hca/reducers/hca-enrollment-status-reducer';
import ratedDisabilities from '~/applications/personalization/rated-disabilities/reducers';
import vaProfile from './vaProfile';
import communicationPreferences from '../ducks/communicationPreferences';

export default {
  communicationPreferences,
  vaProfile,
  vapService,
  hcaEnrollmentStatus,
  ...ratedDisabilities,
};
