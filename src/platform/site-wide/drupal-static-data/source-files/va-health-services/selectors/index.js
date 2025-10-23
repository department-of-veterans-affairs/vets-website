import { selectDrupalStaticData } from 'platform/site-wide/drupal-static-data/selectors';

export const selectVaHealthServicesData = state =>
  selectDrupalStaticData(state)?.vaHealthServicesData || [];

// index 8 is true/false for `fieldTricareSpecificService`
export const selectTRICAREHealthServicesData = state =>
  selectVaHealthServicesData(state)?.filter(hsdatum => hsdatum?.[8]) || [];

// index 7 is true/false for `fieldShowForVamcFacilities`
export const selectVAMCHealthServicesData = state =>
  selectVaHealthServicesData(state)?.filter(hsdatum => hsdatum?.[7]) || [];

// index 6 is true/false for `fieldShowForVbaFacilities`
export const selectVBAHealthServicesData = state =>
  selectVaHealthServicesData(state)?.filter(hsdatum => hsdatum?.[6]) || [];

// index 5 is true/false for `fieldShowForVetCenters`
export const selectVCHealthServicesData = state =>
  selectVaHealthServicesData(state)?.filter(hsdatum => hsdatum?.[5]) || [];
