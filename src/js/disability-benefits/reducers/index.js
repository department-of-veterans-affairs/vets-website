import { combineReducers } from 'redux';
import claims from './claims-list';
import claimDetail from './claim-detail';
import claimAsk from './claim-ask';
import claimSync from './claim-sync';
import uploads from './uploads';
import routing from './routing';

export default combineReducers({
  claims,
  claimDetail,
  claimAsk,
  claimSync,
  uploads,
  routing
});
