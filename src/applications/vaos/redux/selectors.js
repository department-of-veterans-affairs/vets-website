import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import {
  selectPatientFacilities,
  selectVAPResidentialAddress,
} from 'platform/user/selectors';

export const selectIsCernerOnlyPatient = state =>
  !!selectPatientFacilities(state)?.every(
    f => f.isCerner && f.usesCernerAppointments,
  );

export const selectIsCernerPatient = state =>
  selectPatientFacilities(state)?.some(
    f => f.isCerner && f.usesCernerAppointments,
  );
export const selectRegisteredCernerFacilityIds = state =>
  selectPatientFacilities(state)
    ?.filter(f => f.isCerner && f.usesCernerAppointments)
    .map(f => f.facilityId) || [];

export const selectIsRegisteredToSacramentoVA = state =>
  selectPatientFacilities(state)?.some(f => f.facilityId === '612');

export const selectFeatureApplication = state =>
  toggleValues(state).vaOnlineScheduling;
export const selectFeatureCancel = state =>
  toggleValues(state).vaOnlineSchedulingCancel;
export const selectFeatureRequests = state =>
  toggleValues(state).vaOnlineSchedulingRequests;
export const selectFeatureCommunityCare = state =>
  toggleValues(state).vaOnlineSchedulingCommunityCare;
export const selectFeatureDirectScheduling = state =>
  toggleValues(state).vaOnlineSchedulingDirect;
export const selectFeatureToggleLoading = state => toggleValues(state).loading;
// Use flat facility page for non Cerner patients
export const selectUseFlatFacilityPage = state => !selectIsCernerPatient(state);

export const selectHasVAPResidentialAddress = state =>
  !!selectVAPResidentialAddress(state)?.addressLine1;

export const selectSystemIds = state =>
  selectPatientFacilities(state)?.map(f => f.facilityId) || null;

export const selectFeatureFacilitySelectionV22 = state =>
  toggleValues(state).vaOnlineFacilitySelectionV22;

export const selectFeatureUnenrolledVaccine = state =>
  toggleValues(state).vaOnlineSchedulingUnenrolledVaccine;

export const selectFeatureVAOSServiceRequests = state =>
  toggleValues(state).vaOnlineSchedulingVAOSServiceRequests;

export const selectFeatureVAOSServiceVAAppointments = state =>
  toggleValues(state).vaOnlineSchedulingVAOSServiceVAAppointments;

export const selectFeatureVAOSServiceCCAppointments = state =>
  toggleValues(state).vaOnlineSchedulingVAOSServiceCCAppointments;

export const selectFeatureFacilitiesServiceV2 = state =>
  toggleValues(state).vaOnlineSchedulingFacilitiesServiceV2;

export const selectFeatureVariantTesting = state =>
  toggleValues(state).vaOnlineSchedulingVariantTesting;

export const selectFeaturePocHealthApt = state =>
  toggleValues(state).vaOnlineSchedulingPocHealthApt;

export const selectFeatureStatusImprovement = state =>
  toggleValues(state).vaOnlineSchedulingStatusImprovement;

export const selectFeatureFilter36Vats = state =>
  toggleValues(state).vaOnlineFilter36Vats;

export const selectFeatureVaosV2Next = state =>
  toggleValues(state).vaOnlineSchedulingVaosV2Next;
