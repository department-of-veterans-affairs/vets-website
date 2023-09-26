import { combineReducers } from 'redux';
import { emergencyContactsReducer } from './ec';

const associatedPersons = combineReducers({
  emergencyContacts: emergencyContactsReducer,
});

export default {
  associatedPersons,
};
