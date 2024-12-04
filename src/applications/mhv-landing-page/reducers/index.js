import { combineReducers } from 'redux';
import personalInformation from './personalInformation';
import accountStatus from './account';

const myHealth = combineReducers({
  personalInformation,
  accountStatus,
});

export default {
  myHealth,
};
