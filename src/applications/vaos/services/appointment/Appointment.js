import { formatInTimeZone } from 'date-fns-tz';
import { selectTimeZoneAbbr } from '../../appointment-list/redux/selectors';
import { APPOINTMENT_STATUS, PURPOSE_TEXT_V2 } from '../../utils/constants';
import { getTimezoneNameFromAbbr } from '../../utils/timezone';
import { formatFacilityAddress, getFacilityPhone } from '../location';

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

function getLocationObject(response) {
  return {
    // TODO: what happens when vaos service can't find sta6aid for the appointment
    vistaId: response.locationId?.substr(0, 3) || null,
    clinicId: response.clinic,
    stationId: response.locationId,
    clinicName: response.serviceName,
    clinicPhysicalLocation: response.physicalLocation,
    clinicPhone: response.extension?.clinic?.phoneNumber || null,
    clinicPhoneExtension:
      response.extension?.clinic?.phoneNumberExtension || null,
    name: response.name,
  };
}

export default class Appointment {
  _modality;

  _modalityIcon = 'location_city';

  _modalityText = '';

  _pageTitle = 'VA appointment on';

  _start;

  _signinText =
    'Sign in to https://va.gov/my-health/appointments/ to get details about this appointment';

  constructor(response) {
    this.avsPath = response.past ? response.avsPath : null;
    this.cancelationReason =
      response.cancelationReason?.coding?.[0].code || null;

    // This contains the vista status for v0 appointments, but
    // we don't have that for v2, so this is a made up status
    this.description = response.kind !== 'cc' ? 'VAOS_UNKNOWN' : null;

    this.id = response.id;
    this.isAtlasVideoAppointment =
      response.modality === 'vaVideoCareAtAnAtlasLocation';
    this.isBadAppointmentId = false;
    this.isCOVIDVaccine = response.modality === 'vaInPersonVaccine';
    this.isCanceled = response.status === APPOINTMENT_STATUS.cancelled;
    this.isCancellable = response.cancellable;
    this.isCerner = response.isCerner || false;
    this.isClinicVideoAppointment =
      response.modality === 'vaVideoCareAtAVaLocation';
    // this.isCommunityCare = response.kind === 'cc';
    this.isCompAndPenAppointment = response.modality === 'claimExamAppointment';
    this.isExpressCare = false;
    this.isPastAppointment = response.past;
    this.isPendingAppointment = response.pending;
    this.isUpcomingAppointment = response.future;
    // this.isVideo;
    this.isVideoAtHome = response.modality === 'vaVideoCareAtHome';
    this.locationId = response.locationId;
    this.minutesDuration = Number.isNaN(parseInt(response.minutesDuration, 10))
      ? 60
      : response.minutesDuration;
    this._modality = response.modality;
    this.patientComments = response.reasonCode
      ? response.patientComments
      : null;
    this.reasonForAppointment = getReasonForAppointment(response);
    this.resourceType = 'Appointment';
    this.showScheduleLink = response.showScheduleLink;
    this._start = response.start;
    this.status = response.status;
    this.timezone = 'America/Chicago'; // appointmentTZ;
    this.type = response.type;

    this.location = getLocationObject(response);
    // this.videoData = getVideoObject(response);
    // this.preferredProviderName=
    //   response.type === 'COMMUNITY_CARE_APPOINTMENT' && response.preferredProviderName
    //     ? { providerName= response.preferredProviderName }
    //     : null;
    this._practitioners = response.practitioners || [];
    // response.practitioners && typeof response.practitioners !== 'undefined'
    //   ? response.practitioners
    //       .filter(practitioner => !!practitioner.name)
    //       .map(
    //         practitioner =>
    //           `${practitioner.name.given.join(' ')} ${
    //             practitioner.name.family
    //           } `,
    //       )
    //   : [];
    // ...requestFields,
    // vaos: {
    //   appointmentType,
    //   apiData= response,
    //   timeZone: appointmentTZ,
    //   facilityData,
    // },
  }

  get appointmentDateAriaText() {
    const appointmentDate = this.startDate;
    const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
    return `${formatInTimeZone(
      appointmentDate,
      this.timezone,
      'EEEE, MMMM d h:mm aaaa',
    )}, ${timezoneName}'}`;
  }

  get appointmentDetailAriaText() {
    const appointmentDate = this.startDate;
    // const { isCommunityCare } = this.vaos;
    const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
    const { modalityText } = this;
    const fillin1 = this.isCanceled ? `Details for canceled` : 'Details for';
    let fillin2 =
      this.typeOfCareName && typeof this.typeOfCareName !== 'undefined'
        ? `${this.typeOfCareName} appointment on`
        : 'appointment on';
    const fillin3 = `${formatInTimeZone(
      appointmentDate,
      this.timezone,
      'EEEE, MMMM d h:mm aaaa',
    )}, ${timezoneName}`;

    // Override fillin2 text for canceled or pending appointments
    if (this.isPendingAppointment && this.isPendingOrCancelledRequest) {
      fillin2 = '';
      if (this.typeOfCareName && typeof typeOfCareName !== 'undefined') {
        fillin2 = `${this.typeOfCareName}`;
      }

      return `${fillin1} request for a ${fillin2} ${modalityText.replace(
        /^at /i,
        '',
      )} appointment`;
    }

    const modality = 'in-person';
    // if (isCommunityCare) modality = 'community care';
    // if (this.isPhoneAppointment) modality = 'phone';
    // if (isVideo) modality = 'video';

    return `${fillin1} ${modality} ${fillin2} ${fillin3}`;
  }

  get getCalendarData() {
    return {
      summary: `Appointment at ${this.location?.name || 'the VA'}`,
      location: formatFacilityAddress(this.location),
      text: `You have a health care appointment at ${this.location?.name ||
        'a VA location.'}`,
      phone: getFacilityPhone(this.location),
      additionalText: [this.signinText],
    };
  }

  get appointmentLocality() {
    const practitioner = this.practitionerName;
    const { typeOfCareName, isCommunityCare, isInPersonVisit } = this;

    if (this.isPendingAppointment) {
      const { name: facilityName } = this.vaos.facilityData || {
        name: '',
      };
      if (isCommunityCare) {
        return practitioner;
      }

      return facilityName;
    }

    if (
      isInPersonVisit ||
      this.isVideo ||
      this.isPhoneAppointment ||
      isCommunityCare
    ) {
      if (typeOfCareName && practitioner) {
        return `${typeOfCareName} with ${practitioner}`;
      }

      if (typeOfCareName) {
        return typeOfCareName;
      }

      if (practitioner)
        return `${
          isCommunityCare ? 'Community care' : 'VA'
        } appointment with ${practitioner}`;
    }

    return `${isCommunityCare ? 'Community care' : 'VA appointment'}`;
  }

  get link() {
    const ccEps = this._modality === 'communityCareEps';

    return `${this.isPastAppointment && !ccEps ? 'past' : ''}/${this.id}${
      ccEps ? '?eps=true' : ''
    }`;
  }

  get modalityIcon() {
    return this._modalityIcon;
  }

  get modalityText() {
    return this._modalityText;
  }

  get practitioners() {
    return this._practitioners;
  }

  get signinText() {
    return this._signinText;
  }

  get start() {
    return !this.isPendingAppointment ? new Date(this._start) : null;
  }
  // set start(val) {
  //   this._start = val;
  // }

  get startDate() {
    if (this.isPendingAppointment) {
      return new Date(this.requestedPeriod[0].start);
    }

    return new Date(this._start);
  }

  get startUtc() {
    return !this.isPendingAppointment ? this._start : null;
  }
}
