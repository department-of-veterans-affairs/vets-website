import moment from 'moment';
import { selectProfile } from 'platform/user/selectors';

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
  return moment().diff(moment(selectProfile(state).dob), 'years') >= 65;
}
