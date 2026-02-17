import { selectVAPResidentialAddress } from 'platform/user/selectors';

import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  selectFeatureCommunityCare,
  selectFeatureDirectScheduling,
  selectFeatureRemovePodiatry,
  selectHasVAPResidentialAddress,
  selectRegisteredCernerFacilityIds,
} from '../../redux/selectors';
import { getSiteIdFromFacilityId } from '../../services/location';
import {
  AUDIOLOGY_TYPES_OF_CARE,
  DATE_FORMATS,
  FACILITY_SORT_METHODS,
  FACILITY_TYPES,
  FETCH_STATUS,
  TYPE_OF_CARE_IDS,
  TYPES_OF_CARE,
  TYPES_OF_EYE_CARE,
  TYPES_OF_MENTAL_HEALTH,
  TYPES_OF_SLEEP_CARE,
} from '../../utils/constants';
import { removeDuplicateId } from '../../utils/data';
import {
  getTimezoneByFacilityId,
  getTimezoneDescByFacilityId,
} from '../../utils/timezone';

export function getNewAppointment(state) {
  return state.newAppointment;
}

export function getFormData(state) {
  return getNewAppointment(state).data;
}

export function selectPageChangeInProgress(state) {
  return getNewAppointment(state).pageChangeInProgress;
}

export function getFlowType(state) {
  return getNewAppointment(state)?.flowType;
}

export function getFormPageInfo(state, pageKey) {
  return {
    schema: getNewAppointment(state).pages[pageKey],
    data: getFormData(state),
    pageChangeInProgress: getNewAppointment(state).pageChangeInProgress,
  };
}

export function getTypeOfCare(data) {
  if (data.typeOfCareId === TYPE_OF_CARE_IDS.SLEEP_MEDICINE_ID) {
    return TYPES_OF_SLEEP_CARE.find(care => care.id === data.typeOfSleepCareId);
  }

  if (data.typeOfCareId === TYPE_OF_CARE_IDS.EYE_CARE_ID) {
    return TYPES_OF_EYE_CARE.find(care => care.id === data.typeOfEyeCareId);
  }

  if (data.typeOfCareId === TYPE_OF_CARE_IDS.MENTAL_HEALTH_ID) {
    // When featureSubstanceUseDisorder and featurePCMHI are off, there will be no
    // typeOfMentalHealthId in the form data. In this case, we should use the existing
    // Mental health care with a specialist type of care (stop code 502). This can be
    // removed once the features are released.
    if (!data.typeOfMentalHealthId) {
      return TYPES_OF_MENTAL_HEALTH.find(
        care => care.id === TYPE_OF_CARE_IDS.MENTAL_HEALTH_SERVICES_ID,
      );
    }
    return TYPES_OF_MENTAL_HEALTH.find(
      care => care.id === data.typeOfMentalHealthId,
    );
  }

  if (
    data.typeOfCareId === TYPE_OF_CARE_IDS.AUDIOLOGY_ID &&
    data.facilityType === FACILITY_TYPES.COMMUNITY_CARE.id
  ) {
    return AUDIOLOGY_TYPES_OF_CARE.find(
      care => care.ccId === data.audiologyType,
    );
  }

  return TYPES_OF_CARE.find(care => care.id === data.typeOfCareId);
}

export function getCCEType(state) {
  const data = getFormData(state);

  let typeOfCare = TYPES_OF_CARE.find(care => care.id === data.typeOfCareId);
  if (typeOfCare.id === TYPE_OF_CARE_IDS.EYE_CARE_ID) {
    typeOfCare = TYPES_OF_EYE_CARE.find(
      care => care.id === data.typeOfEyeCareId,
    );
  }

  return typeOfCare?.cceType;
}

export function getTypeOfCareFacilities(state) {
  const data = getFormData(state);
  const { facilities } = getNewAppointment(state);
  const typeOfCareId = getTypeOfCare(data)?.id;

  return facilities[`${typeOfCareId}`];
}

export function getChosenFacilityInfo(state) {
  return (
    getTypeOfCareFacilities(state)?.find(
      facility => facility.id === getFormData(state).vaFacility,
    ) || null
  );
}

export function selectCommunityCareSupportedSites(state) {
  return getNewAppointment(state).ccEnabledSystems;
}

export function getChosenCCSystemById(state) {
  const { communityCareSystemId } = getFormData(state);

  if (!communityCareSystemId) {
    return null;
  }

  return selectCommunityCareSupportedSites(state).find(
    facility => facility.id === communityCareSystemId,
  );
}

function getSiteIdForChosenFacility(state) {
  return getSiteIdFromFacilityId(getFormData(state).vaFacility);
}

export function selectEligibility(state) {
  const data = getFormData(state);
  const newAppointment = getNewAppointment(state);
  const typeOfCareId = getTypeOfCare(data)?.id;

  return (
    newAppointment.eligibility[`${data.vaFacility}_${typeOfCareId}`] || null
  );
}

export function getChosenSlot(state) {
  const { availableSlots } = getNewAppointment(state);
  const selectedTime = getFormData(state).selectedDates?.[0];

  // Convert to UTC since slots are in UTC.
  return availableSlots?.find(
    slot =>
      slot.start ===
      formatInTimeZone(
        parseISO(selectedTime),
        'UTC',
        DATE_FORMATS.ISODateTimeUTC,
      ),
  );
}

export function getDateTimeSelect(state, pageKey) {
  const newAppointment = getNewAppointment(state);
  const {
    appointmentSlotsStatus,
    isAppointmentSelectionError,
  } = newAppointment;
  const data = getFormData(state);
  const formInfo = getFormPageInfo(state, pageKey);
  const { availableSlots } = newAppointment;
  const eligibilityStatus = selectEligibility(state);

  const timezoneDescription = getTimezoneDescByFacilityId(data.vaFacility);
  const timezone = getTimezoneByFacilityId(data.vaFacility);
  const typeOfCareId = getTypeOfCare(data)?.id;

  return {
    ...formInfo,
    availableSlots: availableSlots?.map(slot => {
      return {
        start: formatInTimeZone(
          new Date(slot.start),
          timezone,
          DATE_FORMATS.ISODateTimeLocal,
        ),
        end: formatInTimeZone(
          new Date(slot.end),
          timezone,
          DATE_FORMATS.ISODateTimeLocal,
        ),
      };
    }),
    eligibleForRequests: eligibilityStatus.request,
    facilityId: data.vaFacility,
    appointmentSlotsStatus,
    preferredDate: data.preferredDate,
    timezone,
    timezoneDescription,
    typeOfCareId,
    isAppointmentSelectionError,
  };
}

export function selectProviderSelectionInfo(state) {
  const {
    communityCareProviders,
    data,
    requestStatus,
    requestLocationStatus,
    currentLocation,
    ccProviderPageSortMethod: sortMethod,
    ccEnabledSystems,
    selectedCCFacility,
  } = getNewAppointment(state);

  const typeOfCare = getTypeOfCare(data);
  const ccProviderCacheKey =
    sortMethod === FACILITY_SORT_METHODS.distanceFromFacility
      ? `${sortMethod}_${selectedCCFacility.id}_${typeOfCare.ccId}`
      : `${sortMethod}_${typeOfCare.ccId}`;
  const updatedSortMethod =
    sortMethod === FACILITY_SORT_METHODS.distanceFromFacility
      ? selectedCCFacility.id
      : sortMethod;

  return {
    address: selectVAPResidentialAddress(state),
    ccEnabledSystems,
    communityCareProviderList: !communityCareProviders[ccProviderCacheKey]
      ? communityCareProviders[ccProviderCacheKey]
      : removeDuplicateId(communityCareProviders[ccProviderCacheKey]),
    currentLocation,
    requestLocationStatus,
    requestStatus,
    selectedCCFacility,
    sortMethod: updatedSortMethod,
    typeOfCareName: typeOfCare.name,
  };
}

function selectFacilityPageSortMethod(state) {
  return getNewAppointment(state).facilityPageSortMethod;
}

function selectNoValidVAFacilities(state) {
  const newAppointment = getNewAppointment(state);
  const formInfo = getFormPageInfo(state, 'vaFacilityV2');
  const { childFacilitiesStatus } = newAppointment;
  const validFacilities = formInfo.schema?.properties.vaFacility.enum;

  return (
    childFacilitiesStatus === FETCH_STATUS.succeeded && !validFacilities?.length
  );
}

function selectSingleValidVALocation(state) {
  const formInfo = getFormPageInfo(state, 'vaFacilityV2');
  const data = getFormData(state);
  const validFacilities = formInfo.schema?.properties.vaFacility.enum;

  return validFacilities?.length === 1 && !!data.vaFacility;
}
export function selectSingleSupportedVALocation(state) {
  return getNewAppointment(state)?.data?.isSingleVaFacility;
}

export function selectRecentLocationsStatus(state) {
  return getNewAppointment(state).fetchRecentLocationStatus;
}

export function getFacilityPageV2Info(state) {
  const formInfo = getFormPageInfo(state, 'vaFacilityV2');
  const data = getFormData(state);
  const newAppointment = getNewAppointment(state);
  const typeOfCare = getTypeOfCare(data);

  const {
    childFacilitiesStatus,
    requestLocationStatus,
    showEligibilityModal,
  } = newAppointment;

  const address = selectVAPResidentialAddress(state);
  const facilities = newAppointment.facilities[(typeOfCare?.id)];
  const eligibility = selectEligibility(state);

  return {
    ...formInfo,
    address,
    canScheduleAtChosenFacility: eligibility?.direct || eligibility?.request,
    childFacilitiesStatus,
    eligibility,
    facilities,
    hasDataFetchingError:
      childFacilitiesStatus === FETCH_STATUS.failed ||
      newAppointment.eligibilityStatus === FETCH_STATUS.failed,
    loadingEligibilityStatus: newAppointment.eligibilityStatus,
    noValidVAFacilities: selectNoValidVAFacilities(state),
    requestLocationStatus,
    selectedFacility: getChosenFacilityInfo(state),
    singleValidVALocation: selectSingleValidVALocation(state),
    showEligibilityModal,
    sortMethod: selectFacilityPageSortMethod(state),
    typeOfCare,
    cernerSiteIds: selectRegisteredCernerFacilityIds(state),
    fetchRecentLocationStatus: selectRecentLocationsStatus(state),
  };
}

export function getChosenClinicInfo(state) {
  const data = getFormData(state);
  const { clinics } = getNewAppointment(state);
  const typeOfCareId = getTypeOfCare(data)?.id;
  return (
    clinics?.[`${data.vaFacility}_${typeOfCareId}`]?.find(
      clinic => clinic.id === data.clinicId,
    ) || null
  );
}

export function getClinicsForChosenFacility(state) {
  const data = getFormData(state);
  const { clinics } = getNewAppointment(state);
  const typeOfCareId = getTypeOfCare(data)?.id;

  return clinics[`${data.vaFacility}_${typeOfCareId}`] || null;
}

export function selectPastAppointments(state) {
  return getNewAppointment(state).pastAppointments;
}

export function selectTypeOfCare(state) {
  return getTypeOfCare(getFormData(state));
}

export function selectIsNewAppointmentStarted(state) {
  return getNewAppointment(state)?.isNewAppointmentStarted;
}

export function selectChosenFacilityInfo(state) {
  const formData = getFormData(state);
  const typeOfCare = getTypeOfCare(formData);
  const newAppointment = getNewAppointment(state);

  return newAppointment.facilities[typeOfCare.id].find(
    facility => facility.id === formData.vaFacility,
  );
}

export function selectPatientProviderRelationships(state) {
  const newAppointment = getNewAppointment(state);
  return {
    patientProviderRelationships: newAppointment.patientProviderRelationships,
    patientProviderRelationshipsStatus:
      newAppointment.patientProviderRelationshipsStatus,
    backendServiceFailures: newAppointment.backendServiceFailures,
  };
}

export function selectSelectedProvider(state) {
  const providerRelationships = selectPatientProviderRelationships(state);
  const data = getFormData(state);
  return providerRelationships?.patientProviderRelationships?.find(
    provider => provider.providerId === data.selectedProvider,
  );
}

function getChosenVACityState(state) {
  const schema =
    state.newAppointment.pages.ccPreferences?.properties.communityCareSystemId;

  if (schema?.enum?.length > 1) {
    const index = schema.enum.indexOf(
      state.newAppointment.data.communityCareSystemId,
    );

    return schema.enumNames[index];
  }

  return null;
}

export function selectReviewPage(state) {
  return {
    clinic: getChosenClinicInfo(state),
    data: getFormData(state),
    facility: getChosenFacilityInfo(state),
    flowType: getFlowType(state),
    parentFacility: getChosenCCSystemById(state),
    submitStatus: state.newAppointment.submitStatus,
    submitStatusVaos400: state.newAppointment.submitStatusVaos400,
    submitStatusVaos409: state.newAppointment.submitStatusVaos409,
    systemId: getSiteIdForChosenFacility(state),
    hasResidentialAddress: selectHasVAPResidentialAddress(state),
    vaCityState: getChosenVACityState(state),
  };
}

export function selectTypeOfCarePage(state) {
  const newAppointment = getNewAppointment(state);
  const address = selectVAPResidentialAddress(state);

  return {
    ...address,
    hideUpdateAddressAlert: newAppointment.hideUpdateAddressAlert,
    initialData: getFormData(state),
    pageChangeInProgress: selectPageChangeInProgress(state),
    showCommunityCare: selectFeatureCommunityCare(state),
    showDirectScheduling: selectFeatureDirectScheduling(state),
    removePodiatry: selectFeatureRemovePodiatry(state),
    showPodiatryApptUnavailableModal:
      newAppointment.showPodiatryAppointmentUnavailableModal,
  };
}

export function selectFacilitiesRadioWidget(state) {
  const newAppointment = getNewAppointment(state);
  const {
    eligibilityStatus,
    facilityPageSortMethod,
    requestLocationStatus,
  } = newAppointment;
  const cernerSiteIds = selectRegisteredCernerFacilityIds(state);
  const sortMethod = facilityPageSortMethod;

  return {
    cernerSiteIds,
    loadingEligibility: eligibilityStatus === FETCH_STATUS.loading,
    requestLocationStatus,
    sortMethod,
  };
}

export function selectAppointmentSlotsStatus(state) {
  return getNewAppointment(state).appointmentSlotsStatus;
}

export function selectAppointmentEhr(state) {
  const newAppointment = getNewAppointment(state);
  return newAppointment?.ehr;
}
