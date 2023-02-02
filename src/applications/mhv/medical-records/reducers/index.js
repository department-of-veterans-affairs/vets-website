import { combineReducers } from 'redux';

import { breadcrumbsReducer } from './breadcrumbs';
import { vaccineReducer } from './vaccine';

const rootReducer = {
  mr: combineReducers({
    breadcrumbs: breadcrumbsReducer,
    vaccines: vaccineReducer,
  }),
};

export default rootReducer;
