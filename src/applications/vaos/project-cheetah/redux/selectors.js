import moment from 'moment';
import {
  selectProfile,
  selectVAPResidentialAddress,
} from 'platform/user/selectors';
import { FETCH_STATUS } from '../../utils/constants';
import {
  getTimezoneBySystemId,
  getTimezoneDescBySystemId,
} from '../../utils/timezone';
import { getSiteIdFromFakeFHIRId } from '../../services/location';

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
  return getSiteIdFromFakeFHIRId(
    selectProjectCheetahFormData(state).vaFacility,
  );
}

export function getChosenSlot(state) {
  const availableSlots = selectProjectCheetah(state).availableSlots;
  const selectedTime = selectProjectCheetahFormData(state).calendarData
    ?.selectedDates?.[0].datetime;

  return availableSlots?.find(slot => slot.start === selectedTime);
}

export function getChosenSlot2(state) {
  const availableSlots = selectProjectCheetah(state).availableSlots;
  const selectedTime = selectProjectCheetahFormData(state).calendarData
    ?.selectedDates?.[1].datetime;

  return availableSlots?.find(slot => slot.start === selectedTime);
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
    appointmentSlotsStatus,
    preferredDate: data.preferredDate,
    timezone,
    timezoneDescription,
  };
}

export function selectAllowProjectCheetahBookings(state) {
  return moment().diff(moment(selectProfile(state).dob), 'years') >= 15;
}

export function getChosenFacilityInfo(state) {
  return (
    selectProjectCheetahNewBooking(state).facilities?.find(
      facility =>
        facility.id === selectProjectCheetahFormData(state).vaFacility,
    ) || null
  );
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
    hasDataFetchingError:
      facilitiesStatus === FETCH_STATUS.failed ||
      clinicsStatus === FETCH_STATUS.failed,
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
    facilityDetails: facilities.find(
      facility => facility.id === formPageInfo.data.vaFacility,
    ),
  };
}
