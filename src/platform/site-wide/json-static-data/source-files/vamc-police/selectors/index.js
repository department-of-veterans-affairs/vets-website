import { selectJsonStaticData } from 'platform/site-wide/json-static-data/selectors';

export const selectPoliceData = state =>
  selectJsonStaticData(state)?.vamcEhrData?.data || {};

export const selectPoliceDataByVhaId = state =>
  selectPoliceData(state)?.dataByVhaId || {};
