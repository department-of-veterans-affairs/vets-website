import { combineReducers } from 'redux';
import { emergencyContactsReducer } from './ec';
import { nextOfKinReducer } from './nok';

const associatedPersons = combineReducers({
  emergencyContacts: emergencyContactsReducer,
  nextOfKin: nextOfKinReducer,
});

export default {
  associatedPersons,
};
