/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import { combineReducers } from 'redux';
import accountStatus from './account';
import secureMessagesReducer from '../../mhv-secure-messaging/reducers/index';

const rootReducer = {
  myHealth: combineReducers({ accountStatus }),
  ...secureMessagesReducer,
};

export default rootReducer;
