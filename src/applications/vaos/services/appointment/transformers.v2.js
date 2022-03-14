import moment from 'moment';
import { getPatientInstruction } from '.';
import {
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  TYPE_OF_VISIT,
  COVID_VACCINE_ID,
  APPOINTMENT_STATUS,
} from '../../utils/constants';
import { getTimezoneByFacilityId } from '../../utils/timezone';
import { transformFacilityV2 } from '../location/transformers.v2';
import { getTypeOfCareById } from '../../utils/appointment';

function getAppointmentType(appt) {
  if (appt.kind === 'cc' && appt.start) {
    return APPOINTMENT_TYPES.ccAppointment;
  }
  if (appt.kind === 'cc' && appt.requestedPeriods?.length) {
    return APPOINTMENT_TYPES.ccRequest;
  }
  if (appt.kind !== 'cc' && appt.requestedPeriods?.length) {
    return APPOINTMENT_TYPES.request;
  }

  return APPOINTMENT_TYPES.vaAppointment;
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
  const timezone = getTimezoneByFacilityId(appt.locationId);

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
  const { atlas } = appt.telehealth;
  return {
    id: atlas.siteCode,
    resourceType: 'Location',
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
  const appointmentType = getAppointmentType(appt);
  const isCC = appt.kind === 'cc';
  const isVideo = appt.kind === 'telehealth';
  const isAtlas = !!appt.telehealth?.atlas;
  const isPast = isPastAppointment(appt);
  const isRequest =
    appointmentType === APPOINTMENT_TYPES.request ||
    appointmentType === APPOINTMENT_TYPES.ccRequest;
  const providers = appt.practitioners;
  const timezone = getTimezoneByFacilityId(appt.locationId);

  const start = timezone ? moment(appt.start).tz(timezone) : moment(appt.start);

  let videoData = { isVideo };
  if (isVideo) {
    videoData = {
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
    };
  }

  let requestFields = {};
  if (isRequest) {
    const created = moment.parseZone(appt.created).format('YYYY-MM-DD');
    const reqPeriods = appt.requestedPeriods.map(d => ({
      // by passing the format into the moment constructor, we are
      // preventing the local time zone conversion from occuring
      // which was causing incorrect dates to be displayed
      start: `${moment(d.start, 'YYYY-MM-DDTHH:mm:ss').format(
        'YYYY-MM-DDTHH:mm:ss',
      )}.000`,
      end: `${moment(d.end, 'YYYY-MM-DDTHH:mm:ss').format(
        'YYYY-MM-DDTHH:mm:ss',
      )}.999`,
    }));
    requestFields = {
      requestedPeriod: reqPeriods,
      created,
      reason: PURPOSE_TEXT.find(
        purpose => purpose.serviceName === appt.reasonCode?.coding?.[0].code,
      )?.short,
      preferredTimesForPhoneCall: appt.preferredTimesForPhoneCall,
      requestVisitType: getTypeOfVisit(appt.kind),
      type: {
        coding: [
          {
            code: appt.serviceType || null,
            display: getTypeOfCareById(appt.serviceType)?.name,
          },
        ],
      },
      contact: {
        telecom: appt.contact?.telecom.map(contact => ({
          system: contact.type,
          value: contact.value,
        })),
      },
    };
  }

  let facilityData;
  if (appt.location && appt.location.attributes) {
    facilityData = transformFacilityV2(appt.location.attributes);
  }
  return {
    resourceType: 'Appointment',
    id: appt.id,
    /*
      When cancelling a CC appointment request in V2 the appointment status remains in 
      a state of proposed until the scheduler cancels it. Typically the status is immediately 
      set to cancelled as is the case with a standard VA request.  In order to maintain
      consistent behavior for both VA and CC requests on the RequestedAppointmentDetailsPage
      we are setting the CC appointment request status to cancelled using the logic below.

      Cancellable is a new field on the appointment object that *is* set immediately upon cancellation
      of the appointment.
    */
    status:
      isCC && appt.status === APPOINTMENT_STATUS.proposed && !appt.cancellable
        ? APPOINTMENT_STATUS.cancelled
        : appt.status,
    cancelationReason: appt.cancelationReason?.coding?.[0].code || null,
    start: !isRequest ? start.format() : null,
    // This contains the vista status for v0 appointments, but
    // we don't have that for v2, so this is a made up status
    description: appt.kind !== 'cc' ? 'VAOS_UNKNOWN' : null,
    minutesDuration: Number.isNaN(parseInt(appt.minutesDuration, 10))
      ? 60
      : appt.minutesDuration,
    location: {
      // TODO: what happens when vaos service can't find sta6aid for the appointment
      vistaId: appt.locationId?.substr(0, 3) || null,
      clinicId: appt.clinic,
      stationId: appt.locationId,
      clinicName: appt.serviceName || null,
    },
    comment:
      isVideo && !!appt.patientInstruction
        ? getPatientInstruction(appt)
        : appt.comment || null,
    videoData,
    communityCareProvider:
      isCC && !isRequest
        ? {
            practiceName: appt.extension?.ccLocation?.practiceName,
            address: appt.extension?.ccLocation?.address,
            telecom: null,
            firstName: null,
            lastName: null,
            providerName: null,
          }
        : null,
    practitioners: appt.practitioners,
    ...requestFields,
    vaos: {
      isVideo,
      isPastAppointment: isPast,
      appointmentType,
      isCommunityCare: isCC,
      isExpressCare: false,
      isPhoneAppointment: appt.kind === 'phone',
      isCOVIDVaccine: appt.serviceType === COVID_VACCINE_ID,
      apiData: appt,
      timeZone: null,
      facilityData,
    },
  };
}

export function transformVAOSAppointments(appts) {
  return appts.map(appt => transformVAOSAppointment(appt));
}
