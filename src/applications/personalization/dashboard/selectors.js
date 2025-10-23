import { selectCernerFacilities } from '~/platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { selectPatientCernerFacilities } from '~/platform/user/cerner-dsot/selectors';

const selectFolders = state => state.health?.msg?.folders;
export const selectUnreadCount = state => state.health?.msg?.unreadCount;
export const selectFolder = state => selectFolders(state)?.data?.currentItem;

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

export const selectPdfs = state => state.myVaFormPdfs;

export const selectPdf = (state, guid) => {
  return selectPdfs(state).submissions[guid] || {};
};

export const selectPdfUrlLoading = state => selectPdfs(state).loading;
