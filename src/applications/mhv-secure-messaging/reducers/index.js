import { combineReducers } from 'redux';

import { alertsReducer } from './alerts';
import { recipientsReducer } from './recipients';
import { categoriesReducer } from './categories';
import { foldersReducer } from './folders';
import { searchReducer } from './search';
import { triageTeamsReducer } from './triageTeams';
import { breadcrumbsReducer } from './breadcrumbs';
import { threadsReducer } from './threads';
import { preferencesReducer } from './preferences';
import { threadDetailsReducer } from './threadDetails';
import { facilitiesReducer } from './facilities';
import { prescriptionReducer } from './prescription';

const rootReducer = {
  sm: combineReducers({
    alerts: alertsReducer,
    recipients: recipientsReducer,
    breadcrumbs: breadcrumbsReducer,
    categories: categoriesReducer,
    facilities: facilitiesReducer,
    folders: foldersReducer,
    search: searchReducer,
    threads: threadsReducer,
    threadDetails: threadDetailsReducer,
    triageTeams: triageTeamsReducer,
    preferences: preferencesReducer,
    prescription: prescriptionReducer,
  }),
};

export default rootReducer;
