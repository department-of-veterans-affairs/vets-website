import claimsAppeals from 'applications/claims-status/reducers';
import prescriptions from './prescriptions';
import recipients from './recipients';
import folders from './folders';
import preferences from '../../preferences/reducers';
import appointments from '../../appointments/reducers';
import authorization from 'applications/disability-benefits/686/reducers/authorization';
import { hcaEnrollmentStatus } from 'applications/hca/reducer';

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
  authorization686: authorization,
};
