/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import { combineReducers } from 'redux';
import accountStatus from './account';
import medicationsReducer from '../../mhv-medications/reducers/index';
import medicalRecordsReducer from '../../mhv-medical-records/reducers/index';
import secureMessagesReducer from '../../mhv-secure-messaging/reducers/index';

const rootReducer = {
  myHealth: combineReducers({ accountStatus }),
  ...medicationsReducer,
  ...medicalRecordsReducer,
  ...secureMessagesReducer,
};

export default rootReducer;
