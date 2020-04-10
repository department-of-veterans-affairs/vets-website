import moment from './moment-tz';
import environment from 'platform/utilities/environment';
import {
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
  CANCELLED_APPOINTMENT_SET,
} from './constants';

import {
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
  stripDST,
} from './timezone';

export function getRealFacilityId(facilityId) {
  if (!environment.isProduction() && facilityId) {
    return facilityId.replace('983', '442').replace('984', '552');
  }

  return facilityId;
}

export function getAppointmentType(appt) {
  if (appt.typeOfCareId?.startsWith('CC')) {
    return APPOINTMENT_TYPES.ccRequest;
  } else if (appt.optionDate1) {
    return APPOINTMENT_TYPES.request;
  } else if (appt.clinicId || appt.vvsAppointments) {
    return APPOINTMENT_TYPES.vaAppointment;
  } else if (appt.appointmentTime) {
    return APPOINTMENT_TYPES.ccAppointment;
  }

  return null;
}

function isCommunityCare(appt) {
  const apptType = getAppointmentType(appt);
  return (
    apptType === APPOINTMENT_TYPES.ccRequest ||
    apptType === APPOINTMENT_TYPES.ccAppointment
  );
}

function isGFEVideoVisit(appt) {
  return appt.vvsAppointments?.[0]?.appointmentKind === 'MOBILE_GFE';
}

export function getVideoVisitLink(appt) {
  return appt.vvsAppointments?.[0]?.patients?.[0]?.virtualMeetingRoom?.url;
}

export function getMomentRequestOptionDate(optionDate) {
  return moment(optionDate, 'MM/DD/YYYY');
}

export function getAppointmentTimezoneAbbreviation(timezone, facilityId) {
  if (facilityId) {
    return getTimezoneAbbrBySystemId(facilityId);
  }

  const tzAbbr = timezone?.split(' ')?.[1] || timezone;
  return stripDST(tzAbbr);
}

export function getAppointmentTimezoneDescription(timezone, facilityId) {
  const abbr = getAppointmentTimezoneAbbreviation(timezone, facilityId);

  return getTimezoneDescFromAbbr(abbr);
}

function getRequestDateOptions(appt) {
  const options = [
    {
      date: getMomentRequestOptionDate(appt.optionDate1),
      optionTime: appt.optionTime1,
    },
    {
      date: getMomentRequestOptionDate(appt.optionDate2),
      optionTime: appt.optionTime2,
    },
    {
      date: getMomentRequestOptionDate(appt.optionDate3),
      optionTime: appt.optionTime3,
    },
  ]
    .filter(o => o.date.isValid())
    .sort((a, b) => {
      if (a.date.isSame(b.date)) {
        return a.optionTime === 'AM' ? -1 : 1;
      }

      return a.date.isBefore(b.date) ? -1 : 1;
    });

  return options;
}

function getPurposeOfVisit(appt) {
  switch (getAppointmentType(appt)) {
    case APPOINTMENT_TYPES.ccRequest:
      return PURPOSE_TEXT.find(purpose => purpose.id === appt.purposeOfVisit)
        ?.short;
    case APPOINTMENT_TYPES.request:
      return PURPOSE_TEXT.find(
        purpose => purpose.serviceName === appt.purposeOfVisit,
      )?.short;
    default:
      return appt.purposeOfVisit;
  }
}

function getVideoType(appt) {
  if (isGFEVideoVisit(appt)) {
    return VIDEO_TYPES.gfe;
  } else if (
    appt.vvsAppointments?.length ||
    appt.visitType === 'Video Conference'
  ) {
    return VIDEO_TYPES.videoConnect;
  }

  return null;
}

function getAppointmentStatus(appointment) {
  switch (getAppointmentType(appointment)) {
    case APPOINTMENT_TYPES.ccAppointment:
      return APPOINTMENT_STATUS.booked;
    case APPOINTMENT_TYPES.ccRequest:
    case APPOINTMENT_TYPES.request: {
      return appointment.status === 'Cancelled'
        ? APPOINTMENT_STATUS.cancelled
        : APPOINTMENT_STATUS.pending;
    }
    case APPOINTMENT_TYPES.vaAppointment: {
      const cancelled = CANCELLED_APPOINTMENT_SET.has(
        appointment.vdsAppointments?.[0]?.currentStatus,
      );

      return cancelled
        ? APPOINTMENT_STATUS.cancelled
        : APPOINTMENT_STATUS.booked;
    }
    default:
      return APPOINTMENT_STATUS.booked;
  }
}

export function getAppointmentTypes(appointment) {
  return {
    appointmentType: getAppointmentType(appointment),
    videoType: getVideoType(appointment),
    isCommunityCare: isCommunityCare(appointment),
  };
}

export function transformRequest(appointment) {
  const appointmentTypes = getAppointmentTypes(appointment);

  const requestData = {
    ...appointmentTypes,
    apiData: appointment,
    id: appointment.id,
    isPastAppointment: false,
    duration: 60,
    dateOptions: getRequestDateOptions(appointment),
    status: getAppointmentStatus(appointment),
    typeOfCare: appointment.appointmentType,
    purposeOfVisit: getPurposeOfVisit(appointment),
    facility: appointment.facility,
    facilityName:
      appointment.friendlyLocationName || appointment.facility?.name,
    email: appointment.email,
    phoneNumber: appointment.phoneNumber,
    bestTimetoCall: appointment.bestTimetoCall,
  };

  if (appointmentTypes.appointmentType === APPOINTMENT_TYPES.ccRequest) {
    return {
      ...requestData,
      preferredProviders: appointment.ccAppointmentRequest.preferredProviders,
    };
  }

  return requestData;
}
