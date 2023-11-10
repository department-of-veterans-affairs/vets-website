import { combineReducers } from 'redux';

import { prescriptionsReducer } from './prescriptions';
import { breadcrumbsReducer } from './breadcrumbs';
import { allergiesReducer } from './allergies';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
    breadcrumbs: breadcrumbsReducer,
    // TODO: consider re-using this from medical-records
    allergies: allergiesReducer,
  }),
};

export default rootReducer;
