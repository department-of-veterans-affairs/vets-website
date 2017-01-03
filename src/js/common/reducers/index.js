import { combineReducers } from 'redux';

import userLogin from '../../common/reducers/user-login';
import userProfile from '../../common/reducers/user-profile';
import rxAlert from '../../common/reducers/rx-alert';
import rxDisclaimer from '../../common/reducers/rx-disclaimer';
import rxModals from '../../common/reducers/rx-modals';
import rxPrescriptions from '../../common/reducers/rx-prescriptions';


export default combineReducers({
  userLogin,
  userProfile,
  rxAlert,
  rxDisclaimer,
  rxModals,
  rxPrescriptions
});

