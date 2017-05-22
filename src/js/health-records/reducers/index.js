import { combineReducers } from 'redux';

import form from './form';
import modal from './modal';
import refresh from './refresh';

export default combineReducers({
  form,
  modal,
  refresh,
});
