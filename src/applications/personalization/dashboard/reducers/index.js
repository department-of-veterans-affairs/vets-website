import claimsAppeals from '~/applications/claims-status/reducers';
import hcaEnrollmentStatus from '~/applications/hca/reducers/hca-enrollment-status-reducer';
import prescriptions from './prescriptions';
import recipients from './recipients';
import folders from './folders';
import preferences from '../../preferences/reducers';
import appointments from '~/applications/personalization/appointments/reducers';
import profile from '@@profile/reducers';

import ratedDisabilities from '~/applications/personalization/rated-disabilities/reducers';

import { combineReducers } from 'redux';

export default {
  ...claimsAppeals,
  preferences,
  ...profile,
  ...ratedDisabilities,
  hcaEnrollmentStatus,
  health: combineReducers({
    appointments,
    rx: combineReducers({
      prescriptions,
    }),
    msg: combineReducers({
      recipients,
      folders,
    }),
  }),
};
