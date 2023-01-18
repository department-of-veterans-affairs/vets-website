import { combineReducers } from 'redux';

import { breadcrumbsReducer } from './breadcrumbs';

const rootReducer = {
  mr: combineReducers({
    breadcrumbs: breadcrumbsReducer,
  }),
};

export default rootReducer;
