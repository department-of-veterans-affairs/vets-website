import { combineReducers } from 'redux';
import { hcaEnrollmentStatusReducer } from './hca-es';

const mhvLandingPage = combineReducers({
  hcaEnrollmentStatus: hcaEnrollmentStatusReducer,
});

export default {
  mhvLandingPage,
};
