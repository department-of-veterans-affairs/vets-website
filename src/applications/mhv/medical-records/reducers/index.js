import { combineReducers } from 'redux';

import { breadcrumbsReducer } from './breadcrumbs';
import { conditionReducer } from './conditions';
import { labsAndTestsReducer } from './labsAndTests';
import { careSummariesAndNotesReducer } from './careSummariesAndNotes';
import { vaccineReducer } from './vaccines';
import { vitalReducer } from './vitals';
import { allergyReducer } from './allergies';
import { sharingReducer } from './sharing';

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
  }),
};

export default rootReducer;
