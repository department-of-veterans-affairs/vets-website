import { combineReducers } from 'redux';

import login from '../../common/reducers/login';
import profile from '../../common/reducers/profile';

export default combineReducers({
  login,
  profile
});

