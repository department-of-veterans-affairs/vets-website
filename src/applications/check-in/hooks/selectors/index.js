import { createSelector } from 'reselect';

const selectCheckInData = createSelector(
  state => state.checkInData,
  checkInData => checkInData || {},
);

const makeSelectCheckInData = () => selectCheckInData;

export { selectCheckInData, makeSelectCheckInData };
