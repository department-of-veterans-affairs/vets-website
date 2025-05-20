import { combineReducers } from 'redux';
import { prescriptionsReducer } from './prescriptions';
import { allergiesReducer } from './allergies';
import { inProductEducationReducer } from './inProductEducation';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
    // TODO: consider re-using this from medical-records
    allergies: allergiesReducer,
    inProductEducation: inProductEducationReducer,
  }),
};

export default rootReducer;
