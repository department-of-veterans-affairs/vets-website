import vapService from '@@vap-svc/reducers';
import hcaEnrollmentStatus from './hcaEnrollmentStatus';
import ratedDisabilities from './rated-disabilities';
import vaProfile from './vaProfile';
import communicationPreferences from '../ducks/communicationPreferences';
import { profileContactsReducer } from './contacts';
import directDeposit from './directDeposit';
import vyeRootReducer from '../components/direct-deposit/vye/reducers';

export default {
  communicationPreferences,
  vaProfile,
  vapService,
  hcaEnrollmentStatus,
  ...ratedDisabilities,
  profileContacts: profileContactsReducer,
  directDeposit,
  ...vyeRootReducer,
};

export const selectCommunicationPreferences = state => {
  return state.communicationPreferences;
};
