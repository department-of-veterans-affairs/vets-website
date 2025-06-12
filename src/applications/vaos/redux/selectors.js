// eslint-disable-next-line import/no-unresolved
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import {
  selectIsCernerOnlyPatient,
  selectPatientFacilities,
} from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import { selectVAPResidentialAddress } from '@department-of-veterans-affairs/platform-user/selectors';
import {
  selectCernerFacilityIds,
  selectEhrDataByVhaId,
} from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { createSelector } from 'reselect';
import {
  isPendingOrCancelledRequest,
  sortByCreatedDateDescending,
} from '../services/appointment';
import { getRealFacilityId } from '../utils/appointment';

export const selectRegisteredCernerFacilityIds = state => {
  const patientFacilities = selectPatientFacilities(state);
  const cernerFacilityIds = selectCernerFacilityIds(state);

  return (
    patientFacilities?.reduce((accumulator, current) => {
      if (
        cernerFacilityIds.includes(getRealFacilityId(current.facilityId)) ||
        current.isCerner
      )
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

export const selectFeatureBookingExclusion = state =>
  toggleValues(state).vaOnlineSchedulingBookingExclusion;

export const selectFeatureCCDirectScheduling = state =>
  toggleValues(state).vaOnlineSchedulingCCDirectScheduling;

export const selectFilterData = state => toggleValues(state).vaOnlineFilterData;

export const selectFeatureRecentLocationsFilter = state =>
  toggleValues(state).vaOnlineSchedulingRecentLocationsFilter;

export const selectFeatureOHDirectSchedule = state =>
  toggleValues(state).vaOnlineSchedulingOhDirectSchedule;

export const selectFeatureOHRequest = state =>
  toggleValues(state).vaOnlineSchedulingOhRequest;

export const selectFeatureRemovePodiatry = state =>
  toggleValues(state).vaOnlineSchedulingRemovePodiatry;

export const selectFeatureFeSourceOfTruth = state =>
  toggleValues(state).vaOnlineSchedulingFeSourceOfTruth;

export const selectFeatureFeSourceOfTruthVA = state =>
  toggleValues(state).vaOnlineSchedulingFeSourceOfTruthVA;

export const selectFeatureFeSourceOfTruthCC = state =>
  toggleValues(state).vaOnlineSchedulingFeSourceOfTruthCC;

export const selectFeatureFeSourceOfTruthModality = state =>
  toggleValues(state).vaOnlineSchedulingFeSourceOfTruthModality;

export const selectFeatureFeSourceOfTruthTelehealth = state =>
  toggleValues(state).vaOnlineSchedulingFeSourceOfTruthTelehealth;

export const selectFeatureTravelPayViewClaimDetails = state =>
  toggleValues(state).travelPayViewClaimDetails;

export const selectFeatureTravelPaySubmitMileageExpense = state =>
  toggleValues(state).travelPaySubmitMileageExpense;

export const selectPendingAppointments = createSelector(
  state => state.appointments.pending,
  pending =>
    pending
      ?.filter(isPendingOrCancelledRequest)
      .sort(sortByCreatedDateDescending) || null,
);

export function getRequestedAppointmentListInfo(state) {
  return {
    facilityData: state.appointments.facilityData,
    pendingStatus: state.appointments.pendingStatus,
    pendingAppointments: selectPendingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}
export const selectFeatureConvertSlotsToUTC = state =>
  toggleValues(state).vaOnlineSchedulingConvertSlotsToUTC;
