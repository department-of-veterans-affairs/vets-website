import { selectDrupalStaticData } from 'platform/site-wide/drupal-static-data/selectors';
import { selectProfile } from 'platform/user/selectors';

export const selectCernerFacilities = state =>
  selectDrupalStaticData(state)?.cernerFacilities?.data || [];

export const selectCernerFacilityIds = state =>
  selectCernerFacilities(state)?.map(facility => facility.vhaId) || [];

export const selectPatientFacilities = state =>
  selectProfile(state)?.facilities?.map(({ facilityId }) => {
    let isCernerFacility = false;

    const cernerFacilityIds = selectCernerFacilityIds(state);
    if (cernerFacilityIds) {
      isCernerFacility = cernerFacilityIds.includes(facilityId);
    }

    if (isCernerFacility) {
      return {
        facilityId,
        isCerner: true,
        usesCernerAppointments: true,
        usesCernerMedicalRecords: true,
        usesCernerMessaging: true,
        usesCernerRx: true,
        usesCernerTestResults: true,
      };
    }
    return {
      facilityId,
      isCerner: false,
    };
  }) || null;

export const selectPatientCernerFacilities = state =>
  selectPatientFacilities(state)?.filter(f => f.isCerner) || [];

export const selectIsCernerOnlyPatient = state =>
  !!selectPatientFacilities(state)?.every(f => f.isCerner);

export const selectIsCernerPatient = state =>
  selectPatientFacilities(state)?.some(f => f.isCerner);
