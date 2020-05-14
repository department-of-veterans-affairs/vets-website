import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { selectPatientFacilities } from 'platform/user/selectors';

import { getRealFacilityId } from './appointment';
import { isEligible } from './eligibility';
import { getTimezoneDescBySystemId } from './timezone';
import {
  FACILITY_TYPES,
  TYPES_OF_CARE,
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_SLEEP_CARE,
  TYPES_OF_EYE_CARE,
  FETCH_STATUS,
} from './constants';
import {
  getRootOrganization,
  getSiteIdFromOrganization,
  getIdOfRootOrganization,
} from '../services/organization';
import { getParentOfLocation } from '../services/location';

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

export const selectCernerFacilities = state =>
  selectPatientFacilities(state)
    ?.filter(f => f.isCerner)
    .map(f => f.facilityId) || [];

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

export function getChosenFacilityInfo(state) {
  const data = getFormData(state);
  const facilities = getNewAppointment(state).facilities;
  const typeOfCareId = getTypeOfCare(data)?.id;
  return (
    facilities[`${typeOfCareId}_${data.vaParent}`]?.find(
      facility => facility.id === data.vaFacility,
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

export function getRootOrganizationFromChosenParent(state, parentId) {
  return getRootOrganization(
    getParentFacilities(state),
    parentId || getFormData(state).vaParent,
  );
}

export function getRootIdForChosenFacility(state, parentId) {
  const parentFacilities = getParentFacilities(state);

  return getIdOfRootOrganization(
    parentFacilities,
    parentId || getFormData(state).vaParent,
  );
}

export function getSiteIdForChosenFacility(state, currentParentId) {
  const parentId = currentParentId || getFormData(state).vaParent;
  const parentFacilities = getParentFacilities(state);
  const parentOrg = getChosenParentInfo(state, parentId);

  const rootOrg = getRootOrganization(parentFacilities, parentId);

  if (rootOrg) {
    return getSiteIdFromOrganization(rootOrg);
  }

  // This is a hack to get around some site ids not showing up in the parent sites list
  return parentOrg?.partOf.reference.replace('Organization/var', '');
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

export function getDateTimeSelect(state, pageKey) {
  const newAppointment = getNewAppointment(state);
  const appointmentSlotsStatus = newAppointment.appointmentSlotsStatus;
  const data = getFormData(state);
  const formInfo = getFormPageInfo(state, pageKey);
  const availableSlots = newAppointment.availableSlots;
  const eligibilityStatus = getEligibilityStatus(state);
  const systemId = getSiteIdForChosenFacility(state);

  const availableDates = availableSlots?.reduce((acc, s) => {
    if (!acc.includes(s.date)) {
      acc.push(s.date);
    }
    return acc;
  }, []);

  const timezone = systemId ? getTimezoneDescBySystemId(systemId) : null;
  const typeOfCareId = getTypeOfCare(data)?.id;

  return {
    ...formInfo,
    availableDates,
    availableSlots,
    eligibleForRequests: eligibilityStatus.request,
    facilityId: data.vaFacility,
    appointmentSlotsStatus,
    preferredDate: data.preferredDate,
    timezone,
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
      newAppointment.childFacilitiesStatus === FETCH_STATUS.failed,
    hasEligibilityError:
      newAppointment.eligibilityStatus === FETCH_STATUS.failed,
    typeOfCare: getTypeOfCare(data)?.name,
    parentDetails: newAppointment?.facilityDetails[data.vaParent],
    facilityDetails: newAppointment?.facilityDetails[data.vaFacility],
    parentOfChosenFacility: getParentOfChosenFacility(state),
    cernerFacilities: selectCernerFacilities(state),
    siteId: getSiteIdFromOrganization(getChosenParentInfo(state)),
  };
}

export function getChosenClinicInfo(state) {
  const data = getFormData(state);
  const clinics = getNewAppointment(state).clinics;
  const typeOfCareId = getTypeOfCare(data)?.id;
  return (
    clinics[`${data.vaFacility}_${typeOfCareId}`]?.find(
      clinic => clinic.clinicId === data.clinicId,
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

export function getCancelInfo(state) {
  const cernerFacilities = selectCernerFacilities(state);
  const {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
    facilityData,
    systemClinicToFacilityMap,
  } = state.appointments;

  let facility = null;
  if (appointmentToCancel?.clinicId) {
    // Confirmed in person VA appts
    facility =
      systemClinicToFacilityMap[
        `${appointmentToCancel.facilityId}_${appointmentToCancel.clinicId}`
      ];
  } else if (appointmentToCancel?.facility) {
    // Requests
    facility =
      facilityData[
        getRealFacilityId(appointmentToCancel.facility.facilityCode)
      ];
  } else if (appointmentToCancel) {
    // Video visits
    facility = facilityData[getRealFacilityId(appointmentToCancel.facilityId)];
  }

  return {
    facility,
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
    cernerFacilities,
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

export const vaosApplication = state => toggleValues(state).vaOnlineScheduling;
export const vaosCancel = state => toggleValues(state).vaOnlineSchedulingCancel;
export const vaosRequests = state =>
  toggleValues(state).vaOnlineSchedulingRequests;
export const vaosCommunityCare = state =>
  toggleValues(state).vaOnlineSchedulingCommunityCare;
export const vaosDirectScheduling = state =>
  toggleValues(state).vaOnlineSchedulingDirect;
export const vaosPastAppts = state =>
  toggleValues(state).vaOnlineSchedulingPast;
export const selectFeatureToggleLoading = state => toggleValues(state).loading;

export const isWelcomeModalDismissed = state =>
  state.announcements.dismissed.some(
    announcement => announcement === 'welcome-to-new-vaos',
  );

export const selectSystemIds = state =>
  selectPatientFacilities(state)?.map(f => f.facilityId) || null;
