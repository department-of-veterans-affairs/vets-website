import { combineReducers } from 'redux';
import uploads from './uploads';
import detail from './tracked-item-detail';

export default combineReducers({
  detail,
  uploads
});

