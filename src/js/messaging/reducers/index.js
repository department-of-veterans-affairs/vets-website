import { combineReducers } from 'redux';

import folders from './folders';
import messages from './messages';
import drafts from './drafts';
import compose from './compose';
import modals from './modals';

export default combineReducers({
  folders,
  messages,
  drafts,
  compose,
  modals
});
