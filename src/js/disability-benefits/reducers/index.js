import { combineReducers } from 'redux';
import claims from './claims-list';
import claimDetail from './claim-detail';
import claimAsk from './claim-ask';
import claimSync from './claim-sync';
import uploads from './uploads';

export default combineReducers({
  claims,
  claimDetail,
  claimAsk,
  claimSync,
  uploads
});
