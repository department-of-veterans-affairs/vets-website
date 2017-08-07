import { combineReducers } from 'redux';
import appeals from './appeals';
import claims from './claims-list';
import claimDetail from './claim-detail';
import claimAsk from './claim-ask';
import claimSync from './claim-sync';
import uploads from './uploads';
import routing from './routing';
import notifications from './notifications';

export default {
  disability: combineReducers({
    status: combineReducers({
      appeals,
      claims,
      claimDetail,
      claimAsk,
      claimSync,
      uploads,
      routing,
      notifications
    })
  })
};
