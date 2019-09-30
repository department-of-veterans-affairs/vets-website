import { getAppointmentId } from './appointment';
import { TYPES_OF_CARE, AUDIOLOGY_TYPES_OF_CARE } from './constants';

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

export function getFormPageInfo(state, pageKey) {
  return {
    schema: getNewAppointment(state).pages[pageKey],
    data: getFormData(state),
    pageChangeInProgress: getNewAppointment(state).pageChangeInProgress,
  };
}

const AUDIOLOGY = '203';
export function getTypeOfCare(data) {
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

export function hasSingleValidVALocation(state) {
  const formInfo = getFormPageInfo(state, 'vaFacility');

  return (
    !formInfo.schema?.properties.vaSystem &&
    !formInfo.schema?.properties.vaFacility &&
    formInfo.data.vaSystem &&
    formInfo.data.vaFacility
  );
}

export function getFacilityPageInfo(state, pageKey) {
  const formInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);

  return {
    ...formInfo,
    facility: getChosenFacilityInfo(state),
    loadingSystems: newAppointment.loadingSystems || !formInfo.schema,
    loadingFacilities: !!formInfo.schema?.properties.vaFacilityLoading,
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
    clinics[`${typeOfCareId}_${data.vaFacility}`]?.find(
      clinic => clinic.clinicId === data.clinicId,
    ) || null
  );
}
