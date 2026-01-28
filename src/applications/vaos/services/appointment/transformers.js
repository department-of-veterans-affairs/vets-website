import { getProviderName } from '../../utils/appointment';
import { APPOINTMENT_TYPES, TYPE_OF_VISIT } from '../../utils/constants';
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

export function getAppointmentTimezone(appt, featureUseBrowserTimezone) {
  let timezone = appt.location?.attributes?.timezone?.timeZoneId;
  if (timezone === 'GMT' || timezone === 'UTC') {
    timezone = null;
  }

  return (
    timezone ||
    getTimezoneByFacilityId(appt.locationId, featureUseBrowserTimezone)
  );
}

export function transformVAOSAppointment(
  appt,
  featureUseBrowserTimezone = false,
) {
  const appointmentType = getAppointmentType(appt);
  const isCC = appt.kind === 'cc';
  const isPast = appt.past;
  const isRequest = appt.pending;
  const isUpcoming = appt.future;
  const isCCRequest = appointmentType === APPOINTMENT_TYPES.ccRequest;
  const providers = appt.practitioners;
  const start = new Date(appt.start);
  const isAtlas = appt.modality === 'vaVideoCareAtAnAtlasLocation';
  const isVideoAtHome = appt.modality === 'vaVideoCareAtHome';
  const isVideoAtVA = appt.modality === 'vaVideoCareAtAVaLocation';
  const isVideo = isAtlas || isVideoAtHome || isVideoAtVA;
  const isCompAndPen = appt.modality === 'claimExamAppointment';
  const isPhone = appt.modality === 'vaPhone';
  const isCovid = appt.modality === 'vaInPersonVaccine';
  const isInPersonVisit =
    isCompAndPen || isCovid || appt.modality === 'vaInPerson';

  const isCancellable = appt.cancellable;
  const appointmentTZ = getAppointmentTimezone(appt, featureUseBrowserTimezone);

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
      return {
        start: new Date(d.start),
      };
    });
    requestFields = {
      requestedPeriod: reqPeriods,
      created,
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
  const patientComments = appt.reasonCode ? appt.patientComments : null;
  return {
    resourceType: 'Appointment',
    id: appt.id,
    type: appt.type,
    modality: appt.modality,
    status: appt.status,
    cancelationReason: appt.cancelationReason?.coding?.[0].code || null,
    showScheduleLink: appt.showScheduleLink,
    avsPath: appt.avsPath ?? null,
    avsPdf: appt.avsPdf ?? null,
    avsError: appt.avsError ?? null,
    start: !isRequest ? start : null,
    startUtc: !isRequest ? appt.start : null,
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
      clinicName: appt.serviceName,
      clinicPhysicalLocation: appt.physicalLocation,
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
      isCerner: appt.isCerner || false,
      apiData: appt,
      timeZone: appointmentTZ,
      facilityData,
    },
    version: 2,
  };
}

export function transformVAOSAppointments(appts, featureUseBrowserTimezone) {
  return appts.map(appt =>
    transformVAOSAppointment(appt, featureUseBrowserTimezone),
  );
}
