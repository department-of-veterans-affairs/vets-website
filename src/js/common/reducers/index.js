import { combineReducers } from 'redux';

import login from '../../login/reducers/login';
import profile from '../../user-profile/reducers/profile';

export default combineReducers({
  user: combineReducers({
    login,
    profile
  }),
});

