import moment from 'moment';
import {
  TYPES_OF_CARE,
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  TYPE_OF_VISIT,
  TYPES_OF_EYE_CARE,
  TYPES_OF_SLEEP_CARE,
  AUDIOLOGY_TYPES_OF_CARE,
  COVID_VACCINE_ID,
} from '../../utils/constants';
import { getTimezoneBySystemId } from '../../utils/timezone';

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
 * @param {Object} id VAOS Service appointment object
 * @returns {String} type of visit string
 */
function getTypeOfVisit(id) {
  return TYPE_OF_VISIT.find(type => type.id === id)?.name;
}

/**
 * Finds the datetime of the appointment depending on vista site location
 * and returns it as a moment object
 *
 * @param {Object} appt VAOS Service appointment object
 * @returns {Object} Returns appointment datetime as moment object
 */
function getMomentConfirmedDate(appt) {
  const timezone = getTimezoneBySystemId(appt.locationId?.substr(0, 3))
    ?.timezone;

  return timezone ? moment(appt.start).tz(timezone) : moment(appt.start);
}

/**
 *  Determines whether current time is less than appointment time
 *  +60 min or +240 min in the case of video
 * @param {*} appt VAOS Service appointment object
 */
export function isPastAppointment(appt) {
  const isVideo = appt.kind === 'telehealth';
  const threshold = isVideo ? 240 : 60;
  const apptDateTime = moment(getMomentConfirmedDate(appt));
  return apptDateTime.add(threshold, 'minutes').isBefore(moment());
}

/**
 * Gets the atlas location and sitecode
 *
 * @param {Object} appt VAOS Service appointment object
 * @returns {String} returns format data
 */
function getAtlasLocation(appt) {
  const atlas = appt.telehealth.atlas;
  return {
    id: atlas.siteCode,
    address: {
      line: [atlas.address.streetAddress],
      city: atlas.address.city,
      state: atlas.address.state,
      postalCode: atlas.address.zipCode,
    },
    position: {
      longitude: atlas.address.longitude,
      latitude: atlas.address.latitude,
    },
  };
}

export function transformVAOSAppointment(appt) {
  const isCC = appt.kind === 'cc';
  const isVideo = appt.kind === 'telehealth';
  const isAtlas = !!appt.telehealth?.atlas;
  const isPast = isPastAppointment(appt);
  const providers = appt.practitioners;
  const vistaId = appt.locationId?.substr(0, 3);
  const timezone = getTimezoneBySystemId(vistaId)?.timezone;

  const start = timezone ? moment(appt.start).tz(timezone) : moment(appt.start);

  return {
    resourceType: 'Appointment',
    id: appt.id,
    status: appt.status,
    // TODO Unclear what these reasons are
    cancelationReason: appt.cancellationReason,
    requestedPeriod: appt.requestedPeriods,
    start,
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
    videoData: {
      isVideo,
      facilityId: appt.locationId,
      kind: appt.telehealth?.vvsKind,
      url: appt.telehealth?.url,
      duration: appt.minutesDuration,
      providers: (providers || []).map(provider => ({
        name: {
          firstName: provider.firstName,
          lastName: provider.lastName,
        },
        display: `${provider.firstName} ${provider.lastName}`,
      })),
      isAtlas,
      atlasLocation: isAtlas ? getAtlasLocation(appt) : null,
      atlasConfirmationCode: appt.telehealth?.atlas?.confirmationCode,
    },
    communityCareProvider:
      appt.start && appt.kind === 'cc' ? { id: appt.practitioners[0] } : null,
    // preferredCommunityCareProviders:
    //   appt.practitioners?.map(id => ({ id })) || [],
    practitioners: appt.practitioners,
    vaos: {
      isVideo,
      isPastAppointment: isPast,
      appointmentType: getAppointmentType(appt),
      isCommunityCare: isCC,
      isExpressCare: false,
      requestVisitType: getTypeOfVisit(appt.kind),
      isPhoneAppointment: appt.kind === 'phone',
      isCOVIDVaccine: appt.serviceType === COVID_VACCINE_ID,
      apiData: appt,
    },
  };
}

export function transformVAOSAppointments(appts) {
  return appts.map(appt => transformVAOSAppointment(appt));
}
