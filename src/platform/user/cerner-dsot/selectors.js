import { selectProfile } from 'platform/user/selectors';
import { selectCernerFacilityIds } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';

/**
 * Augments state.user.profile.facilities with data from vamc-ehr.json.
 * Valid state depends on selectDrupalStaticData(state).vamcEhrData.loading
 * being false.
 * **TODO**: dispatch FETCH_STATIC_DATA_FAILED and set vamcEhrData.errors when
 *  when fetching fails.
 * @param {Object} state
 * @returns {Object} the current user's facilities, including a facility's EHR data.
 */
export const selectPatientFacilities = state => {
  const cernerFacilityIds = selectCernerFacilityIds(state);

  return (
    selectProfile(state)?.facilities?.map(({ facilityId }) => {
      let isCernerFacility = false;

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
    }) || null
  );
};

// export const selectPatientCernerFacilities = state =>
//   selectPatientFacilities(state)?.filter(f => f.isCerner) || [];

export const selectIsCernerOnlyPatient = state =>
  !!selectPatientFacilities(state)?.every(f => f.isCerner);

export const selectIsCernerPatient = state =>
  selectPatientFacilities(state)?.some(f => f.isCerner);
