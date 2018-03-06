import { combineReducers } from 'redux';

import appeals from '../../claims-status/reducers/appeals';
import claims from '../../claims-status/reducers/claims-list';
import claimsV2 from '../../claims-status/reducers/claimsV2';
import claimDetail from '../../claims-status/reducers/claim-detail';
import claimAsk from '../../claims-status/reducers/claim-ask';
import claimSync from '../../claims-status/reducers/claim-sync';
import uploads from '../../claims-status/reducers/uploads';
import routing from '../../claims-status/reducers/routing';
import notifications from '../../claims-status/reducers/notifications';

export default {
  disability: combineReducers({
    status: combineReducers({
      appeals,
      claims,
      claimsV2,
      claimDetail,
      claimAsk,
      claimSync,
      uploads,
      routing,
      notifications
    })
  })
};
