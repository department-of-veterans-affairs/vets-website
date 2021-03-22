import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { FETCH_STATUS } from '../../utils/constants';
import {
  getTimezoneBySystemId,
  getTimezoneDescBySystemId,
} from '../../utils/timezone';
import { getSiteIdFromFacilityId } from '../../services/location';
import { selectCanUseVaccineFlow } from '../../appointment-list/redux/selectors';

export function selectProjectCheetah(state) {
  return state.projectCheetah;
}

export function selectProjectCheetahNewBooking(state) {
  return selectProjectCheetah(state).newBooking;
}

export function selectProjectCheetahFormData(state) {
  return selectProjectCheetahNewBooking(state).data;
}

export function getProjectCheetahFormPageInfo(state, pageKey) {
  const newBooking = selectProjectCheetahNewBooking(state);
  return {
    schema: newBooking.pages[pageKey],
    data: newBooking.data,
    pageChangeInProgress: newBooking.pageChangeInProgress,
  };
}

export function getSiteIdForChosenFacility(state) {
  return getSiteIdFromFacilityId(
    selectProjectCheetahFormData(state).vaFacility,
  );
}

export function getChosenSlot(state) {
  const availableSlots = selectProjectCheetahNewBooking(state).availableSlots;
  const selectedTime = selectProjectCheetahFormData(state).date1[0];

  return availableSlots?.find(slot => slot.start === selectedTime);
}

export function getChosenFacilityInfo(state) {
  return (
    selectProjectCheetahNewBooking(state).facilities?.find(
      facility =>
        facility.id === selectProjectCheetahFormData(state).vaFacility,
    ) || null
  );
}

export function getDateTimeSelect(state, pageKey) {
  const newBooking = selectProjectCheetahNewBooking(state);
  const appointmentSlotsStatus = newBooking.appointmentSlotsStatus;
  const data = selectProjectCheetahFormData(state);
  const formInfo = getProjectCheetahFormPageInfo(state, pageKey);
  const availableSlots = newBooking.availableSlots;
  const systemId = getSiteIdForChosenFacility(state);

  const timezoneDescription = systemId
    ? getTimezoneDescBySystemId(systemId)
    : null;
  const { timezone = null } = systemId ? getTimezoneBySystemId(systemId) : {};

  return {
    ...formInfo,
    availableSlots,
    facilityId: data.vaFacility,
    selectedFacility: getChosenFacilityInfo(state),
    appointmentSlotsStatus,
    preferredDate: data.preferredDate,
    timezone,
    timezoneDescription,
  };
}

export function getFacilityPageInfo(state) {
  const formInfo = getProjectCheetahFormPageInfo(state, 'vaFacility');
  const data = selectProjectCheetahFormData(state);
  const newBooking = selectProjectCheetahNewBooking(state);

  const {
    facilitiesStatus,
    facilityPageSortMethod,
    requestLocationStatus,
    showEligibilityModal,
    clinics,
    clinicsStatus,
  } = newBooking;

  const validFacilities = formInfo.schema?.properties.vaFacility.enum;

  return {
    ...formInfo,
    address: selectVAPResidentialAddress(state),
    canScheduleAtChosenFacility: !!clinics[data.vaFacility]?.length,
    facilitiesStatus,
    clinicsStatus,
    noValidVAFacilities:
      facilitiesStatus === FETCH_STATUS.succeeded && !validFacilities?.length,
    requestLocationStatus,
    selectedFacility: getChosenFacilityInfo(state),
    singleValidVALocation: validFacilities?.length === 1 && !!data.vaFacility,
    showEligibilityModal,
    sortMethod: facilityPageSortMethod,
  };
}

export function getClinicPageInfo(state, pageKey) {
  const formPageInfo = getProjectCheetahFormPageInfo(state, pageKey);
  const newBooking = selectProjectCheetahNewBooking(state);
  const facilities = newBooking.facilities;

  return {
    ...formPageInfo,
    facilityDetails: facilities?.find(
      facility => facility.id === formPageInfo.data.vaFacility,
    ),
  };
}

export function getChosenClinicInfo(state) {
  const data = selectProjectCheetahFormData(state);
  const clinics = selectProjectCheetahNewBooking(state).clinics;

  return (
    clinics[data.vaFacility]?.find(clinic => clinic.id === data.clinicId) ||
    null
  );
}

export function getReviewPage(state) {
  return {
    data: selectProjectCheetahFormData(state),
    facility: getChosenFacilityInfo(state),
    facilityDetails: getChosenFacilityInfo(state),
    clinic: getChosenClinicInfo(state),
    submitStatus: selectProjectCheetah(state).submitStatus,
    submitStatusVaos400: selectProjectCheetah(state).submitStatusVaos400,
    systemId: getSiteIdForChosenFacility(state),
  };
}

export function selectConfirmationPage(state) {
  return {
    data: selectProjectCheetahFormData(state),
    facilityDetails: getChosenFacilityInfo(state),
    systemId: getSiteIdForChosenFacility(state),
    submitStatus: selectProjectCheetah(state).submitStatus,
  };
}

export function selectContactFacilitiesPageInfo(state) {
  const newBooking = selectProjectCheetahNewBooking(state);

  const { facilities, facilitiesStatus } = newBooking;

  return {
    facilities,
    facilitiesStatus,
    sortMethod: newBooking.facilityPageSortMethod,
    canUseVaccineFlow: selectCanUseVaccineFlow(state),
  };
}
