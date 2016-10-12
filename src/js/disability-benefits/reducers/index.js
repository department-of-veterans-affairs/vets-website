import { combineReducers } from 'redux';
import claims from './claims-list';
import claimDetail from './claim-detail';

export default combineReducers({
  claims,
  claimDetail
});
