import { createSelector } from 'reselect';
import { selectCernerAppointmentsFacilities } from 'platform/user/selectors';
import {
  FETCH_STATUS,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
} from '../../utils/constants';
import {
  getVAAppointmentLocationId,
  isUpcomingAppointmentOrRequest,
  isValidPastAppointment,
  sortByDateDescending,
  sortByDateAscending,
  sortUpcoming,
  groupAppointmentsByMonth,
  isCanceledConfirmed,
  isUpcomingAppointment,
  sortByCreatedDateDescending,
  isPendingOrCancelledRequest,
} from '../../services/appointment';
import {
  selectFeatureRequests,
  selectIsCernerOnlyPatient,
  selectFeatureCancel,
  selectFeatureVAOSServiceVAAppointments,
  selectFeatureVAOSServiceCCAppointments,
} from '../../redux/selectors';
import { TYPE_OF_CARE_ID as VACCINE_TYPE_OF_CARE_ID } from '../../covid-19-vaccine/utils';

export function getCancelInfo(state) {
  const {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
    cancelAppointmentStatusVaos400,
    facilityData,
  } = state.appointments;

  let facility = null;
  if (appointmentToCancel?.status === APPOINTMENT_STATUS.booked) {
    // Confirmed in person VA and video appts
    const locationId = getVAAppointmentLocationId(appointmentToCancel);
    facility = facilityData[locationId];
  } else if (appointmentToCancel?.facility) {
    // Requests
    facility = facilityData[appointmentToCancel.facility.facilityCode];
  }
  let isCerner = null;
  if (appointmentToCancel) {
    isCerner = selectCernerAppointmentsFacilities(state)?.some(cernerSite =>
      appointmentToCancel.location.vistaId?.startsWith(cernerSite.facilityId),
    );
  }

  return {
    facility,
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
    cancelAppointmentStatusVaos400,
    isCerner,
  };
}

export function selectFutureStatus(state) {
  const { pendingStatus, confirmedStatus } = state.appointments;
  if (
    pendingStatus === FETCH_STATUS.failed ||
    confirmedStatus === FETCH_STATUS.failed
  ) {
    return FETCH_STATUS.failed;
  }

  if (
    pendingStatus === FETCH_STATUS.loading ||
    confirmedStatus === FETCH_STATUS.loading
  ) {
    return FETCH_STATUS.loading;
  }

  if (
    pendingStatus === FETCH_STATUS.succeeded &&
    confirmedStatus === FETCH_STATUS.succeeded
  ) {
    return FETCH_STATUS.succeeded;
  }

  return FETCH_STATUS.notStarted;
}

export const selectFutureAppointments = createSelector(
  state => state.appointments.pending,
  state => state.appointments.confirmed,
  (pending, confirmed) => {
    if (!confirmed || !pending) {
      return null;
    }

    return confirmed
      .concat(...pending)
      .filter(isUpcomingAppointmentOrRequest)
      .sort(sortUpcoming);
  },
);

export const selectUpcomingAppointments = createSelector(
  state => state.appointments.confirmed,
  confirmed => {
    if (!confirmed) {
      return null;
    }

    const sortedAppointments = confirmed
      .filter(isUpcomingAppointment)
      .sort(sortByDateAscending);

    return groupAppointmentsByMonth(sortedAppointments);
  },
);

export const selectPendingAppointments = createSelector(
  state => state.appointments.pending,
  pending =>
    pending
      ?.filter(isPendingOrCancelledRequest)
      .sort(sortByCreatedDateDescending) || null,
);

export const selectPastAppointments = createSelector(
  state => state.appointments.past,
  past => {
    return past?.filter(isValidPastAppointment).sort(sortByDateDescending);
  },
);

export const selectCanceledAppointments = createSelector(
  // Selecting pending here to pull in EC requests
  state => state.appointments.pending,
  state => state.appointments.confirmed,
  (pending, confirmed) => {
    if (!confirmed || !pending) {
      return null;
    }

    const sortedAppointments = confirmed
      .concat(pending)
      .filter(isCanceledConfirmed)
      .sort(sortByDateDescending);

    return groupAppointmentsByMonth(sortedAppointments);
  },
);

export function selectFirstRequestMessage(state, id) {
  const { requestMessages } = state.appointments;

  return requestMessages?.[id]?.[0]?.attributes?.messageText || null;
}

/*
 * V2 Past appointments state selectors
 */

export const selectPastAppointmentsV2 = createSelector(
  state => state.appointments.past,
  past => {
    if (!past) {
      return null;
    }

    const sortedAppointments = past
      .filter(isValidPastAppointment)
      .sort(sortByDateAscending);

    return groupAppointmentsByMonth(sortedAppointments);
  },
);

export function selectAppointmentById(state, id, types = null) {
  const { appointmentDetails, past, confirmed, pending } = state.appointments;

  if (
    appointmentDetails[id] &&
    (types === null ||
      types.includes(appointmentDetails[id].vaos.appointmentType))
  ) {
    return appointmentDetails[id];
  }

  const allAppointments = []
    .concat(pending)
    .concat(past)
    .concat(confirmed)
    .filter(item => !!item);

  return allAppointments.find(p => p.id === id);
}

export function selectFacilitySettingsStatus(state) {
  return state.appointments.facilitySettingsStatus;
}

export function selectCanUseVaccineFlow(state) {
  return state.appointments.facilitySettings?.some(
    facility =>
      facility.services.find(service => service.id === VACCINE_TYPE_OF_CARE_ID)
        ?.direct.enabled,
  );
}

export function selectRequestedAppointmentDetails(state, id) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
    state,
  );

  return {
    appointment: selectAppointmentById(state, id, [
      APPOINTMENT_TYPES.request,
      APPOINTMENT_TYPES.ccRequest,
    ]),
    appointmentDetailsStatus,
    facilityData,
    message: selectFirstRequestMessage(state, id),
    cancelInfo: getCancelInfo(state),
    useV2: featureVAOSServiceCCAppointments,
  };
}

export function getCanceledAppointmentListInfo(state) {
  return {
    appointmentsByMonth: selectCanceledAppointments(state),
    facilityData: state.appointments.facilityData,
    futureStatus: selectFutureStatus(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}

export function getRequestedAppointmentListInfo(state) {
  return {
    facilityData: state.appointments.facilityData,
    pendingStatus: state.appointments.pendingStatus,
    pendingAppointments: selectPendingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}

export function getUpcomingAppointmentListInfo(state) {
  return {
    facilityData: state.appointments.facilityData,
    futureStatus: state.appointments.confirmedStatus,
    appointmentsByMonth: selectUpcomingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}

export function getConfirmedAppointmentDetailsInfo(state, id) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
    state,
  );
  return {
    appointment: selectAppointmentById(state, id, [
      APPOINTMENT_TYPES.vaAppointment,
    ]),
    appointmentDetailsStatus,
    cancelInfo: getCancelInfo(state),
    facilityData,
    showCancelButton: selectFeatureCancel(state),
    useV2: featureVAOSServiceVAAppointments,
  };
}

export function getPastAppointmentListInfo(state) {
  return {
    showScheduleButton: selectFeatureRequests(state),
    pastAppointmentsByMonth: selectPastAppointmentsV2(state),
    pastStatus: state.appointments.pastStatus,
    pastSelectedIndex: state.appointments.pastSelectedIndex,
    facilityData: state.appointments.facilityData,
  };
}

export function selectCommunityCareDetailsInfo(state, id) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
    state,
  );

  return {
    appointment: selectAppointmentById(state, id, [
      APPOINTMENT_TYPES.ccAppointment,
    ]),
    appointmentDetailsStatus,
    facilityData,
    useV2: featureVAOSServiceCCAppointments,
  };
}
