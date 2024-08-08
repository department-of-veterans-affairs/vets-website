import { createSelector } from 'reselect';

const getToggleEnrollmentErrorStatementState = state =>
  state.enrollmentCard.toggleEnrollmentErrorStatement;

export const getToggleEnrollmentErrorStatement = createSelector(
  [getToggleEnrollmentErrorStatementState],
  toggleEnrollmentErrorStatement => toggleEnrollmentErrorStatement,
);
