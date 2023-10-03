import { combineReducers } from 'redux';

import { breadcrumbsReducer } from './breadcrumbs';
import { conditionReducer } from './conditions';
import { labsAndTestsReducer } from './labsAndTests';
import { careSummariesAndNotesReducer } from './careSummariesAndNotes';
import { vaccineReducer } from './vaccines';
import { vitalReducer } from './vitals';
import { allergyReducer } from './allergies';
import { sharingReducer } from './sharing';
import { alertsReducer } from './alerts';

const rootReducer = {
  mr: combineReducers({
    allergies: allergyReducer,
    breadcrumbs: breadcrumbsReducer,
    labsAndTests: labsAndTestsReducer,
    careSummariesAndNotes: careSummariesAndNotesReducer,
    vaccines: vaccineReducer,
    vitals: vitalReducer,
    conditions: conditionReducer,
    sharing: sharingReducer,
    alerts: alertsReducer,
  }),
};

export default rootReducer;
