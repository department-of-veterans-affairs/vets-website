import { combineReducers } from 'redux';
import claims from './claims-list';
import claimDetail from './claim-detail';
import claimAsk from './claim-ask';
import claimSync from './claim-sync';
import trackedItem from './tracked-item';

export default combineReducers({
  claims,
  claimDetail,
  claimAsk,
  claimSync,
  trackedItem
});
