import { createSelector } from 'reselect';

const getToggleEnrollmentSuccessState = state =>
  state.enrollmentCard.toggleEnrollmentSuccess;

export const getToggleEnrollmentSuccess = createSelector(
  [getToggleEnrollmentSuccessState],
  toggleEnrollmentSuccess => toggleEnrollmentSuccess,
);
