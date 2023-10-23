import { selectJsonStaticData } from 'platform/site-wide/json-static-data/selectors';

export const selectVamcEhrData = state =>
  selectJsonStaticData(state)?.vamcEhrData?.data || {};

export const selectEhrDataByVhaId = state =>
  selectVamcEhrData(state)?.ehrDataByVhaId || {};

export const selectVistaFacilities = state =>
  selectVamcEhrData(state)?.vistaFacilities || [];

export const selectCernerFacilities = state =>
  selectVamcEhrData(state)?.cernerFacilities || [];

export const selectCernerFacilityIds = state =>
  selectCernerFacilities(state)?.map(facility => facility.vhaId) || [];
