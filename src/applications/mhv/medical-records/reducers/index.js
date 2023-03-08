import { combineReducers } from 'redux';

import { breadcrumbsReducer } from './breadcrumbs';
import { vaccineReducer } from './vaccine';
import { vitalReducer } from './vitals';

const rootReducer = {
  mr: combineReducers({
    breadcrumbs: breadcrumbsReducer,
    vaccines: vaccineReducer,
    vitals: vitalReducer,
  }),
};

export default rootReducer;
