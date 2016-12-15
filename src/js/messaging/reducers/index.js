import { combineReducers } from 'redux';

import alert from './alert';
import compose from './compose';
import folders from './folders';
import messages from './messages';
import modals from './modals';
import recipients from './recipients';
import search from './search';

export default combineReducers({
  alert,
  compose,
  folders,
  messages,
  modals,
  recipients,
  search
});
