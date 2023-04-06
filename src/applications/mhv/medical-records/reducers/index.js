import { combineReducers } from 'redux';

import { breadcrumbsReducer } from './breadcrumbs';
import { labsAndTestsReducer } from './labsAndTests';
import { vaccineReducer } from './vaccines';
import { vitalReducer } from './vitals';

const rootReducer = {
  mr: combineReducers({
    breadcrumbs: breadcrumbsReducer,
    labsAndTests: labsAndTestsReducer,
    vaccines: vaccineReducer,
    vitals: vitalReducer,
  }),
};

export default rootReducer;
