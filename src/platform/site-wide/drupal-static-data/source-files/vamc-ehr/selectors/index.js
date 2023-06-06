import { selectDrupalStaticData } from 'platform/site-wide/drupal-static-data/selectors';

export const selectVamcEhrData = state =>
  selectDrupalStaticData(state)?.vamcEhrData?.data || {};

export const selectEhrDataByVhaId = state =>
  selectVamcEhrData(state)?.ehrDataByVhaId || {};

export const selectVistaFacilities = state =>
  selectVamcEhrData(state)?.vistaFacilities || [];

export const selectCernerFacilities = state =>
  selectVamcEhrData(state)?.cernerFacilities || [];

export const selectCernerFacilityIds = state =>
  selectCernerFacilities(state)?.map(facility => facility.vhaId) || [];
