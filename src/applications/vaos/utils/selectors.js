import { getAppointmentId } from './appointment';
import { isEligible } from './eligibility';
import {
  TYPES_OF_CARE,
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_SLEEP_CARE,
} from './constants';
import moment from './moment-tz';

export function selectConfirmedAppointment(state, id) {
  return (
    state.appointments?.confirmed?.find?.(
      appt => getAppointmentId(appt) === id,
    ) || null
  );
}

export function selectPendingAppointment(state, id) {
  return (
    state.appointments?.pending?.find?.(appt => appt.uniqueId === id) || null
  );
}

export function getNewAppointment(state) {
  return state.newAppointment;
}

export function getFormData(state) {
  return getNewAppointment(state).data;
}

export function getFlowType(state) {
  return getNewAppointment(state).flowType;
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
export function getTypeOfCare(data) {
  if (data.typeOfCareId === SLEEP_CARE) {
    return TYPES_OF_SLEEP_CARE.find(care => care.id === data.typeOfSleepCareId);
  }

  if (
    data.typeOfCareId === AUDIOLOGY &&
    data.facilityType === 'communityCare'
  ) {
    return AUDIOLOGY_TYPES_OF_CARE.find(care => care.id === data.audiologyType);
  }

  return TYPES_OF_CARE.find(care => care.id === data.typeOfCareId);
}

export function getChosenFacilityInfo(state) {
  const data = getFormData(state);
  const facilities = getNewAppointment(state).facilities;
  const typeOfCareId = getTypeOfCare(data)?.id;
  return (
    facilities[`${typeOfCareId}_${data.vaSystem}`]?.find(
      facility => facility.institution.institutionCode === data.vaFacility,
    ) || null
  );
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
  const loadingAppointmentSlots = newAppointment.loadingAppointmentSlots;
  const data = getFormData(state);
  const formInfo = getFormPageInfo(state, pageKey);
  const availableSlots = newAppointment.availableSlots;
  const eligibilityStatus = getEligibilityStatus(state);

  const availableDates = availableSlots?.reduce((acc, s) => {
    if (!acc.includes(s.date)) {
      acc.push(s.date);
    }
    return acc;
  }, []);
  const vaFacility = data.vaFacility;
  let timezone;

  const typeOfCareId = getTypeOfCare(data)?.id;
  const facilities =
    newAppointment.facilities[`${typeOfCareId}_${vaFacility}`] || null;

  if (facilities) {
    const institutionTimezone = facilities.filter(
      f => f.institution?.institutionCode === vaFacility,
    )[0]?.institutionTimezone;

    if (institutionTimezone) {
      const now = moment();
      timezone = now.tz(institutionTimezone).format('z');
    }
  }

  return {
    ...formInfo,
    timezone,
    availableSlots,
    availableDates,
    loadingAppointmentSlots,
    typeOfCareId,
    eligibleForRequests: eligibilityStatus.request,
    preferredDate: data.preferredDate,
  };
}

export function hasSingleValidVALocation(state) {
  const formInfo = getFormPageInfo(state, 'vaFacility');

  return (
    !formInfo.schema?.properties.vaSystem &&
    !formInfo.schema?.properties.vaFacility &&
    !!formInfo.data.vaSystem &&
    !!formInfo.data.vaFacility
  );
}

export function getFacilityPageInfo(state, pageKey) {
  const formInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);
  const eligibilityStatus = getEligibilityStatus(state);

  return {
    ...formInfo,
    facility: getChosenFacilityInfo(state),
    loadingSystems: newAppointment.loadingSystems || !formInfo.schema,
    loadingFacilities: !!formInfo.schema?.properties.vaFacilityLoading,
    loadingEligibility: newAppointment.loadingEligibility,
    eligibility: getEligibilityChecks(state),
    canScheduleAtChosenFacility:
      eligibilityStatus.direct || eligibilityStatus.request,
    singleValidVALocation: hasSingleValidVALocation(state),
    noValidVASystems:
      !formInfo.data.vaSystem &&
      formInfo.schema &&
      !formInfo.schema.properties.vaSystem,
    noValidVAFacilities:
      !!formInfo.schema && !!formInfo.schema.properties.vaFacilityMessage,
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

export function getReasonForAppointment(state, pageKey) {
  const formInfo = getFormPageInfo(state, pageKey);
  const reasonRemainingChar = getNewAppointment(state).reasonRemainingChar;
  return {
    ...formInfo,
    reasonRemainingChar,
  };
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

  return {
    ...formPageInfo,
    facilityDetails: facilityDetails?.[formPageInfo.data.vaFacility],
    typeOfCare: getTypeOfCare(formPageInfo.data),
    clinics: getClinicsForChosenFacility(state),
    loadingFacilityDetails: newAppointment.loadingFacilityDetails,
  };
}

export function getCancelInfo(state) {
  const {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
  } = state.appointments;

  return {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
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
