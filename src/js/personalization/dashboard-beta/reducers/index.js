import claimsAppeals from '../../../claims-status/reducers';
import prescriptions from '../../../rx/reducers/prescriptions';
import messages from '../../../messaging/reducers/messages';
import folders from '../../../messaging/reducers/folders';
import { combineReducers } from 'redux';

export default {
  ...claimsAppeals,
  health: combineReducers({
    rx: combineReducers({
      prescriptions,
    }),
    msg: combineReducers({
      messages,
      folders,
    }),
  })
};
