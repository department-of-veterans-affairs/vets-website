import moment from 'moment';
import {
  selectProfile,
  selectVAPResidentialAddress,
} from 'platform/user/selectors';
import { FETCH_STATUS } from '../../utils/constants';

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
  const newAppointment = selectProjectCheetahNewBooking(state);

  const {
    facilitiesStatus,
    facilityPageSortMethod,
    requestLocationStatus,
    showEligibilityModal,
    clinics,
    clinicsStatus,
  } = newAppointment;

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
