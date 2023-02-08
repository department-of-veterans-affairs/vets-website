import { selectCernerFacilities } from '~/platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { selectPatientCernerFacilities } from '~/platform/user/cerner-dsot/selectors';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

const selectFolders = state => state.health?.msg?.folders;
export const selectUnreadCount = state => state.health?.msg?.unreadCount;
export const selectFolder = state => selectFolders(state)?.data?.currentItem;

export const selectUseVaosV2APi = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileUseVaosV2Api] || false;

export const selectUserCernerFacilityNames = state => {
  const patientCernerFacilityIds = selectPatientCernerFacilities(state)?.map(
    f => f.facilityId,
  );

  // derive the facility names based on the ids of the ve
  return selectCernerFacilities(state)?.reduce((acc, current) => {
    return patientCernerFacilityIds?.includes(current.vhaId)
      ? [...acc, current.vamcSystemName]
      : acc;
  }, []);
};
