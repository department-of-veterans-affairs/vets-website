import { combineReducers } from 'redux';

import { alertsReducer } from './alerts';
import { allRecipientsReducer } from './allRecipients';
import { categoriesReducer } from './categories';
import { foldersReducer } from './folders';
import { searchReducer } from './search';
import { triageTeamsReducer } from './triageTeams';
import { breadcrumbsReducer } from './breadcrumbs';
import { threadsReducer } from './threads';
import { preferencesReducer } from './preferences';
import { threadDetailsReducer } from './threadDetails';
import { facilitiesReducer } from './facilities';

const rootReducer = {
  sm: combineReducers({
    alerts: alertsReducer,
    allRecipients: allRecipientsReducer,
    breadcrumbs: breadcrumbsReducer,
    categories: categoriesReducer,
    facilities: facilitiesReducer,
    folders: foldersReducer,
    search: searchReducer,
    threads: threadsReducer,
    threadDetails: threadDetailsReducer,
    triageTeams: triageTeamsReducer,
    preferences: preferencesReducer,
  }),
};

export default rootReducer;
