/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import { combineReducers } from 'redux';
import personalInformation from './personalInformation';
import medicationsReducer from '../../mhv-medications/reducers/index';
import secureMessagesReducer from '../../mhv-secure-messaging/reducers/index';
import medicalRecordsReducer from '../../mhv-medical-records/reducers/index';

const rootReducer = {
  myHealth: combineReducers({ personalInformation }),
  ...medicationsReducer,
  ...secureMessagesReducer,
  ...medicalRecordsReducer,
};

export default rootReducer;
