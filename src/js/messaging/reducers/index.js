import { combineReducers } from 'redux';

import folders from './folders';
import messages from './messages';

export default combineReducers({
  folders,
  messages
});
