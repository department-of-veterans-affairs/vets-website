import { combineReducers } from 'redux';

import folders from './folders';
import compose from './compose';

export default combineReducers({
  folders,
  compose
});
