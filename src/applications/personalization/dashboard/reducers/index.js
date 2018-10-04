import claimsAppeals from '../../../claims-status/reducers';
import prescriptions from '../../../rx/reducers/prescriptions';
import recipients from '../../../messaging/reducers/recipients';
import folders from '../../../messaging/reducers/folders';
import appointments from '../../appointments/reducers';
import authorization from '../../../../applications/disability-benefits/686/reducers/authorization';

import { combineReducers } from 'redux';

export default {
  ...claimsAppeals,
  appointments,
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
