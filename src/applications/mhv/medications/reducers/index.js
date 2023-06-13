import { combineReducers } from 'redux';

import { prescriptionsReducer } from './prescriptions';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
  }),
};

export default rootReducer;
