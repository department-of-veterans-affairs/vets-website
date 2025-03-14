import profile from '@@profile/reducers';
import { combineReducers } from 'redux';
import appointments from '~/applications/personalization/appointments/reducers';
import notifications from '../../common/reducers/notifications';
import claims from './claims';
import prescriptions from './prescriptions';
import recipients from './recipients';
import folders from './folders';
import unreadCount from './unreadCount';
import debts from './debts';
import payments from './payments';
import forms from './form-status';
import formPdfs from './form-pdf-urls';

export default {
  ...profile,
  claims,
  notifications,
  allPayments: payments,
  allDebts: debts,
  submittedForms: forms,
  myVaFormPdfs: formPdfs,
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
