// TODO: perhaps make these selectors fail gracefully if state.user, or any of
// the properties on the user object are not defined
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
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
export const isInMPI = state => selectProfile(state).status === 'OK';
export const hasMPIConnectionError = state =>
  selectProfile(state).status === 'SERVER_ERROR';
export const isProfileLoading = state => selectProfile(state).loading;
export const isLOA3 = state => selectProfile(state).loa.current === 3;
export const isLOA1 = state => selectProfile(state).loa.current === 1;
export const isMultifactorEnabled = state => selectProfile(state).multifactor;
export const selectAvailableServices = state => selectProfile(state)?.services;
export const selectPatientFacilities = state =>
  selectProfile(state)?.facilities?.map(({ facilityId, isCerner }) => {
    // TODO: The work in this selector to override the `isCerner` values will be
    // removed after the override logic gets moved to vets-api. ie, we will be
    // able to trust the `isCerner` flags that come directly from vets-api.

    // Derive if the user belongs to a Cerner facility in the FE maintained list.
    const hasCernerFacilityID = CERNER_FACILITY_IDS.includes(facilityId);

    // Derive if the feature toggle is on.
    // TODO: can this feature toggle check be removed since it should always be true now?
    const showNewScheduleViewAppointmentsPage =
      state?.featureToggles?.[
        featureFlagNames.showNewScheduleViewAppointmentsPage
      ];

    // Derive if they are a 200CRNR Cerner patient.
    const isCernerPatient = selectProfile(state)?.isCernerPatient;

    // Derive if we should consider it a Cerner facility.
    const passesCernerChecks =
      showNewScheduleViewAppointmentsPage &&
      (isCerner || (isCernerPatient && hasCernerFacilityID));

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
export const selectVet360 = state => selectProfile(state).vet360;
export const selectVet360EmailAddress = state =>
  selectVet360(state)?.email?.emailAddress;
const createPhoneNumberStringFromData = phoneNumberData => {
  const data = phoneNumberData || {};
  const areaCode = data.areaCode || '';
  const phoneNumber = data.phoneNumber || '';
  // in some test data the extension is set to '0000' and we want to treat that
  // as a null extension
  const extension = data.extension === '0000' ? undefined : data.extension;
  return `${areaCode}${phoneNumber}${extension ? `x${extension}` : ''}`;
};
export const selectVet360MobilePhone = state =>
  selectVet360(state)?.mobilePhone;
export const selectVet360MobilePhoneString = state =>
  createPhoneNumberStringFromData(selectVet360MobilePhone(state));
export const selectVet360HomePhone = state => selectVet360(state)?.homePhone;
export const selectVet360HomePhoneString = state =>
  createPhoneNumberStringFromData(selectVet360HomePhone(state));
export const selectVet360ResidentialAddress = state =>
  selectVet360(state)?.residentialAddress;

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
