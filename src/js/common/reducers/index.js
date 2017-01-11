import { combineReducers } from 'redux';

import login from '../../login/reducers/login';
import profile from '../../user-profile/reducers/profile';

import alertRx from '../../rx/reducers/alert';
import disclaimer from '../../rx/reducers/disclaimer';
import modalsRx from '../../rx/reducers/modals';
import prescriptions from '../../rx/reducers/prescriptions';

export default combineReducers({
  user: combineReducers({
    login,
    profile
  }),
  health: combineReducers({
    rx: combineReducers({
      alertRx,
      disclaimer,
      modalsRx,
      prescriptions
    }),
  }),
});

