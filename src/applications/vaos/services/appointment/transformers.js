import { isEmpty } from 'lodash';
import { getProviderName } from '../../utils/appointment';
import {
  APPOINTMENT_TYPES,
  PURPOSE_TEXT_V2,
  TYPE_OF_VISIT,
  VIDEO_TYPES,
} from '../../utils/constants';
import { getTimezoneByFacilityId } from '../../utils/timezone';
import { transformFacilityV2 } from '../location/transformers';

export function getAppointmentType(appt) {
  if (appt?.type === 'VA') {
    return APPOINTMENT_TYPES.vaAppointment;
  }
  if (appt?.type === 'REQUEST') {
    return APPOINTMENT_TYPES.request;
  }
  if (appt?.type === 'COMMUNITY_CARE_APPOINTMENT') {
    return APPOINTMENT_TYPES.ccAppointment;
  }
  if (appt?.type === 'COMMUNITY_CARE_REQUEST') {
    return APPOINTMENT_TYPES.ccRequest;
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

export function transformVAOSAppointment(appt, useFeSourceOfTruthTelehealth) {
  const appointmentType = getAppointmentType(appt);
  const isCerner = appt?.id?.startsWith('CERN');
  const isCC = appt.kind === 'cc';
  const isPast = appt.past;
  const isRequest = appt.pending;
  const isUpcoming = appt.future;
  const isCCRequest = appointmentType === APPOINTMENT_TYPES.ccRequest;
  const providers = appt.practitioners;
  const start = new Date(appt.start);
  const vvsKind = appt.telehealth?.vvsKind;
  let isVideo = appt.kind === 'telehealth' && !!appt.telehealth?.vvsKind;
  let isAtlas = !!appt.telehealth?.atlas;
  let isVideoAtHome =
    !isAtlas &&
    (vvsKind === VIDEO_TYPES.mobile || vvsKind === VIDEO_TYPES.adhoc);
  let isVideoAtVA =
    vvsKind === VIDEO_TYPES.clinic || vvsKind === VIDEO_TYPES.storeForward;
  const isCompAndPen = appt.modality === 'claimExamAppointment';
  const isPhone = appt.modality === 'vaPhone';
  const isCovid = appt.modality === 'vaInPersonVaccine';
  const isInPersonVisit =
    isCompAndPen || isCovid || appt.modality === 'vaInPerson';
  if (useFeSourceOfTruthTelehealth) {
    isVideo =
      appt.modality === 'vaVideoCareAtHome' ||
      appt.modality === 'vaVideoCareAtAnAtlasLocation' ||
      appt.modality === 'vaVideoCareAtAVaLocation';
    isVideoAtHome = appt.modality === 'vaVideoCareAtHome';
    isAtlas = appt.modality === 'vaVideoCareAtAnAtlasLocation';
    isVideoAtVA = appt.modality === 'vaVideoCareAtAVaLocation';
  }

  const isCancellable = appt.cancellable;
  const appointmentTZ = appt.location
    ? appt.location?.attributes?.timezone?.timeZoneId
    : getTimezoneByFacilityId(appt.locationId);

  let videoData = { isVideo };
  if (isVideo) {
    videoData = {
      isVideo,
      facilityId: appt.locationId,
      kind: appt.telehealth?.vvsKind,
      url: appt.telehealth?.url,
      displayLink: appt.telehealth?.displayLink,
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
      atlasLocation: isAtlas ? getAtlasLocation(appt) : null,
      atlasConfirmationCode: appt.telehealth?.atlas?.confirmationCode,
      extension: appt.extension,
    };
  }

  let requestFields = {};

  if (isRequest) {
    const { requestedPeriods, created } = appt;
    const reqPeriods = requestedPeriods?.map(d => {
      const endDate = d.end || d.start;

      return {
        start: new Date(d.start),
        end: new Date(endDate),
      };
    });

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
  const reasonForAppointment = appt.reasonForAppointment
    ? appt.reasonForAppointment
    : PURPOSE_TEXT_V2.filter(purpose => purpose.id !== 'other').find(
        purpose =>
          purpose.serviceName === reasonCodeV0?.[0]?.code ||
          purpose.commentShort === reasonCodeV0?.[0]?.code,
      )?.short;
  const patientComments = appt.reasonCode ? appt.patientComments : null;
  return {
    resourceType: 'Appointment',
    id: appt.id,
    type: appt.type,
    modality: appt.modality,
    status: appt.status,
    cancelationReason: appt.cancelationReason?.coding?.[0].code || null,
    showScheduleLink: appt.showScheduleLink,
    avsPath: isPast ? appt.avsPath : null,
    start: !isRequest ? start : null,
    startUtc: !isRequest ? appt.start : null,
    reasonForAppointment,
    patientComments,
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
      clinicName: appt.serviceName || null,
      clinicPhysicalLocation: appt.physicalLocation || null,
      clinicPhone: appt.extension?.clinic?.phoneNumber || null,
      clinicPhoneExtension:
        appt.extension?.clinic?.phoneNumberExtension || null,
    },
    videoData,
    communityCareProvider:
      appointmentType === APPOINTMENT_TYPES.ccAppointment
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
      isCCRequest && appt.preferredProviderName
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
      isAtlas,
      isPastAppointment: isPast,
      isCompAndPenAppointment: isCompAndPen,
      isCancellable,
      appointmentType,
      isCommunityCare: isCC,
      isExpressCare: false,
      isPhoneAppointment: isPhone,
      isCOVIDVaccine: isCovid,
      isInPersonVisit,
      isVideoAtHome,
      isVideoAtVA,
      isCerner,
      apiData: appt,
      timeZone: appointmentTZ,
      facilityData,
    },
    version: 2,
  };
}

export function transformVAOSAppointments(appts, useFeSourceOfTruthTelehealth) {
  return appts.map(appt =>
    transformVAOSAppointment(appt, useFeSourceOfTruthTelehealth),
  );
}
