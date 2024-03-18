import { createSelector } from 'reselect';

const getToggleEnrollmentErrorState = state =>
  state.enrollmentCard.toggleEnrollmentError;

export const getToggleEnrollmentError = createSelector(
  [getToggleEnrollmentErrorState],
  toggleEnrollmentError => toggleEnrollmentError,
);
