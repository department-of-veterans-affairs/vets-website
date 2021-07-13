import {
  selectVAPResidentialAddress,
  selectCernerAppointmentsFacilities,
} from 'platform/user/selectors';

import {
  getTimezoneBySystemId,
  getTimezoneDescBySystemId,
} from '../../utils/timezone';
import {
  FACILITY_TYPES,
  TYPES_OF_CARE,
  TYPES_OF_SLEEP_CARE,
  TYPES_OF_EYE_CARE,
  FETCH_STATUS,
  AUDIOLOGY_TYPES_OF_CARE,
} from '../../utils/constants';
import { getSiteIdFromFacilityId } from '../../services/location';
import {
  selectFeatureCommunityCare,
  selectFeatureDirectScheduling,
  selectFeatureVariantTesting,
  selectUseProviderSelection,
  selectRegisteredCernerFacilityIds,
} from '../../redux/selectors';

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
  const facilities = getNewAppointment(state).facilities;
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

export function getChosenCCSystemId(state) {
  const communityCareSystemId = getFormData(state).communityCareSystemId;

  if (!communityCareSystemId) {
    return null;
  }

  return getNewAppointment(state).ccEnabledSystems.find(
    facility => facility.id === communityCareSystemId,
  );
}

export function getSiteIdForChosenFacility(state) {
  return getSiteIdFromFacilityId(getFormData(state).vaFacility);
}

export function getChosenFacilityDetails(state) {
  return getChosenFacilityInfo(state);
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
  const availableSlots = getNewAppointment(state).availableSlots;
  const selectedTime = getFormData(state).selectedDates?.[0];

  return availableSlots?.find(slot => slot.start === selectedTime);
}

export function getDateTimeSelect(state, pageKey) {
  const newAppointment = getNewAppointment(state);
  const appointmentSlotsStatus = newAppointment.appointmentSlotsStatus;
  const data = getFormData(state);
  const formInfo = getFormPageInfo(state, pageKey);
  const availableSlots = newAppointment.availableSlots;
  const eligibilityStatus = selectEligibility(state);
  const systemId = getSiteIdForChosenFacility(state);

  const timezoneDescription = systemId
    ? getTimezoneDescBySystemId(systemId)
    : null;
  const { timezone = null } = systemId ? getTimezoneBySystemId(systemId) : {};
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

export function selectCernerOrgIds(state) {
  const cernerSites = selectCernerAppointmentsFacilities(state);
  return getNewAppointment(state)
    .parentFacilities?.filter(parent => {
      return cernerSites?.some(cernerSite =>
        parent.id.startsWith(cernerSite.facilityId),
      );
    })
    .map(facility => facility.id);
}

export function selectProviderSelectionInfo(state) {
  const {
    communityCareProviders,
    data,
    requestStatus,
    requestLocationStatus,
    currentLocation,
    ccProviderPageSortMethod: sortMethod,
  } = getNewAppointment(state);

  const typeOfCare = getTypeOfCare(data);

  return {
    address: selectVAPResidentialAddress(state),
    typeOfCareName: typeOfCare.name,
    communityCareProviderList:
      communityCareProviders[`${sortMethod}_${typeOfCare.ccId}`],
    requestStatus,
    requestLocationStatus,
    currentLocation,
    sortMethod,
  };
}

export function selectFacilityPageSortMethod(state) {
  return getNewAppointment(state).facilityPageSortMethod;
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
  const validFacilities = formInfo.schema?.properties.vaFacility.enum;
  const showVariant = selectFeatureVariantTesting(state);

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
    noValidVAFacilities:
      childFacilitiesStatus === FETCH_STATUS.succeeded &&
      !validFacilities?.length,
    requestLocationStatus,
    selectedFacility: getChosenFacilityInfo(state),
    singleValidVALocation: validFacilities?.length === 1 && !!data.vaFacility,
    showEligibilityModal,
    sortMethod: selectFacilityPageSortMethod(state),
    typeOfCare,
    cernerSiteIds: selectRegisteredCernerFacilityIds(state),
    showVariant,
  };
}

export function getChosenClinicInfo(state) {
  const data = getFormData(state);
  const clinics = getNewAppointment(state).clinics;
  const typeOfCareId = getTypeOfCare(data)?.id;
  return (
    clinics[`${data.vaFacility}_${typeOfCareId}`]?.find(
      clinic => clinic.id === data.clinicId,
    ) || null
  );
}

export function getClinicsForChosenFacility(state) {
  const data = getFormData(state);
  const clinics = getNewAppointment(state).clinics;
  const typeOfCareId = getTypeOfCare(data)?.id;

  return clinics[`${data.vaFacility}_${typeOfCareId}`] || null;
}

export function getClinicPageInfo(state, pageKey) {
  const formPageInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);
  const facilityDetails = newAppointment.facilityDetails;
  const eligibility = selectEligibility(state);

  return {
    ...formPageInfo,
    facilityDetails: facilityDetails?.[formPageInfo.data.vaFacility],
    typeOfCare: getTypeOfCare(formPageInfo.data),
    clinics: getClinicsForChosenFacility(state),
    facilityDetailsStatus: newAppointment.facilityDetailsStatus,
    eligibility,
    canMakeRequests: eligibility?.request,
  };
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
    useProviderSelection: selectUseProviderSelection(state),
  };
}

export function selectReviewPage(state) {
  return {
    clinic: getChosenClinicInfo(state),
    data: getFormData(state),
    facility: getChosenFacilityInfo(state),
    facilityDetails: getChosenFacilityDetails(state),
    flowType: getFlowType(state),
    submitStatus: state.newAppointment.submitStatus,
    submitStatusVaos400: state.newAppointment.submitStatusVaos400,
    systemId: getSiteIdForChosenFacility(state),
    useProviderSelection: selectUseProviderSelection(state),
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
    showPodiatryApptUnavailableModal:
      newAppointment.showPodiatryAppointmentUnavailableModal,
  };
}

export function selectFacilitiesRadioWidget(state) {
  const newAppointment = getNewAppointment(state);
  const { eligibilityStatus, facilityPageSortMethod } = newAppointment;
  const showVariant = selectFeatureVariantTesting(state);
  const cernerSiteIds = selectRegisteredCernerFacilityIds(state);
  const sortMethod = facilityPageSortMethod;

  return {
    cernerSiteIds,
    loadingEligibility: eligibilityStatus === FETCH_STATUS.loading,
    showVariant,
    sortMethod,
  };
}
