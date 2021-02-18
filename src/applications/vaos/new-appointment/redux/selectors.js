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
import { getSiteIdFromOrganization } from '../../services/organization';
import {
  getParentOfLocation,
  getSiteIdFromFacilityId,
} from '../../services/location';
import { isEligible } from './helpers/eligibility';
import {
  selectUseFlatFacilityPage,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';

export function getNewAppointment(state) {
  return state.newAppointment;
}

export function getFormData(state) {
  return getNewAppointment(state).data;
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

export function getParentFacilities(state) {
  return getNewAppointment(state).parentFacilities;
}

export function getTypeOfCareFacilities(state) {
  const data = getFormData(state);
  const facilities = getNewAppointment(state).facilities;
  const typeOfCareId = getTypeOfCare(data)?.id;

  return selectUseFlatFacilityPage(state)
    ? facilities[`${typeOfCareId}`]
    : facilities[`${typeOfCareId}_${data.vaParent}`];
}

export function getChosenFacilityInfo(state) {
  return (
    getTypeOfCareFacilities(state)?.find(
      facility => facility.id === getFormData(state).vaFacility,
    ) || null
  );
}

export function getChosenParentInfo(state, parentId) {
  const currentParentId = parentId || getFormData(state).vaParent;

  if (!currentParentId) {
    return null;
  }

  return getParentFacilities(state).find(
    parent => parent.id === currentParentId,
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

export function getParentOfChosenFacility(state) {
  const facility = getChosenFacilityInfo(state);
  const parentFacilities = getParentFacilities(state);

  if (!facility) {
    return null;
  }

  const parent = getParentOfLocation(parentFacilities, facility);

  return parent?.id;
}

export function getChosenFacilityDetails(state) {
  if (selectUseFlatFacilityPage(state)) {
    return getChosenFacilityInfo(state);
  }

  const data = getFormData(state);
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const facilityDetails = getNewAppointment(state).facilityDetails;

  return isCommunityCare
    ? facilityDetails[data.communityCareSystemId]
    : facilityDetails[data.vaFacility];
}

export function getEligibilityChecks(state) {
  const data = getFormData(state);
  const newAppointment = getNewAppointment(state);
  const typeOfCareId = getTypeOfCare(data)?.id;

  return (
    newAppointment.eligibility[`${data.vaFacility}_${typeOfCareId}`] || null
  );
}

export function getEligibilityStatus(state) {
  const eligibility = getEligibilityChecks(state);
  return isEligible(eligibility);
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
  const eligibilityStatus = getEligibilityStatus(state);
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
      const facilityId = getSiteIdFromOrganization(parent);
      return cernerSites?.some(cernerSite =>
        facilityId.startsWith(cernerSite.facilityId),
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

export function getFacilityPageV2Info(state) {
  const formInfo = getFormPageInfo(state, 'vaFacilityV2');
  const data = getFormData(state);
  const newAppointment = getNewAppointment(state);
  const typeOfCare = getTypeOfCare(data);

  const {
    childFacilitiesStatus,
    facilityPageSortMethod,
    parentFacilities,
    parentFacilitiesStatus,
    requestLocationStatus,
    showEligibilityModal,
  } = newAppointment;

  const facilities = newAppointment.facilities[(typeOfCare?.id)];
  const eligibilityStatus = getEligibilityStatus(state);
  const validFacilities = formInfo.schema?.properties.vaFacility.enum;

  return {
    ...formInfo,
    address: selectVAPResidentialAddress(state),
    canScheduleAtChosenFacility:
      eligibilityStatus.direct || eligibilityStatus.request,
    childFacilitiesStatus,
    eligibility: getEligibilityChecks(state),
    facilities,
    hasDataFetchingError:
      parentFacilitiesStatus === FETCH_STATUS.failed ||
      childFacilitiesStatus === FETCH_STATUS.failed ||
      newAppointment.eligibilityStatus === FETCH_STATUS.failed,
    loadingEligibilityStatus: newAppointment.eligibilityStatus,
    noValidVAParentFacilities:
      parentFacilitiesStatus === FETCH_STATUS.succeeded &&
      parentFacilities.length === 0,
    noValidVAFacilities:
      childFacilitiesStatus === FETCH_STATUS.succeeded &&
      !validFacilities?.length,
    parentFacilities,
    parentFacilitiesStatus,
    requestLocationStatus,
    selectedFacility: getChosenFacilityInfo(state),
    singleValidVALocation: validFacilities?.length === 1 && !!data.vaFacility,
    showEligibilityModal,
    sortMethod: facilityPageSortMethod,
    typeOfCare,
  };
}

export function getFacilityPageInfo(state) {
  const formInfo = getFormPageInfo(state, 'vaFacility');
  const data = getFormData(state);
  const newAppointment = getNewAppointment(state);
  const eligibilityStatus = getEligibilityStatus(state);

  return {
    ...formInfo,
    facility: getChosenFacilityInfo(state),
    loadingParentFacilities:
      newAppointment.parentFacilitiesStatus === FETCH_STATUS.loading ||
      !formInfo.schema,
    loadingFacilities: !!formInfo.schema?.properties.vaFacilityLoading,
    loadingEligibility:
      newAppointment.eligibilityStatus === FETCH_STATUS.loading,
    eligibility: getEligibilityChecks(state),
    canScheduleAtChosenFacility:
      eligibilityStatus.direct || eligibilityStatus.request,
    singleValidVALocation: hasSingleValidVALocation(state),
    noValidVAParentFacilities:
      !data.vaParent && formInfo.schema && !formInfo.schema.properties.vaParent,
    noValidVAFacilities:
      !!formInfo.schema && !!formInfo.schema.properties.vaFacilityMessage,
    facilityDetailsStatus: newAppointment.facilityDetailsStatus,
    hasDataFetchingError:
      newAppointment.parentFacilitiesStatus === FETCH_STATUS.failed ||
      newAppointment.childFacilitiesStatus === FETCH_STATUS.failed ||
      newAppointment.eligibilityStatus === FETCH_STATUS.failed,
    typeOfCare: getTypeOfCare(data)?.name,
    parentDetails: newAppointment?.facilityDetails[data.vaParent],
    facilityDetails: newAppointment?.facilityDetails[data.vaFacility],
    parentOfChosenFacility: getParentOfChosenFacility(state),
    cernerOrgIds: selectCernerOrgIds(state),
    isCernerOnly: selectIsCernerOnlyPatient(state),
    siteId: getSiteIdFromOrganization(getChosenParentInfo(state)),
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
  const eligibility = getEligibilityChecks(state);

  return {
    ...formPageInfo,
    facilityDetails: facilityDetails?.[formPageInfo.data.vaFacility],
    typeOfCare: getTypeOfCare(formPageInfo.data),
    clinics: getClinicsForChosenFacility(state),
    facilityDetailsStatus: newAppointment.facilityDetailsStatus,
    eligibility,
    canMakeRequests: isEligible(eligibility).request,
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
