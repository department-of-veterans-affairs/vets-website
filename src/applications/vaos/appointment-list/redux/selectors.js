import moment from 'moment';
import { createSelector } from 'reselect';
import { selectCernerAppointmentsFacilities } from 'platform/user/selectors';
import { titleCase } from '../../utils/formatters';
import {
  FETCH_STATUS,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
} from '../../utils/constants';
import {
  getVideoAppointmentLocation,
  getVAAppointmentLocationId,
  isVideoAppointment,
  isUpcomingAppointmentOrRequest,
  isValidPastAppointment,
  sortByDateDescending,
  sortByDateAscending,
  sortUpcoming,
  getVARFacilityId,
  groupAppointmentsByMonth,
  isCanceledConfirmedOrExpressCare,
  isUpcomingAppointmentOrExpressCare,
  sortByCreatedDateDescending,
  isValidPastAppointmentOrExpressCare,
} from '../../services/appointment';
import { selectFeatureExpressCareNewRequest } from '../../redux/selectors';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneBySystemId,
} from '../../utils/timezone';

export function getCancelInfo(state) {
  const {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
    cancelAppointmentStatusVaos400,
    facilityData,
  } = state.appointments;

  const isVideo = appointmentToCancel
    ? isVideoAppointment(appointmentToCancel)
    : false;

  let facility = null;
  if (appointmentToCancel?.status === APPOINTMENT_STATUS.booked && !isVideo) {
    // Confirmed in person VA appts
    const locationId = getVAAppointmentLocationId(appointmentToCancel);
    facility = facilityData[locationId];
  } else if (appointmentToCancel?.facility) {
    // Requests
    facility = facilityData[appointmentToCancel.facility.facilityCode];
  } else if (isVideo) {
    // Video visits
    const locationId = getVideoAppointmentLocation(appointmentToCancel);
    facility = facilityData[locationId];
  }
  let isCerner = null;
  if (appointmentToCancel) {
    const facilityId = getVARFacilityId(appointmentToCancel);
    isCerner = selectCernerAppointmentsFacilities(state)?.some(cernerSite =>
      facilityId?.startsWith(cernerSite.facilityId),
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

export const selectExpressCareRequests = createSelector(
  state => state.appointments.pending,
  pending =>
    pending?.filter(appt => appt.vaos.isExpressCare).sort(sortByDateDescending),
);

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
      .filter(appt => !appt.vaos.isExpressCare)
      .filter(isUpcomingAppointmentOrRequest)
      .sort(sortUpcoming);
  },
);

export const selectUpcomingAppointments = createSelector(
  // Selecting pending here to pull in EC requests
  state => state.appointments.pending,
  state => state.appointments.confirmed,
  (pending, confirmed) => {
    if (!confirmed || !pending) {
      return null;
    }

    const sortedAppointments = confirmed
      .concat(pending)
      .filter(isUpcomingAppointmentOrExpressCare)
      .sort(sortByDateAscending);

    return groupAppointmentsByMonth(sortedAppointments);
  },
);

export const selectPendingAppointments = createSelector(
  state => state.appointments.pending,
  pending =>
    pending
      ?.filter(a => !a.vaos.isExpressCare)
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
      .filter(isCanceledConfirmedOrExpressCare)
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
      .filter(isValidPastAppointmentOrExpressCare)
      .sort(sortByDateAscending);

    return groupAppointmentsByMonth(sortedAppointments);
  },
);

/*
 * Express Care related appointments state selectors
 */

export function selectExpressCareFacilities(state) {
  return state.appointments.expressCareFacilities;
}

/*
 * Selects any EC windows that we're in at the current (or provided) time
 */
export function selectActiveExpressCareWindows(state, nowMoment) {
  const now = nowMoment || moment();
  return selectExpressCareFacilities(state)
    ?.map(({ days, facilityId }) => {
      const siteId = facilityId.substring(0, 3);
      const { timezone } = getTimezoneBySystemId(siteId);
      const timezoneAbbreviation = getTimezoneAbbrBySystemId(siteId);
      const nowFacilityTime = now.clone().tz(timezone);
      const currentDayOfWeek = nowFacilityTime.format('dddd').toUpperCase();
      const activeDay = days.find(day => day.day === currentDayOfWeek);

      if (!activeDay) {
        return null;
      }

      const start = moment.tz(
        `${nowFacilityTime.format('YYYY-MM-DD')}T${activeDay.startTime}:00`,
        timezone,
      );
      const end = moment.tz(
        `${nowFacilityTime.format('YYYY-MM-DD')}T${activeDay.endTime}:00`,
        timezone,
      );

      if (!now.isBetween(start, end)) {
        return null;
      }

      return {
        facilityId,
        siteId,
        timezone,
        timezoneAbbreviation,
        start,
        end,
      };
    })
    .filter(win => !!win);
}

/*
 * Gets the formatted hours string of the current window, chosen based on the
 * provided time.
 *
 * Note: we're picking the first active window, there could be more than one
 */
export function selectLocalExpressCareWindowString(state, nowMoment) {
  const current = selectActiveExpressCareWindows(state, nowMoment);

  if (!current?.length) {
    return null;
  }

  return `${current[0].start.format('h:mm a')} to ${current[0].end.format(
    'h:mm a',
  )} ${current[0].timezoneAbbreviation}`;
}

/*
 * Gets the facility info for the current window, chosen based on the
 * provided time.
 *
 * Note: we're picking the first active window, there could be more than one
 */
export function selectActiveExpressCareFacility(state, nowMoment) {
  const current = selectActiveExpressCareWindows(state, nowMoment);

  if (!current?.length) {
    return null;
  }

  return {
    facilityId: current[0].facilityId,
    siteId: current[0].facilityId.substring(0, 3),
  };
}

function getFormattedTime(time) {
  return moment(`${moment().format('YYYY-MM-DD')}T${time}:00`).format('h:mm a');
}

function getWindowString(window, timezoneAbbreviation, isToday) {
  return `${isToday ? 'today' : titleCase(window.day)} from ${getFormattedTime(
    window.startTime,
  )} to ${getFormattedTime(window.endTime)} ${timezoneAbbreviation}`;
}

/*
 * Returns next schedulable window.  If today is schedulable and current time is before window,
 * return today's window.  Otherwise, return the next schedulable day's window
 */
export function selectNextAvailableExpressCareWindowString(state, nowMoment) {
  const supportedFacilities = selectExpressCareFacilities(state);
  if (!supportedFacilities?.length) {
    return null;
  }

  const facility = supportedFacilities[0];
  const siteId = facility.facilityId.substring(0, 3);
  const { timezone } = getTimezoneBySystemId(siteId);
  const timezoneAbbreviation = getTimezoneAbbrBySystemId(siteId);
  const nowFacilityTime = nowMoment.clone().tz(timezone);
  const dayOfWeek = nowFacilityTime.format('dddd').toUpperCase();
  const todayDayOfWeekIndex = Number(nowFacilityTime.format('d'));
  const todaysWindow = facility.days.find(d => d.day === dayOfWeek);

  // Sort schedulable days after today so we can easily find the next
  // day if needed
  const schedulableDaysAfterToday = [
    ...facility.days.filter(day => day.dayOfWeekIndex > todayDayOfWeekIndex),
    ...facility.days.filter(day => day.dayOfWeekIndex < todayDayOfWeekIndex),
  ];

  if (todaysWindow) {
    const start = moment.tz(
      `${nowFacilityTime.format('YYYY-MM-DD')}T${todaysWindow.startTime}:00`,
      timezone,
    );
    if (nowMoment.isBefore(start)) {
      // If today is schedulable and we are before the window, return today's window
      return getWindowString(todaysWindow, timezoneAbbreviation, true);
    } else {
      // In the rare case the today is the only schedulable day and they are past the window,
      // return today's window and specify "next week". Otherwise, return the next schedulable day
      if (!schedulableDaysAfterToday.length) {
        return `next ${getWindowString(
          todaysWindow,
          timezoneAbbreviation,
          false,
        )}`;
      }
      return getWindowString(
        schedulableDaysAfterToday[0],
        timezoneAbbreviation,
        false,
      );
    }
  } else {
    // If today isn't schedulable, return the next day that is
    return getWindowString(
      schedulableDaysAfterToday[0],
      timezoneAbbreviation,
      false,
    );
  }
}

export function selectExpressCareAvailability(state) {
  const activeWindows = selectActiveExpressCareWindows(state);
  return {
    activeWindows,
    localWindowString: selectLocalExpressCareWindowString(state),
    localNextAvailableString: selectNextAvailableExpressCareWindowString(
      state,
      moment(),
    ),
    allowRequests: !!activeWindows?.length,
    useNewFlow: selectFeatureExpressCareNewRequest(state),
    hasWindow: !!selectExpressCareFacilities(state)?.length,
    hasRequests: state.appointments.pending?.some(
      appt => appt.vaos.isExpressCare,
    ),
    windowsStatus: state.appointments.expressCareWindowsStatus,
  };
}

export function selectExpressCareRequestById(state, id) {
  const { appointmentDetails, pending, past, confirmed } = state.appointments;

  if (appointmentDetails[id]) {
    return appointmentDetails[id];
  }

  const allAppointments = []
    .concat(pending)
    .concat(past)
    .concat(confirmed)
    .filter(item => !!item);

  return allAppointments.find(p => p.id === id);
}

export function selectRequestById(state, id) {
  const { appointmentDetails, pending } = state.appointments;

  if (
    appointmentDetails[id] &&
    (appointmentDetails[id].vaos.appointmentType ===
      APPOINTMENT_TYPES.ccRequest ||
      appointmentDetails[id].vaos.appointmentType === APPOINTMENT_TYPES.request)
  ) {
    return appointmentDetails[id];
  }

  return pending?.find(p => p.id === id);
}

export function selectConfirmedAppointmentById(state, id) {
  const { appointmentDetails, past, confirmed } = state.appointments;

  if (
    appointmentDetails[id] &&
    (appointmentDetails[id].vaos.appointmentType ===
      APPOINTMENT_TYPES.vaAppointment ||
      appointmentDetails[id].vaos.appointmentType ===
        APPOINTMENT_TYPES.ccAppointment)
  ) {
    return appointmentDetails[id];
  }

  const allAppointments = []
    .concat(past)
    .concat(confirmed)
    .filter(item => !!item);

  return allAppointments.find(p => p.id === id);
}
