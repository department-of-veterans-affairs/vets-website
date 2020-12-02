import {
  CERNER_APPOINTMENTS_BLOCKLIST,
  CERNER_FACILITY_IDS,
  CERNER_MEDICAL_RECORDS_BLOCKLIST,
  CERNER_MESSAGING_BLOCKLIST,
  CERNER_RX_BLOCKLIST,
  CERNER_TEST_RESULTS_BLOCKLIST,
} from '../utilities/cerner';

export const selectUser = state => state.user;
export const isLoggedIn = state => selectUser(state).login.currentlyLoggedIn;
export const selectProfile = state => selectUser(state)?.profile || {};
export const isVAPatient = state => selectProfile(state).vaPatient === true;
export const selectVeteranStatus = state => selectProfile(state).veteranStatus;
export const isInMPI = state => selectProfile(state)?.status === 'OK';
export const hasMPIConnectionError = state =>
  selectProfile(state)?.status === 'SERVER_ERROR';
export const isProfileLoading = state => selectProfile(state).loading;
export const isLOA3 = state => selectProfile(state).loa.current === 3;
export const isLOA1 = state => selectProfile(state).loa.current === 1;
export const isMultifactorEnabled = state => selectProfile(state).multifactor;
export const selectAvailableServices = state => selectProfile(state)?.services;
export const selectPatientFacilities = state =>
  selectProfile(state)?.facilities?.map(({ facilityId, isCerner }) => {
    // Derive if the user belongs to a Cerner facility in the FE maintained list.
    const hasCernerFacilityID = CERNER_FACILITY_IDS.includes(facilityId);

    // Derive if we should consider it a Cerner facility.
    const isFlipperDisabled =
      state?.featureToggles?.[`cerner_override_${facilityId}`] === false;
    const isFlipperEnabled = !isFlipperDisabled;
    const passesCernerChecks =
      isFlipperEnabled && (isCerner || hasCernerFacilityID);

    const facility = {
      facilityId,
      // This overrides the MPI isCerner flag in favor of the feature toggle.
      isCerner: passesCernerChecks,
    };

    if (passesCernerChecks) {
      facility.usesCernerAppointments = !CERNER_APPOINTMENTS_BLOCKLIST.includes(
        facilityId,
      );
      facility.usesCernerMedicalRecords = !CERNER_MEDICAL_RECORDS_BLOCKLIST.includes(
        facilityId,
      );
      facility.usesCernerMessaging = !CERNER_MESSAGING_BLOCKLIST.includes(
        facilityId,
      );
      facility.usesCernerRx = !CERNER_RX_BLOCKLIST.includes(facilityId);
      facility.usesCernerTestResults = !CERNER_TEST_RESULTS_BLOCKLIST.includes(
        facilityId,
      );
    }

    return facility;
  }) || null;
export const selectVAPContactInfo = state =>
  selectProfile(state).vapContactInfo;
export const hasVAPServiceConnectionError = state =>
  selectVAPContactInfo(state)?.status === 'SERVER_ERROR';
export const selectVAPEmailAddress = state =>
  selectVAPContactInfo(state)?.email?.emailAddress;
const createPhoneNumberStringFromData = phoneNumberData => {
  const data = phoneNumberData || {};
  const areaCode = data.areaCode || '';
  const phoneNumber = data.phoneNumber || '';
  // in some test data the extension is set to '0000' and we want to treat that
  // as a null extension
  const extension = data.extension === '0000' ? undefined : data.extension;
  return `${areaCode}${phoneNumber}${extension ? `x${extension}` : ''}`;
};
export const selectVAPMobilePhone = state =>
  selectVAPContactInfo(state)?.mobilePhone;
export const selectVAPMobilePhoneString = state =>
  createPhoneNumberStringFromData(selectVAPMobilePhone(state));
export const selectVAPHomePhone = state =>
  selectVAPContactInfo(state)?.homePhone;
export const selectVAPHomePhoneString = state =>
  createPhoneNumberStringFromData(selectVAPHomePhone(state));
export const selectVAPResidentialAddress = state =>
  selectVAPContactInfo(state)?.residentialAddress;

export function createIsServiceAvailableSelector(service) {
  return state => selectAvailableServices(state).includes(service);
}

export const selectIsCernerOnlyPatient = state =>
  !!selectPatientFacilities(state)?.every(f => f.isCerner);

export const selectIsCernerPatient = state =>
  selectPatientFacilities(state)?.some(f => f.isCerner);

// return the Cerner facilities that are _not_ blocked from Cerner's RX features
export const selectCernerRxFacilities = state =>
  selectPatientFacilities(state)?.filter(f => f.isCerner && f.usesCernerRx);

// return the Cerner facilities that are _not_ blocked from Cerner's secure
// messaging features
export const selectCernerMessagingFacilities = state =>
  selectPatientFacilities(state)?.filter(
    f => f.isCerner && f.usesCernerMessaging,
  );

// return the Cerner facilities that are _not_ blocked from Cerner's
// appointments features
export const selectCernerAppointmentsFacilities = state =>
  selectPatientFacilities(state)?.filter(
    f => f.isCerner && f.usesCernerAppointments,
  );

// return the Cerner facilities that are _not_ blocked from Cerner's medical
// records features
export const selectCernerMedicalRecordsFacilities = state =>
  selectPatientFacilities(state)?.filter(
    f => f.isCerner && f.usesCernerMedicalRecords,
  );

// return the Cerner facilities that are _not_ blocked from Cerner's test and
// lab results features
export const selectCernerTestResultsFacilities = state =>
  selectPatientFacilities(state)?.filter(
    f => f.isCerner && f.usesCernerTestResults,
  );
