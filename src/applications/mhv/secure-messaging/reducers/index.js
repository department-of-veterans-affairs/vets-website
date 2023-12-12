import { combineReducers } from 'redux';

import { alertsReducer } from './alerts';
import { recipientsReducer } from './recipients';
import { categoriesReducer } from './categories';
import { draftDetailsReducer } from './draftDetails';
import { foldersReducer } from './folders';
import { messageDetailsReducer } from './messageDetails';
import { searchReducer } from './search';
import { triageTeamsReducer } from './triageTeams';
import { breadcrumbsReducer } from './breadcrumbs';
import { threadsReducer } from './threads';
import { preferencesReducer } from './preferences';
import { facilitiesReducer } from './facilities';

const rootReducer = {
  sm: combineReducers({
    alerts: alertsReducer,
    recipients: recipientsReducer,
    breadcrumbs: breadcrumbsReducer,
    categories: categoriesReducer,
    draftDetails: draftDetailsReducer,
    facilities: facilitiesReducer,
    folders: foldersReducer,
    messageDetails: messageDetailsReducer,
    search: searchReducer,
    threads: threadsReducer,
    triageTeams: triageTeamsReducer,
    preferences: preferencesReducer,
  }),
};

export default rootReducer;
