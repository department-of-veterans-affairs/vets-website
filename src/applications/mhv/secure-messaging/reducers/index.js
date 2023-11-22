import { combineReducers } from 'redux';

import { alertsReducer } from './alerts';
import { categoriesReducer } from './categories';
import { draftDetailsReducer } from './draftDetails';
import { foldersReducer } from './folders';
import { messageDetailsReducer } from './messageDetails';
import { searchReducer } from './search';
import { triageTeamsReducer } from './triageTeams';
import { breadcrumbsReducer } from './breadcrumbs';
import { threadsReducer } from './threads';
import { preferencesReducer } from './preferences';
import { threadDetailsReducer } from './threadDetails';

const rootReducer = {
  sm: combineReducers({
    alerts: alertsReducer,
    breadcrumbs: breadcrumbsReducer,
    categories: categoriesReducer,
    draftDetails: draftDetailsReducer,
    folders: foldersReducer,
    messageDetails: messageDetailsReducer,
    search: searchReducer,
    threads: threadsReducer,
    threadDetails: threadDetailsReducer,
    triageTeams: triageTeamsReducer,
    preferences: preferencesReducer,
  }),
};

export default rootReducer;
