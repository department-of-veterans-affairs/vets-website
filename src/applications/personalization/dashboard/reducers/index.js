import claimsAppeals from '~/applications/claims-status/reducers';
import hcaEnrollmentStatus from '~/applications/hca/reducers/hca-enrollment-status-reducer';
import prescriptions from './prescriptions';
import recipients from './recipients';
import folders from './folders';
import preferences from '../../preferences/reducers';
import appointments from '../../appointments/reducers';

import { combineReducers } from 'redux';

export default {
  ...claimsAppeals,
  preferences,
  appointments,
  hcaEnrollmentStatus,
  health: combineReducers({
    rx: combineReducers({
      prescriptions,
    }),
    msg: combineReducers({
      recipients,
      folders,
    }),
  }),
};
