import moment from 'moment';
import { getPatientInstruction, getProviderName } from './index';
import {
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  TYPE_OF_VISIT,
  COVID_VACCINE_ID,
  PURPOSE_TEXT_V2,
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
/**
 * Gets appointment info from comments field for Va appointment Requests.
 *
 * @param {String} comments VA appointment comments value
 * @param {String} key key of appointment info you want returned
 * @returns {Array} returns formatted data
 */
function getAppointmentInfoFromComments(comments, key) {
  const data = [];
  const appointmentInfo = comments?.split('|');
  if (key === 'phone') {
    const phone = appointmentInfo ? appointmentInfo[0]?.split(':')[1] : null;
    const transformedPhone = { system: 'phone', value: phone };
    data.push(transformedPhone);
  }
  if (key === 'email') {
    const email = appointmentInfo ? appointmentInfo[1]?.split(':')[1] : null;
    const transformedemail = { system: 'email', value: email };
    data.push(transformedemail);
  }
  if (key === 'preferredDate') {
    const preferredDates = appointmentInfo
      ? appointmentInfo[2]?.split(':')[1]?.split(',')
      : null;
    preferredDates?.map(date => {
      const preferredDatePeriod = date?.split(' ');
      if (preferredDatePeriod[1] === 'AM') {
        const transformedDate = {
          start: `${moment(preferredDatePeriod[0]).format(
            'YYYY-MM-DD',
          )}T00:00:00Z`,
          end: `${moment(preferredDatePeriod[0]).format(
            'YYYY-MM-DD',
          )}T11:59:00Z"`,
        };
        data.push(transformedDate);
      } else {
        const transformedDate = {
          start: `${moment(preferredDatePeriod[0]).format(
            'YYYY-MM-DD',
          )}T12:00:00Z`,
          end: `${moment(preferredDatePeriod[0]).format(
            'YYYY-MM-DD',
          )}T23:59:00Z`,
        };
        data.push(transformedDate);
      }
      return data;
    });
  }
  if (key === 'reasonCode') {
    const reasonCode = appointmentInfo
      ? appointmentInfo[3]?.split(':')[1]
      : null;
    const transformedReasonCode = { code: reasonCode };
    if (reasonCode) {
      data.push(transformedReasonCode);
    }
    return data;
  }
  if (key === 'comments') {
    const appointmentComments = appointmentInfo
      ? appointmentInfo[4]?.split(':')[1]
      : null;
    const transformedComments = { text: appointmentComments };
    if (appointmentComments) {
      data.push(transformedComments);
    }
    return data;
  }
  return data;
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
          firstName: provider.name?.given,
          lastName: provider.name?.family,
        },
        display: `${provider.name?.given} ${provider.name?.family}`,
      })),
      isAtlas,
      atlasLocation: isAtlas ? getAtlasLocation(appt) : null,
      atlasConfirmationCode: appt.telehealth?.atlas?.confirmationCode,
    };
  }

  let requestFields = {};
  const commentsReasonCode = getAppointmentInfoFromComments(
    appt.reasonCode?.text,
    'reasonCode',
  );
  const commentsPreferredDate = getAppointmentInfoFromComments(
    appt.reasonCode?.text,
    'preferredDate',
  );
  const appointmentComments = getAppointmentInfoFromComments(
    appt.reasonCode?.text,
    'comments',
  );
  if (isRequest) {
    const created = moment.parseZone(appt.created).format('YYYY-MM-DD');
    const requestedPeriods =
      commentsPreferredDate.length > 0
        ? commentsPreferredDate
        : appt.requestedPeriods;
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

    const hasReasonCode =
      commentsReasonCode.length > 0 || appt.reasonCode?.coding?.length > 0;
    const reasonCode =
      commentsReasonCode.length > 0
        ? commentsReasonCode[0]
        : appt.reasonCode?.coding?.[0];
    const reason = hasReasonCode
      ? PURPOSE_TEXT.find(
          purpose =>
            purpose.serviceName === reasonCode.code ||
            purpose.commentShort === reasonCode.code,
        )?.short
      : null;
    requestFields = {
      requestedPeriod: reqPeriods,
      created,
      reason,
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

  // TODO: verfy in RI
  let facilityData;
  if (appt.location && appt.location.attributes) {
    facilityData = transformFacilityV2(appt.location.attributes);
  }
  let comment = null;
  const coding =
    commentsReasonCode.length > 0
      ? commentsReasonCode
      : appt.reasonCode?.coding;
  const code = PURPOSE_TEXT_V2.filter(purpose => purpose.id !== 'other').find(
    purpose =>
      purpose.serviceName === coding?.[0]?.code ||
      purpose.commentShort === coding?.[0]?.code,
  )?.serviceName;
  const comments =
    appointmentComments.length > 0 ? appointmentComments[0] : appt.reasonCode;
  const text = appt.reasonCode ? comments.text : null;
  if (coding && code && text) {
    comment = `${code}: ${text}`;
  } else if (coding && code) {
    comment = code;
  } else {
    comment = text;
  }
  return {
    resourceType: 'Appointment',
    id: appt.id,
    status: appt.status,
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
    version: 2,
  };
}

export function transformVAOSAppointments(appts) {
  return appts.map(appt => transformVAOSAppointment(appt));
}

/**
 * Transforms a provider object from the providers endpoint into our
 * VAOS format
 *
 * @export
 * @param {provider} provider A provider from the providers endpoint
 * @returns {Provider} A Provider resource
 */
export function transformPreferredProviderV2(provider) {
  return {
    resourceType: 'Provider',
    id: provider.providerIdentifier,
    name: provider.name,
  };
}
