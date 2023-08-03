import profile from '@@profile/reducers';
import { combineReducers } from 'redux';
import notifications from '../../common/reducers/notifications';
import claimsV2 from './claimsV2';
import prescriptions from './prescriptions';
import recipients from './recipients';
import folders from './folders';
import unreadCount from './unreadCount';
import appointments from '~/applications/personalization/appointments/reducers';
import debts from './debts';
import payments from './payments';

export default {
  ...profile,
  claims: claimsV2,
  notifications,
  allPayments: payments,
  allDebts: debts,
  health: combineReducers({
    appointments,
    rx: combineReducers({
      prescriptions,
    }),
    msg: combineReducers({
      unreadCount,
      recipients,
      folders,
    }),
  }),
};
