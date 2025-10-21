import { APPOINTMENT_STATUS, PURPOSE_TEXT_V2 } from '../../utils/constants';

function getReasonForAppointment(appt) {
  // get reason code from appt.reasonCode?.coding for v0 appointments
  const reasonCodeV0 = appt.reasonCode?.coding;
  return appt.reasonForAppointment
    ? appt.reasonForAppointment
    : PURPOSE_TEXT_V2.filter(purpose => purpose.id !== 'other').find(
        purpose =>
          purpose.serviceName === reasonCodeV0?.[0]?.code ||
          purpose.commentShort === reasonCodeV0?.[0]?.code,
      )?.short;
}

function getLocationObject(appt) {
  return {
    // TODO: what happens when vaos service can't find sta6aid for the appointment
    vistaId: appt.locationId?.substr(0, 3) || null,
    clinicId: appt.clinic,
    stationId: appt.locationId,
    clinicName: appt.serviceName,
    clinicPhysicalLocation: appt.physicalLocation,
    clinicPhone: appt.extension?.clinic?.phoneNumber || null,
    clinicPhoneExtension: appt.extension?.clinic?.phoneNumberExtension || null,
  };
}

function getVideoObject(appt) {
  const providers = appt.practitioners;
  const isVideo =
    appt.modality === 'vaVideoCareAtAnAtlasLocation' ||
    appt.modality === 'vaVideoCareAtHome' ||
    appt.modality === 'vaVideoCareAtAVaLocation';

  if (isVideo) {
    return {
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
      atlasLocation:
        appt.modality === 'vaVideoCareAtAnAtlasLocation'
          ? getAtlasLocation(appt)
          : null,
      atlasConfirmationCode: appt.telehealth?.atlas?.confirmationCode,
      extension: appt.extension,
    };
  }
  return null;
}

export default class Appointment {
  constructor(data) {
    this.avsPath = data.past ? data.avsPath : null;
    this.cancelationReason = data.cancelationReason?.coding?.[0].code || null;

    // This contains the vista status for v0 appointments, but
    // we don't have that for v2, so this is a made up status
    this.description = data.kind !== 'cc' ? 'VAOS_UNKNOWN' : null;

    this.id = data.id;
    this.isAtlasVideoAppointment =
      data.modality === 'vaVideoCareAtAnAtlasLocation';
    this.isBadAppointmentId = false;
    this.isCOVIDVaccine = data.modality === 'vaInPersonVaccine';
    this.isCanceled = data.status === APPOINTMENT_STATUS.cancelled;
    this.isCancellable = data.cancellable;
    this.isCerner = data.isCerner || false;
    this.isClinicVideoAppointment =
      data.modality === 'vaVideoCareAtAVaLocation';
    this.isCommunityCare = data.kind === 'cc';
    this.isCompAndPenAppointment = data.modality === 'claimExamAppointment';
    this.isExpressCare = false;
    this.isPastAppointment = data.past;
    this.isPendingAppointment = data.pending;
    this.isUpcomingAppointment = data.future;
    // this.isVideo;
    this.isVideoAtHome = data.modality === 'vaVideoCareAtHome';
    this.locationId = data.locationId;
    this.minutesDuration = Number.isNaN(parseInt(data.minutesDuration, 10))
      ? 60
      : data.minutesDuration;
    this.modality = data.modality;
    this.patientComments = data.reasonCode ? data.patientComments : null;
    this.reasonForAppointment = getReasonForAppointment(data);
    this.resourceType = 'Appointment';
    this.showScheduleLink = data.showScheduleLink;
    this.status = data.status;
    this.timezone = appointmentTZ;
    this.type = data.type;

    this.location = getLocationObject(data);
    this.videoData = getVideoObject(data);
    // this.preferredProviderName=
    //   data.type === 'COMMUNITY_CARE_APPOINTMENT' && data.preferredProviderName
    //     ? { providerName= data.preferredProviderName }
    //     : null;
    this.practitioners =
      data.practitioners && typeof data.practitioners !== 'undefined'
        ? data.practitioners
        : [];
    // ...requestFields,
    // vaos: {
    //   appointmentType,
    //   apiData= data,
    //   timeZone: appointmentTZ,
    //   facilityData,
    // },
  }
}
