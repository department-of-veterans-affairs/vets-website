import { isEmpty } from 'lodash';
import { formatInTimeZone } from 'date-fns-tz';
import { getProviderName, getTypeOfCareById } from '../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  COMP_AND_PEN,
  PURPOSE_TEXT_V2,
  TYPE_OF_VISIT,
} from '../../utils/constants';
import {
  getTimezoneByFacilityId,
  getTimezoneNameFromAbbr,
} from '../../utils/timezone';
import { transformFacilityV2 } from '../location/transformers';
import { selectTimeZoneAbbr } from '../../appointment-list/redux/selectors';

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

function getAppointmentTimezone(appt, featureUseBrowserTimezone) {
  const timezone = appt.location?.attributes?.timezone?.timeZoneId;

  return (
    timezone ||
    getTimezoneByFacilityId(appt.locationId, featureUseBrowserTimezone)
  );
}

function getCommunityCareProviderObject(appt) {
  const providers = appt.practitioners;
  return appt.type === 'COMMUNITY_CARE_APPOINTMENT'
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
        providerName: providers !== undefined ? getProviderName(appt) : null,
      }
    : null;
}
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

export function transformVAOSAppointment(
  appt,
  featureUseBrowserTimezone = false,
) {
  const appointmentType = getAppointmentType(appt);
  const start = new Date(appt.start);
  const isVideo =
    appt.modality === 'vaVideoCareAtAnAtlasLocation' ||
    appt.modality === 'vaVideoCareAtHome' ||
    appt.modality === 'vaVideoCareAtAVaLocation';
  const appointmentTZ = getAppointmentTimezone(appt, featureUseBrowserTimezone);

  let requestFields = {};

  if (appt.pending) {
    const { requestedPeriods, created } = appt;
    const reqPeriods = requestedPeriods?.map(d => {
      return {
        start: new Date(d.start),
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

  return {
    avsPath: appt.past ? appt.avsPath : null,
    cancelationReason: appt.cancelationReason?.coding?.[0].code || null,
    clinicPhone: appt.extension?.clinic?.phoneNumber || null,
    clinicPhoneExtension: appt.extension?.clinic?.phoneNumberExtension || null,
    clinicPhysicalLocation: appt.physicalLocation,

    communityCareProvider: getCommunityCareProviderObject(appt),

    // This contains the vista status for v0 appointments, but
    // we don't have that for v2, so this is a made up status
    description: appt.kind !== 'cc' ? 'VAOS_UNKNOWN' : null,

    id: appt.id,
    isAtlasVideoAppointment: appt.modality === 'vaVideoCareAtAnAtlasLocation',
    isBadAppointmentId: false,
    isCOVIDVaccine: appt.modality === 'vaInPersonVaccine',
    isCanceled: appt.status === APPOINTMENT_STATUS.cancelled,
    isCancellable: appt.cancellable,
    isCerner: appt.isCerner || false,
    isClinicVideoAppointment: appt.modality === 'vaVideoCareAtAVaLocation',
    isCommunityCare: appt.kind === 'cc',
    isCompAndPenAppointment: appt.modality === 'claimExamAppointment',
    isExpressCare: false,
    isPastAppointment: appt.past,
    isPendingAppointment: appt.pending,
    isUpcomingAppointment: appt.future,
    isVideo,
    isVideoAtHome: appt.modality === 'vaVideoCareAtHome',
    locationId: appt.locationId,
    minutesDuration: Number.isNaN(parseInt(appt.minutesDuration, 10))
      ? 60
      : appt.minutesDuration,
    modality: appt.modality,
    patientComments: appt.reasonCode ? appt.patientComments : null,
    reasonForAppointment: getReasonForAppointment(appt),
    resourceType: 'Appointment',
    showScheduleLink: appt.showScheduleLink,
    status: appt.status,
    timezone: appointmentTZ,
    type: appt.type,

    location: getLocationObject(appt),
    videoData: getVideoObject(appt),
    preferredProviderName:
      appt.type === 'COMMUNITY_CARE_APPOINTMENT' && appt.preferredProviderName
        ? { providerName: appt.preferredProviderName }
        : null,
    practitioners:
      appt.practitioners && typeof appt.practitioners !== 'undefined'
        ? appt.practitioners
        : [],
    ...requestFields,
    vaos: {
      appointmentType,
      apiData: appt,
      timeZone: appointmentTZ,
      facilityData,
    },

    // Computed properties
    get appointmentDateAriaText() {
      const appointmentDate = this.startDate;
      const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
      return `${formatInTimeZone(
        appointmentDate,
        this.timezone,
        'EEEE, MMMM d h:mm aaaa',
      )}, ${timezoneName}'}`;
    },
    get appointmentDetailAriaText() {
      const appointmentDate = this.startDate;
      const { isCommunityCare } = this.vaos;
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

      let modality = 'in-person';
      if (isCommunityCare) modality = 'community care';
      if (this.isPhoneAppointment) modality = 'phone';
      if (isVideo) modality = 'video';

      return `${fillin1} ${modality} ${fillin2} ${fillin3}`;
    },
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
        isVideo ||
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
    },
    get atlasConfirmationCode() {
      return this.videoData?.atlasConfirmationCode;
    },
    get clinicName() {
      return this.location?.clinicName;
    },
    get facility() {
      return { address: { line: [] }, name: 'Not implemented' };
    },
    get facilityPhone() {
      return 'Not implemented';
    },
    get isInPersonVisit() {
      return (
        this.isCompAndPenAppointment ||
        this.isCOVIDVaccine ||
        this.modality === 'vaInPerson'
      );
    },
    get isPendingOrCancelledRequest() {
      return (
        !this.isExpressCare &&
        (this.status === APPOINTMENT_STATUS.proposed ||
          this.status === APPOINTMENT_STATUS.pending ||
          this.status === APPOINTMENT_STATUS.cancelled)
      );
    },
    get isPhoneAppointment() {
      return this.modality === 'vaPhone';
    },
    get modalityIcon() {
      const {
        isAtlas: isVideoAtlas,
        isClinicVideoAppointment: isVideoClinic,
        isInPersonVisit,
        isPhoneAppointment,
        isVideoAtHome: isVideoHome,
      } = this;

      let icon = '';

      if (isInPersonVisit || isVideoAtlas || isVideoClinic)
        icon = 'location_city';
      if (isVideoHome) icon = 'videocam';
      if (isPhoneAppointment) icon = 'phone';

      return icon;
    },

    get modalityText() {
      const { isCommunityCare } = this.vaos;
      const { isInPersonVisit } = this.vaos;
      const isVideoAtlas = this.vaos.isAtlas;
      const isVideoClinic = this.isClinicVideoAppointment;
      const isVideoHome = this.isVideoAtHome;
      const { name: facilityName } = this.vaos.facilityData || {
        name: '',
      };

      if (this.isPendingAppointment) {
        if (isInPersonVisit) {
          return 'In person';
        }
        if (isCommunityCare) {
          return 'Community care';
        }
      }

      // NOTE: Did confirm that you can't create an Atlas appointment without a
      // facility but we will check anyway.
      //
      // TODO: What default should be displayed if the data is corrupt an there is
      // no facility name?
      if (this.vaos?.isVideo) {
        if (isVideoAtlas) {
          const { line, city, state } = this.videoData.atlasLocation.address;
          return `At ${line} ${city}, ${state}`;
        }

        if (isVideoHome) return 'Video';
      }

      if (isInPersonVisit || isVideoClinic) {
        return facilityName ? `At ${facilityName}` : 'At VA facility';
      }

      if (this.isPhoneAppointment) return 'Phone';
      if (isCommunityCare) return 'Community care';
      // if (facilityName) return `At ${facilityName}`;

      return '';
    },
    get practitionerName() {
      if (this.isCommunityCare) {
        // NOTE: appointment.communityCareProvider is populated for booked CC only
        const { providerName, name } = this.communityCareProvider || {
          providerName: null,
          name: null,
        };

        // NOTE: appointment.preferredProviderName is populated for CC request only
        const {
          // rename since 'providerName' is defined above
          providerName: preferredProviderName,
        } = this.preferredProviderName || { providerName: null };

        return providerName || name || preferredProviderName || '';
      }

      // TODO: Refactor!!! This logic is a rewrite of the function 'getPractitionerName'
      // located at vaos/services/appointments/index.js which is in the domain layer.
      // It should be in the UI layer as a selector. The refactor is to remove the
      // 'getPractitionerName' function and move all other similar functions to this
      // layer. See the following link for details.
      //
      // https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/engineering/architecture/front_end_architecture.md
      let { practitioners = [] } = this;
      practitioners = practitioners
        .map(practitioner => {
          const { name } = practitioner;
          if (name)
            return `${name.given.toString().replaceAll(',', ' ')} ${
              name.family
            }`;
          return null;
        })
        .filter(Boolean);

      return practitioners.length > 0 ? practitioners[0] : '';
    },
    get start() {
      return !this.isPendingAppointment ? start : null;
    },
    set start(val) {
      this.start = val;
    },
    get startDate() {
      if (this.isPendingAppointment) {
        return new Date(this.requestedPeriod[0].start);
      }

      return new Date(this.start);
    },
    get startUtc() {
      return !this.isPendingAppointment ? appt.start : null;
    },
    get timeZoneAbbr() {
      // const { abbreviation } = getAppointmentTimezone(
      //   appointment,
      //   isUseBrowserTimezone,
      // );
      // return abbreviation;
      return 'Not implemented';
    },
    get typeOfCareName() {
      const { name } = getTypeOfCareById(this.vaos.apiData?.serviceType) || '';
      const serviceCategoryName =
        this.vaos.apiData?.serviceCategory?.[0]?.text || {};
      if (serviceCategoryName === COMP_AND_PEN) {
        const { displayName } = getTypeOfCareById(serviceCategoryName);
        return displayName;
      }
      return name;
    },

    version: 2,
  };
}

export function transformVAOSAppointments(appts, featureUseBrowserTimezone) {
  return appts.map(appt =>
    transformVAOSAppointment(appt, featureUseBrowserTimezone),
  );
}
