import { combineReducers } from 'redux';

import folders from './folders';
import messages from './messages';
import compose from './compose';
import modals from './modals';

export default combineReducers({
  folders,
  messages,
  compose,
  modals
});
