import { createSelector } from 'reselect';

const getMockDataState = state => state.mockData.mockData;

export const getMockData = createSelector(
  [getMockDataState],
  mockData => mockData,
);
