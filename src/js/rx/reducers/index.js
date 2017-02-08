import { combineReducers } from 'redux';

import alert from './alert';
import disclaimer from './disclaimer';
import errors from './errors';
import modals from './modals';
import prescriptions from './prescriptions';

export default combineReducers({
  alert,
  disclaimer,
  errors,
  modals,
  prescriptions
});
