import { combineReducers } from 'redux';
import accountStatus from './account';

const myHealth = combineReducers({
  accountStatus,
});

export default {
  myHealth,
};
