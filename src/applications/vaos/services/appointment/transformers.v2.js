import {
  TYPES_OF_CARE,
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  TYPE_OF_VISIT,
  TYPES_OF_EYE_CARE,
  TYPES_OF_SLEEP_CARE,
  AUDIOLOGY_TYPES_OF_CARE,
} from '../../utils/constants';

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

function getTypeOfCareById(id) {
  const allTypesOfCare = [
    ...TYPES_OF_EYE_CARE,
    ...TYPES_OF_SLEEP_CARE,
    ...AUDIOLOGY_TYPES_OF_CARE,
    ...TYPES_OF_CARE,
  ];

  return allTypesOfCare.find(
    care => care.idV2 === id || care.ccId === id || care.id === id,
  );
}

/**
 * Gets the type of visit that matches our array of visit constant
 *
 * @param {Object} id VAR appointment object
 * @returns {String} type of visit string
 */
function getTypeOfVisit(id) {
  return TYPE_OF_VISIT.find(type => type.id === id)?.name;
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
    requestedPeriod: appt.requestedPeriods,
    start: appt.start,
    // TODO: ask about created and other action dates like cancelled
    created: null,
    minutesDuration: appt.minutesDuration,
    // TODO: ask about service types for CC and VA requests
    type: {
      coding: [
        {
          code: appt.serviceType,
          display: getTypeOfCareById(appt.serviceType)?.name,
        },
      ],
    },
    reason: PURPOSE_TEXT.find(purpose => purpose.serviceName === appt.reason)
      ?.short,
    location: {
      // TODO: what happens when vaos service can't find sta6aid for the appointment
      vistaId: appt.locationId?.substr(0, 3),
      clinicId: appt.clinic,
      stationId: appt.locationId,
    },
    contact: {
      telecom: appt.contact?.telecom.map(contact => ({
        system: contact.type,
        value: contact.value,
      })),
    },
    preferredTimesForPhoneCall: appt.preferredTimesForPhoneCall,
    comment: appt.comment,
    // TODO missing full video data
    videoData: {
      isVideo,
    },
    communityCareProvider:
      appt.start && appt.kind === 'cc' ? { id: appt.practitioners[0] } : null,
    // preferredCommunityCareProviders:
    //   appt.practitioners?.map(id => ({ id })) || [],
    practitioners: appt.practitioners,
    vaos: {
      isVideo,
      appointmentType: getAppointmentType(appt),
      isCommunityCare: isCC,
      isExpressCare: false,
      requestVisitType: getTypeOfVisit(appt.kind),
      apiData: appt,
      // TODO missing data: isPastAppointment, isCOVIDVaccine, timeZone
      isPhoneAppointment: appt.kind === 'phone',
    },
  };
}

export function transformVAOSAppointments(appts) {
  return appts.map(appt => transformVAOSAppointment(appt));
}
