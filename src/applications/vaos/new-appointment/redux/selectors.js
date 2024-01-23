import { selectVAPResidentialAddress } from 'platform/user/selectors';

import {
  getTimezoneByFacilityId,
  getTimezoneDescByFacilityId,
} from '../../utils/timezone';
import {
  FACILITY_TYPES,
  TYPES_OF_CARE,
  TYPES_OF_SLEEP_CARE,
  TYPES_OF_EYE_CARE,
  FETCH_STATUS,
  AUDIOLOGY_TYPES_OF_CARE,
  FACILITY_SORT_METHODS,
} from '../../utils/constants';
import { getSiteIdFromFacilityId } from '../../services/location';
import {
  selectHasVAPResidentialAddress,
  selectFeatureCommunityCare,
  selectFeatureDirectScheduling,
  selectRegisteredCernerFacilityIds,
  selectFeatureVAOSServiceVAAppointments,
} from '../../redux/selectors';
import { removeDuplicateId } from '../../utils/data';

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
  return getNewAppointment(state).flowType;
}

export function getAppointmentLength(state) {
  return getNewAppointment(state).appointmentLength;
}

export function getFormPageInfo(state, pageKey) {
  return {
    schema: getNewAppointment(state).pages[pageKey],
    data: getFormData(state),
    pageChangeInProgress: getNewAppointment(state).pageChangeInProgress,
  };
}

const AUDIOLOGY = '203';
const SLEEP_CARE = 'SLEEP';
const EYE_CARE = 'EYE';
export function getTypeOfCare(data) {
  if (data.typeOfCareId === SLEEP_CARE) {
    return TYPES_OF_SLEEP_CARE.find(care => care.id === data.typeOfSleepCareId);
  }

  if (data.typeOfCareId === EYE_CARE) {
    return TYPES_OF_EYE_CARE.find(care => care.id === data.typeOfEyeCareId);
  }

  if (
    data.typeOfCareId === AUDIOLOGY &&
    data.facilityType === FACILITY_TYPES.COMMUNITY_CARE
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
  if (typeOfCare.id === 'EYE') {
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

export function getSiteIdForChosenFacility(state) {
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

export function getPreferredDate(state, pageKey) {
  const data = getFormData(state);
  const typeOfCare = getTypeOfCare(data)?.name;
  return { ...getFormPageInfo(state, pageKey), typeOfCare };
}

export function getChosenSlot(state) {
  const { availableSlots } = getNewAppointment(state);
  const selectedTime = getFormData(state).selectedDates?.[0];

  return availableSlots?.find(slot => slot.start === selectedTime);
}

export function getDateTimeSelect(state, pageKey) {
  const newAppointment = getNewAppointment(state);
  const { appointmentSlotsStatus } = newAppointment;
  const data = getFormData(state);
  const formInfo = getFormPageInfo(state, pageKey);
  const { availableSlots } = newAppointment;
  const eligibilityStatus = selectEligibility(state);

  const timezoneDescription = getTimezoneDescByFacilityId(data.vaFacility);
  const timezone = getTimezoneByFacilityId(data.vaFacility);
  const typeOfCareId = getTypeOfCare(data)?.id;

  return {
    ...formInfo,
    availableSlots,
    eligibleForRequests: eligibilityStatus.request,
    facilityId: data.vaFacility,
    appointmentSlotsStatus,
    preferredDate: data.preferredDate,
    timezone,
    timezoneDescription,
    typeOfCareId,
  };
}

export function hasSingleValidVALocation(state) {
  const formInfo = getFormPageInfo(state, 'vaFacility');

  return (
    !formInfo.schema?.properties.vaParent &&
    !formInfo.schema?.properties.vaFacility &&
    !!formInfo.data.vaParent &&
    !!formInfo.data.vaFacility
  );
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

export function selectFacilityPageSortMethod(state) {
  return getNewAppointment(state).facilityPageSortMethod;
}

export function selectNoValidVAFacilities(state) {
  const newAppointment = getNewAppointment(state);
  const formInfo = getFormPageInfo(state, 'vaFacilityV2');
  const { childFacilitiesStatus } = newAppointment;
  const validFacilities = formInfo.schema?.properties.vaFacility.enum;

  return (
    childFacilitiesStatus === FETCH_STATUS.succeeded && !validFacilities?.length
  );
}

export function selectSingleValidVALocation(state) {
  const formInfo = getFormPageInfo(state, 'vaFacilityV2');
  const data = getFormData(state);
  const validFacilities = formInfo.schema?.properties.vaFacility.enum;

  return validFacilities?.length === 1 && !!data.vaFacility;
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
  };
}

export function getChosenClinicInfo(state) {
  const data = getFormData(state);
  const { clinics } = getNewAppointment(state);
  const typeOfCareId = getTypeOfCare(data)?.id;
  return (
    clinics[`${data.vaFacility}_${typeOfCareId}`]?.find(
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

export function getChosenVACityState(state) {
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

export function selectConfirmationPage(state) {
  return {
    data: getFormData(state),
    clinic: getChosenClinicInfo(state),
    facilityDetails: getChosenFacilityInfo(state),
    slot: getChosenSlot(state),
    systemId: getSiteIdForChosenFacility(state),
    submitStatus: getNewAppointment(state).submitStatus,
    flowType: getFlowType(state),
    appointmentLength: getAppointmentLength(state),
    hasResidentialAddress: selectHasVAPResidentialAddress(state),
  };
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
  const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
    state,
  );

  return {
    ...address,
    hideUpdateAddressAlert: newAppointment.hideUpdateAddressAlert,
    initialData: getFormData(state),
    pageChangeInProgress: selectPageChangeInProgress(state),
    showCommunityCare: selectFeatureCommunityCare(state),
    showDirectScheduling: selectFeatureDirectScheduling(state),
    showPodiatryApptUnavailableModal:
      newAppointment.showPodiatryAppointmentUnavailableModal,
    useV2: featureVAOSServiceVAAppointments,
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
