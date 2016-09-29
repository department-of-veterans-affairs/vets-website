import { combineReducers } from 'redux';

import alert from './alert';
import compose from './compose';
import folders from './folders';
import messages from './messages';
import modals from './modals';
import redirects from './redirects';

export default combineReducers({
  alert,
  compose,
  folders,
  messages,
  modals,
  redirects
});
