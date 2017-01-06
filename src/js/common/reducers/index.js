import { combineReducers } from 'redux';

import login from '../../login/reducers/index';
import profile from '../../user-profile/reducers/index';

import alertRx from '../../rx/reducers/alert';
import disclaimer from '../../rx/reducers/disclaimer';
import modalsRx from '../../rx/reducers/modals';
import prescriptions from '../../rx/reducers/prescriptions';

import alert from '../../messaging/reducers/alert';
import compose from '../../messaging/reducers/compose';
import folders from '../../messaging/reducers/folders';
import loading from '../../messaging/reducers/loading';
import messages from '../../messaging/reducers/messages';
import modals from '../../messaging/reducers/modals';
import recipients from '../../messaging/reducers/recipients';
import search from '../../messaging/reducers/search';


export default combineReducers({
  user: combineReducers({
    login,
    profile,
  }),
  health: combineReducers({
    rx: combineReducers({
      alertRx,
      disclaimer,
      modalsRx,
      prescriptions
    }),
    messaging: combineReducers({
      alert,
      compose,
      folders,
      loading,
      messages,
      modals,
      recipients,
      search
    }),
  }),
});
