import { selectDrupalStaticData } from 'platform/site-wide/drupal-static-data/selectors';

export const selectVamcPoliceData = state =>
  selectDrupalStaticData(state)?.vamcPoliceData?.data || {};

export const selectPoliceDataByVhaId = state =>
  selectVamcPoliceData(state)?.policeDataByVhaId || {};
