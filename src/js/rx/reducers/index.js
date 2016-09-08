import { combineReducers } from 'redux';

// TODO: Figure out why 'import * as...' isn't working here
import prescriptions from './prescriptions';
import alert from './alert';
import modal from './modal';
import disclaimer from './disclaimer';

export default combineReducers({
  prescriptions,
  alert,
  modal,
  disclaimer
});

