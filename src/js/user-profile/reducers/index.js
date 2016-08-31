import { combineReducers } from 'redux';

import login from './login';
import profile from './profile';

export default combineReducers({
  login,
  profile
});

