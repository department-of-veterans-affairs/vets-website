// eslint-disable-next-line import/no-unresolved
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { selectVAPResidentialAddress } from '@department-of-veterans-affairs/platform-user/selectors';
import {
  selectPatientFacilities,
  selectIsCernerPatient,
} from 'platform/user/cerner-dsot/selectors';

export const selectRegisteredCernerFacilityIds = state => {
  const data = selectPatientFacilities(state);

  return (
    data
      ?.filter(f => f.isCerner && f.usesCernerAppointments)
      .map(f => f.facilityId) || []
  );
};

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

export const selectFeatureStatusImprovement = state =>
  toggleValues(state).vaOnlineSchedulingStatusImprovement;

export const selectFeatureStatusImprovementCanceled = state =>
  toggleValues(state).vaOnlineSchedulingStatusImprovementCanceled;

export const selectFeatureVaosV2Next = state =>
  toggleValues(state).vaOnlineSchedulingVAOSV2Next;

export const selectFeatureAppointmentList = state =>
  toggleValues(state).vaOnlineSchedulingAppointmentList;

export const selectFeatureClinicFilter = state =>
  toggleValues(state).vaOnlineSchedulingClinicFilter;

export const selectFeatureAcheronService = state =>
  toggleValues(state).vaOnlineSchedulingAcheronService;

export const selectFeatureRequestFlowUpdate = state =>
  toggleValues(state).vaOnlineSchedulingRequestFlowUpdate;

export const selectFeaturePocTypeOfCare = state =>
  toggleValues(state).vaOnlineSchedulingPocTypeOfCare;

export const selectFeatureConvertUtcToLocaL = state =>
  toggleValues(state).vaOnlineSchedulingConvertUtcToLocal;

export const selectFeatureBreadcrumbUrlUpdate = state =>
  toggleValues(state).vaOnlineSchedulingBreadcrumbUrlUpdate;

export const selectFeaturePrintList = state =>
  toggleValues(state).vaOnlineSchedulingPrintList;

export const selectFeatureDescriptiveBackLink = state =>
  toggleValues(state).vaOnlineSchedulingDescriptiveBackLink;
