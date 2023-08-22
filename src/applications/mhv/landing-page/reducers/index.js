import { combineReducers } from 'redux';
import { hcaEnrollmentStatusReducer } from './hca-es';

const mhvLandingPageReducer = combineReducers({
  hcaEnrollmentStatus: hcaEnrollmentStatusReducer,
});

export default {
  mhvLandingPageReducer,
};
