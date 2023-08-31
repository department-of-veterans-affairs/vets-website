// eslint-disable-next-line import/no-unresolved
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import {
  selectVAPResidentialAddress,
  selectPatientFacilities,
} from '@department-of-veterans-affairs/platform-user/selectors';
import {
  selectCernerFacilityIds,
  selectEhrDataByVhaId,
} from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';

export const selectRegisteredCernerFacilityIds = state => {
  const patientFacilities = selectPatientFacilities(state);
  const cernerFacilityIds = selectCernerFacilityIds(state);

  return (
    patientFacilities?.reduce((accumulator, current) => {
      if (cernerFacilityIds.includes(current.facilityId) || current.isCerner)
        return [...accumulator, current.facilityId];
      return accumulator;
    }, []) || []
  );
};

export const selectRegisteredCernerFacilities = state => {
  const patientFacilities = selectPatientFacilities(state);
  const allFacilities = selectEhrDataByVhaId(state);

  return (
    patientFacilities?.reduce((accumulator, current) => {
      const facility = allFacilities[current.facilityId];
      if (facility?.ehr === 'cerner' || current.isCerner)
        return [...accumulator, facility];
      return accumulator;
    }, []) || []
  );
};

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

export const selectFeatureStaticLandingPage = state =>
  toggleValues(state).vaOnlineSchedulingStaticLandingPage;

export const selectFeatureGA4EventsMigration = state =>
  toggleValues(state).vaOnlineSchedulingGA4EventsMigration;

export const selectFeatureAfterVisitSummary = state =>
  toggleValues(state).vaOnlineSchedulingAfterVisitSummary;
