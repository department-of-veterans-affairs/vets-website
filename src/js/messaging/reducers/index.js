import { combineReducers } from 'redux';

import alert from './alert';
import compose from './compose';
import folders from './folders';
import messages from './messages';
import modals from './modals';
import redirect from './redirect';
import search from './search';

export default combineReducers({
  alert,
  compose,
  folders,
  messages,
  modals,
  redirect,
  search
});
