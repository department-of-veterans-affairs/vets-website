import { createSelector } from 'reselect';

const getEnrollmentCardState = state =>
  state.enrollmentCard.toggleEnrollmentErrorStatement;

export const getEnrollmentCard = createSelector(
  [getEnrollmentCardState],
  toggleEnrollmentErrorStatement => toggleEnrollmentErrorStatement,
);
