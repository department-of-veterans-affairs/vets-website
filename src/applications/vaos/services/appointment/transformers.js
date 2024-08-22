import moment from 'moment';
import { isEmpty } from 'lodash';
import {
  APPOINTMENT_TYPES,
  TYPE_OF_VISIT,
  COVID_VACCINE_ID,
  PURPOSE_TEXT_V2,
} from '../../utils/constants';
import { getTimezoneByFacilityId } from '../../utils/timezone';
import { transformFacilityV2 } from '../location/transformers';
import {
  getPatientInstruction,
  getProviderName,
  getTypeOfCareById,
} from '../../utils/appointment';

/**
 * Gets appointment info from comments field for Va appointment Requests.
 *
 * @param {String} comments VA appointment comments value
 * @param {String} key key of appointment info you want returned
 * @returns {Array} returns formatted data
 */
export function getAppointmentInfoFromComments(comments, key) {
  const data = [];
  const appointmentInfo = comments?.split('|');

  if (key === 'modality') {
    const preferredModality = appointmentInfo
      ? appointmentInfo
          .filter(item => item.includes('preferred modality:'))[0]
          ?.split(':')[1]
          ?.trim()
      : null;

    if (appointmentInfo) {
      data.push(preferredModality);
    }
    return data;
  }
  return data;
}
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

  return timezone
    ? moment(appt.localStartTime).tz(timezone)
    : moment(appt.localStartTime);
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
 *  Determines whether current time is before appointment time
 * @param {*} appt VAOS Service appointment object
 * @param {*} isRequest is appointment a request
 */
export function isFutureAppointment(appt, isRequest) {
  const apptDateTime = moment(appt.start);
  return (
    !isRequest &&
    !isPastAppointment(appt) &&
    apptDateTime.isValid() &&
    apptDateTime.isAfter(moment().startOf('day'))
  );
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
  const isUpcoming = isFutureAppointment(appt, isRequest);
  const providers = appt.practitioners;
  const start = moment(appt.localStartTime, 'YYYY-MM-DDTHH:mm:ss');
  const serviceCategoryName = appt.serviceCategory?.[0]?.text;
  const isCompAndPen = serviceCategoryName === 'COMPENSATION & PENSION';
  const isCancellable = appt.cancellable;
  const appointmentTZ = appt.location?.attributes?.timezone?.timeZoneId;

  let videoData = { isVideo };
  if (isVideo) {
    videoData = {
      isVideo,
      facilityId: appt.locationId,
      kind: appt.telehealth?.vvsKind,
      url: appt.telehealth?.url,
      duration: appt.minutesDuration,
      providers: (providers || [])
        .map(provider => {
          if (!provider.name) return null;
          return {
            name: {
              firstName: provider.name?.given,
              lastName: provider.name?.family,
            },
            display: `${provider.name?.given} ${provider.name?.family}`,
          };
        })
        .filter(Boolean),
      isAtlas,
      atlasLocation: isAtlas ? getAtlasLocation(appt) : null,
      atlasConfirmationCode: appt.telehealth?.atlas?.confirmationCode,
      extension: appt.extension,
    };
  }

  let requestFields = {};

  if (isRequest) {
    const created = moment.parseZone(appt.created).format('YYYY-MM-DD');
    const { requestedPeriods } = appt;
    const reqPeriods = requestedPeriods?.map(d => ({
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

    // hasReasonCode is only applicable to v0 appointments
    const hasReasonCode = appt.reasonCode?.coding?.length > 0;

    const reasonCode = !isEmpty(appt.reasonForAppointment)
      ? appt.reasonForAppointment
      : appt.reasonCode?.coding?.[0];
    const reasonForAppointment = hasReasonCode
      ? PURPOSE_TEXT_V2.find(
          purpose =>
            purpose.serviceName === reasonCode.code ||
            purpose.commentShort === reasonCode.code,
        )?.short
      : appt.reasonForAppointment;
    requestFields = {
      requestedPeriod: reqPeriods,
      created,
      reasonForAppointment,
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
      contact: appt.contact,
      preferredDates: appt?.preferredDates || [],
      preferredModality: appt?.preferredModality,
    };
  }

  // TODO: verfy in RI
  let facilityData;
  if (appt.location && appt.location.attributes) {
    facilityData = transformFacilityV2(appt.location.attributes);
  }
  // get reason code from appt.reasonCode?.coding for v0 appointments
  const reasonCodeV0 = appt.reasonCode?.coding;
  let comment = null;
  const reasonForAppointment = appt.reasonForAppointment
    ? appt.reasonForAppointment
    : PURPOSE_TEXT_V2.filter(purpose => purpose.id !== 'other').find(
        purpose =>
          purpose.serviceName === reasonCodeV0?.[0]?.code ||
          purpose.commentShort === reasonCodeV0?.[0]?.code,
      )?.short;
  const patientComments = appt.reasonCode ? appt.patientComments : null;
  if (reasonForAppointment && patientComments) {
    comment = `${reasonForAppointment}: ${patientComments}`;
  } else if (reasonForAppointment) {
    comment = reasonForAppointment;
  } else {
    comment = patientComments;
  }
  return {
    resourceType: 'Appointment',
    id: appt.id,
    status: appt.status,
    cancelationReason: appt.cancelationReason?.coding?.[0].code || null,
    avsPath: isPast ? appt.avsPath : null,
    start: !isRequest ? start.format() : null,
    timezone: appointmentTZ,
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
      clinicName: appt.friendlyName || appt.serviceName || null,
      clinicPhysicalLocation: appt.physicalLocation || null,
      clinicPhone: appt.extension?.clinic?.phoneNumber || null,
      clinicPhoneExtension:
        appt.extension?.clinic?.phoneNumberExtension || null,
    },
    comment:
      isVideo && !!appt.patientInstruction
        ? getPatientInstruction(appt)
        : comment,
    videoData,
    communityCareProvider:
      isCC && !isRequest
        ? {
            practiceName: appt.extension?.ccLocation?.practiceName,
            treatmentSpecialty: appt.extension?.ccTreatingSpecialty,
            address: appt.extension?.ccLocation?.address,
            telecom: appt.extension?.ccLocation?.telecom,
            providers: (providers || []).map(provider => ({
              name: {
                firstName: provider.name?.given.join(' '),
                lastName: provider.name?.family,
              },
              providerName: provider.name
                ? `${provider.name.given.join(' ')} ${provider.name.family}`
                : null,
            })),
            providerName:
              providers !== undefined ? getProviderName(appt) : null,
          }
        : null,
    preferredProviderName:
      isCC && isRequest && appt.preferredProviderName
        ? { providerName: appt.preferredProviderName }
        : null,
    practitioners:
      appt.practitioners && typeof appt.practitioners !== 'undefined'
        ? appt.practitioners
        : [],
    ...requestFields,
    vaos: {
      isPendingAppointment: isRequest,
      isUpcomingAppointment: isUpcoming,
      isVideo,
      isPastAppointment: isPast,
      isCompAndPenAppointment: isCompAndPen,
      isCancellable,
      appointmentType,
      isCommunityCare: isCC,
      isExpressCare: false,
      isPhoneAppointment: appt.kind === 'phone',
      isCOVIDVaccine: appt.serviceType === COVID_VACCINE_ID,
      apiData: appt,
      timeZone: appointmentTZ,
      facilityData,
    },
    version: 2,
  };
}

export function transformVAOSAppointments(appts) {
  return appts.map(appt => transformVAOSAppointment(appt));
}
