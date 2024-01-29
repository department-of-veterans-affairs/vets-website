import { combineReducers } from 'redux';
import personalInformation from './personalInformation';

const myHealth = combineReducers({
  personalInformation,
});

export default {
  myHealth,
};
