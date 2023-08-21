import { combineReducers } from 'redux';

import { prescriptionsReducer } from './prescriptions';
import { breadcrumbsReducer } from './breadcrumbs';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
    breadcrumbs: breadcrumbsReducer,
  }),
};

export default rootReducer;
