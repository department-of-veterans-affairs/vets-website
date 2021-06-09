import { TYPES_OF_CARE, APPOINTMENT_TYPES } from '../../utils/constants';

function getAppointmentType(appt) {
  if (appt.kind === 'cc' && appt.start) {
    return APPOINTMENT_TYPES.ccAppointment;
  } else if (appt.kind === 'cc' && appt.requestedPeriods?.length) {
    return APPOINTMENT_TYPES.ccRequest;
  } else if (appt.kind !== 'cc' && appt.requestedPeriods?.length) {
    return APPOINTMENT_TYPES.request;
  }

  return APPOINTMENT_TYPES.vaAppointment;
}

export function transformVAOSAppointment(appt) {
  const isCC = appt.kind === 'cc';
  const isVideo = appt.kind === 'telehealth';

  return {
    resourceType: 'Appointment',
    id: appt.id,
    status: appt.status,
    // TODO Unclear what these reasons are
    cancelationReason: appt.cancellationReason,
    requestedPeriods: appt.requestedPeriods,
    start: appt.start,
    minutesDuration: appt.minutesDuration,
    type: {
      coding: [
        {
          code: appt.serviceType,
          display: TYPES_OF_CARE.find(item => item.id === appt.serviceType)
            ?.name,
        },
      ],
    },
    reason: appt.reason,
    location: {
      vistaId: appt.locationId?.substr(0, 3),
      clinicId: appt.clinic,
      stationId: appt.locationId,
    },
    contact: appt.contact,
    preferredTimesForPhoneCall: appt.preferredTimesForPhoneCall,
    comment: appt.comment,
    // TODO missing full video data
    videoData: {
      isVideo,
    },
    communityCareProvider:
      appt.start && appt.kind === 'cc' ? { id: appt.practitioners[0] } : null,
    preferredCommunityCareProviders:
      appt.practitioners?.map(id => ({ id })) || [],
    vaos: {
      isVideo,
      appointmentType: getAppointmentType(appt),
      isCommunityCare: isCC,
      isExpressCare: false,
      apiData: appt,
      // TODO missing data: isPastAppointment, isCOVIDVaccine, isPhoneAppointment, timeZone
    },
  };
}
