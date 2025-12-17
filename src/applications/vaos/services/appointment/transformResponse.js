import { map } from 'lodash';
import { FUTURE_APPOINTMENTS_HIDDEN_SET } from '.';
import AppointmentCC from './AppointmentCC';
import AppointmentCCRequest from './AppointmentCCRequest';
import AppointmentClaimExam from './AppointmentClaimExam';
import AppointmentPhone from './AppointmentPhone';
import AppointmentVA from './AppointmentVA';
import AppointmentVaccine from './AppointmentVaccine';
import AppointmentVARequest from './AppointmentVARequest';
import AppointmentVideoAtlas from './AppointmentVideoAtlas';
import AppointmentVideoHome from './AppointmentVideoHome';
import AppointmentVideoVA from './AppointmentVideoVA';

export function createAppointmentFactory(response) {
  if (response?.type === 'VA') {
    //     appt.modality === 'vaVideoCareAtAnAtlasLocation' ||
    // appt.modality === 'vaVideoCareAtHome' ||
    // appt.modality === 'vaVideoCareAtAVaLocation';

    switch (response.modality) {
      case 'vaVideoCareAtAnAtlasLocation':
        return new AppointmentVideoAtlas(response);

      case 'vaVideoCareAtHome':
        return new AppointmentVideoHome(response);

      case 'vaVideoCareAtAVaLocation':
        return new AppointmentVideoVA(response);

      case 'claimExamAppointment':
        return new AppointmentClaimExam(response);

      case 'vaInPerson':
        return new AppointmentVA(response);

      case 'vaInPersonVaccine':
        return new AppointmentVaccine(response);

      case 'vaPhone':
        return new AppointmentPhone(response);

      default:
        throw new Error(`Unknown modality: ${response.kind}`);
    }

    // return APPOINTMENT_TYPES.vaAppointment;
  }
  if (response?.type === 'REQUEST') {
    return new AppointmentVARequest(response);
  }
  if (response?.type === 'COMMUNITY_CARE_APPOINTMENT') {
    return new AppointmentCC(response);
  }
  if (response?.type === 'COMMUNITY_CARE_REQUEST') {
    return new AppointmentCCRequest(response);
  }
  throw new Error(`Unknown modality: ${response.kind}`);
  // return APPOINTMENT_TYPES.vaAppointment;
}

export default function transformResponses(response, _meta, _arg) {
  // Pluck the 'attributes' data
  return map([...response], 'attributes')
    .filter(appointment => {
      // NOTE: Shouldn't need this check since it's implied that upcoming
      // appointment are of type VA or CC.
      if (
        appointment.future &&
        (appointment.type === 'COMMUNITY_CARE_APPOINTMENT' ||
          appointment.type === 'VA')
      ) {
        return !FUTURE_APPOINTMENTS_HIDDEN_SET.has(appointment.description);
      }
      return false;
    })
    .map(createAppointmentFactory);
  // return transformVAOSAppointments(a);

  // const start = new Date(response.start);
  // const isVideo =
  //   response.modality === 'vaVideoCareAtAnAtlasLocation' ||
  //   response.modality === 'vaVideoCareAtHome' ||
  //   response.modality === 'vaVideoCareAtAVaLocation';
  // const appointmentTZ = getAppointmentTimezone(
  //   response,
  //   featureUseBrowserTimezone,
  // );

  // let requestFields = {};

  // if (response.pending) {
  //   const { requestedPeriods, created } = response;
  //   const reqPeriods = requestedPeriods?.map(d => {
  //     return {
  //       start: new Date(d.start),
  //     };
  //   });

  //   // hasReasonCode is only applicable to v0 appointments
  //   const hasReasonCode = response.reasonCode?.coding?.length > 0;

  //   const reasonCode = !isEmpty(response.reasonForAppointment)
  //     ? response.reasonForAppointment
  //     : response.reasonCode?.coding?.[0];
  //   const reasonForAppointment = hasReasonCode
  //     ? PURPOSE_TEXT_V2.find(
  //         purpose =>
  //           purpose.serviceName === reasonCode.code ||
  //           purpose.commentShort === reasonCode.code,
  //       )?.short
  //     : response.reasonForAppointment;
  //   requestFields = {
  //     requestedPeriod: reqPeriods,
  //     created,
  //     reasonForAppointment,
  //     preferredTimesForPhoneCall: response.preferredTimesForPhoneCall,
  //     requestVisitType: getTypeOfVisit(response.kind),
  //     contact: response.contact,
  //     preferredDates: response?.preferredDates || [],
  //     preferredModality: response?.preferredModality,
  //   };
  // }

  // // TODO: verfy in RI
  // let facilityData;
  // if (response.location && response.location.attributes) {
  //   facilityData = transformFacilityV2(response.location.attributes);
  // }

  // return {
  //   avsPath: response.past ? response.avsPath : null,
  //   cancelationReason: response.cancelationReason?.coding?.[0].code || null,
  //   clinicPhone: response.extension?.clinic?.phoneNumber || null,
  //   clinicPhoneExtension:
  //     response.extension?.clinic?.phoneNumberExtension || null,
  //   clinicPhysicalLocation: response.physicalLocation,

  //   communityCareProvider: getCommunityCareProviderObject(response),

  //   // This contains the vista status for v0 appointments, but
  //   // we don't have that for v2, so this is a made up status
  //   description: response.kind !== 'cc' ? 'VAOS_UNKNOWN' : null,

  //   id: response.id,
  //   isAtlasVideoAppointment:
  //     response.modality === 'vaVideoCareAtAnAtlasLocation',
  //   isBadAppointmentId: false,
  //   isCOVIDVaccine: response.modality === 'vaInPersonVaccine',
  //   isCanceled: response.status === APPOINTMENT_STATUS.cancelled,
  //   isCancellable: response.cancellable,
  //   isCerner: response.isCerner || false,
  //   isClinicVideoAppointment: response.modality === 'vaVideoCareAtAVaLocation',
  //   isCommunityCare: response.kind === 'cc',
  //   isCompAndPenAppointment: response.modality === 'claimExamAppointment',
  //   isExpressCare: false,
  //   isPastAppointment: response.past,
  //   isPendingAppointment: response.pending,
  //   isUpcomingAppointment: response.future,
  //   isVideo,
  //   isVideoAtHome: response.modality === 'vaVideoCareAtHome',
  //   locationId: response.locationId,
  //   minutesDuration: Number.isNaN(parseInt(response.minutesDuration, 10))
  //     ? 60
  //     : response.minutesDuration,
  //   modality: response.modality,
  //   patientComments: response.reasonCode ? response.patientComments : null,
  //   reasonForAppointment: getReasonForAppointment(response),
  //   resourceType: 'Appointment',
  //   showScheduleLink: response.showScheduleLink,
  //   status: response.status,
  //   timezone: appointmentTZ,
  //   type: response.type,

  //   location: getLocationObject(response),
  //   videoData: getVideoObject(response),
  //   preferredProviderName:
  //     response.type === 'COMMUNITY_CARE_APPOINTMENT' &&
  //     response.preferredProviderName
  //       ? { providerName: response.preferredProviderName }
  //       : null,
  //   practitioners:
  //     response.practitioners && typeof response.practitioners !== 'undefined'
  //       ? response.practitioners
  //       : [],
  //   ...requestFields,
  //   vaos: {
  //     appointmentType,
  //     apiData: response,
  //     timeZone: appointmentTZ,
  //     facilityData,
  //   },

  //   // Computed properties
  //   get appointmentDateAriaText() {
  //     const appointmentDate = this.startDate;
  //     const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
  //     return `${formatInTimeZone(
  //       appointmentDate,
  //       this.timezone,
  //       'EEEE, MMMM d h:mm aaaa',
  //     )}, ${timezoneName}'}`;
  //   },
  //   get appointmentDetailAriaText() {
  //     const appointmentDate = this.startDate;
  //     const { isCommunityCare } = this.vaos;
  //     const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
  //     const { modalityText } = this;
  //     const fillin1 = this.isCanceled ? `Details for canceled` : 'Details for';
  //     let fillin2 =
  //       this.typeOfCareName && typeof this.typeOfCareName !== 'undefined'
  //         ? `${this.typeOfCareName} appointment on`
  //         : 'appointment on';
  //     const fillin3 = `${formatInTimeZone(
  //       appointmentDate,
  //       this.timezone,
  //       'EEEE, MMMM d h:mm aaaa',
  //     )}, ${timezoneName}`;

  //     // Override fillin2 text for canceled or pending appointments
  //     if (this.isPendingAppointment && this.isPendingOrCancelledRequest) {
  //       fillin2 = '';
  //       if (this.typeOfCareName && typeof typeOfCareName !== 'undefined') {
  //         fillin2 = `${this.typeOfCareName}`;
  //       }

  //       return `${fillin1} request for a ${fillin2} ${modalityText.replace(
  //         /^at /i,
  //         '',
  //       )} appointment`;
  //     }

  //     let modality = 'in-person';
  //     if (isCommunityCare) modality = 'community care';
  //     if (this.isPhoneAppointment) modality = 'phone';
  //     if (isVideo) modality = 'video';

  //     return `${fillin1} ${modality} ${fillin2} ${fillin3}`;
  //   },
  //   get appointmentLocality() {
  //     const practitioner = this.practitionerName;
  //     const { typeOfCareName, isCommunityCare, isInPersonVisit } = this;

  //     if (this.isPendingAppointment) {
  //       const { name: facilityName } = this.vaos.facilityData || {
  //         name: '',
  //       };
  //       if (isCommunityCare) {
  //         return practitioner;
  //       }

  //       return facilityName;
  //     }

  //     if (
  //       isInPersonVisit ||
  //       isVideo ||
  //       this.isPhoneAppointment ||
  //       isCommunityCare
  //     ) {
  //       if (typeOfCareName && practitioner) {
  //         return `${typeOfCareName} with ${practitioner}`;
  //       }

  //       if (typeOfCareName) {
  //         return typeOfCareName;
  //       }

  //       if (practitioner)
  //         return `${
  //           isCommunityCare ? 'Community care' : 'VA'
  //         } appointment with ${practitioner}`;
  //     }

  //     return `${isCommunityCare ? 'Community care' : 'VA appointment'}`;
  //   },
  //   get atlasConfirmationCode() {
  //     return this.videoData?.atlasConfirmationCode;
  //   },
  //   get clinicName() {
  //     return this.location?.clinicName;
  //   },
  //   get facility() {
  //     return { address: { line: [] }, name: 'Not implemented' };
  //   },
  //   get facilityPhone() {
  //     return 'Not implemented';
  //   },
  //   get isInPersonVisit() {
  //     return (
  //       this.isCompAndPenAppointment ||
  //       this.isCOVIDVaccine ||
  //       this.modality === 'vaInPerson'
  //     );
  //   },
  //   get isPendingOrCancelledRequest() {
  //     return (
  //       !this.isExpressCare &&
  //       (this.status === APPOINTMENT_STATUS.proposed ||
  //         this.status === APPOINTMENT_STATUS.pending ||
  //         this.status === APPOINTMENT_STATUS.cancelled)
  //     );
  //   },
  //   get isPhoneAppointment() {
  //     return this.modality === 'vaPhone';
  //   },
  //   get modalityIcon() {
  //     const {
  //       isAtlas: isVideoAtlas,
  //       isClinicVideoAppointment: isVideoClinic,
  //       isInPersonVisit,
  //       isPhoneAppointment,
  //       isVideoAtHome: isVideoHome,
  //     } = this;

  //     let icon = '';

  //     if (isInPersonVisit || isVideoAtlas || isVideoClinic)
  //       icon = 'location_city';
  //     if (isVideoHome) icon = 'videocam';
  //     if (isPhoneAppointment) icon = 'phone';

  //     return icon;
  //   },

  //   get modalityText() {
  //     const { isCommunityCare } = this.vaos;
  //     const { isInPersonVisit } = this.vaos;
  //     const isVideoAtlas = this.vaos.isAtlas;
  //     const isVideoClinic = this.isClinicVideoAppointment;
  //     const isVideoHome = this.isVideoAtHome;
  //     const { name: facilityName } = this.vaos.facilityData || {
  //       name: '',
  //     };

  //     if (this.isPendingAppointment) {
  //       if (isInPersonVisit) {
  //         return 'In person';
  //       }
  //       if (isCommunityCare) {
  //         return 'Community care';
  //       }
  //     }

  //     // NOTE: Did confirm that you can't create an Atlas appointment without a
  //     // facility but we will check anyway.
  //     //
  //     // TODO: What default should be displayed if the data is corrupt an there is
  //     // no facility name?
  //     if (this.vaos?.isVideo) {
  //       if (isVideoAtlas) {
  //         const { line, city, state } = this.videoData.atlasLocation.address;
  //         return `At ${line} ${city}, ${state}`;
  //       }

  //       if (isVideoHome) return 'Video';
  //     }

  //     if (isInPersonVisit || isVideoClinic) {
  //       return facilityName ? `At ${facilityName}` : 'At VA facility';
  //     }

  //     if (this.isPhoneAppointment) return 'Phone';
  //     if (isCommunityCare) return 'Community care';
  //     // if (facilityName) return `At ${facilityName}`;
  //     return '';
  //   },
  //   get practitionerName() {
  //     if (this.isCommunityCare) {
  //       // NOTE: appointment.communityCareProvider is populated for booked CC only
  //       const { providerName, name } = this.communityCareProvider || {
  //         providerName: null,
  //         name: null,
  //       };

  //       // NOTE: appointment.preferredProviderName is populated for CC request only
  //       const {
  //         // rename since 'providerName' is defined above
  //         providerName: preferredProviderName,
  //       } = this.preferredProviderName || { providerName: null };

  //       return providerName || name || preferredProviderName || '';
  //     }

  //     // TODO: Refactor!!! This logic is a rewrite of the function 'getPractitionerName'
  //     // located at vaos/services/appointments/index.js which is in the domain layer.
  //     // It should be in the UI layer as a selector. The refactor is to remove the
  //     // 'getPractitionerName' function and move all other similar functions to this
  //     // layer. See the following link for details.
  //     //
  //     // https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/engineering/architecture/front_end_architecture.md
  //     let { practitioners = [] } = this;
  //     practitioners = practitioners
  //       .map(practitioner => {
  //         const { name } = practitioner;
  //         if (name)
  //           return `${name.given.toString().replaceAll(',', ' ')} ${
  //             name.family
  //           }`;
  //         return null;
  //       })
  //       .filter(Boolean);

  //     return practitioners.length > 0 ? practitioners[0] : '';
  //   },
  //   get start() {
  //     return !this.isPendingAppointment ? start : null;
  //   },
  //   set start(val) {
  //     this.start = val;
  //   },
  //   get startDate() {
  //     if (this.isPendingAppointment) {
  //       return new Date(this.requestedPeriod[0].start);
  //     }

  //     return new Date(this.start);
  //   },
  //   get startUtc() {
  //     return !this.isPendingAppointment ? response.start : null;
  //   },
  //   get timeZoneAbbr() {
  //     // const { abbreviation } = getAppointmentTimezone(
  //     //   appointment,
  //     //   isUseBrowserTimezone,
  //     // );
  //     // return abbreviation;
  //     return 'Not implemented';
  //   },
  //   get typeOfCareName() {
  //     const { name } = getTypeOfCareById(this.vaos.apiData?.serviceType) || '';
  //     const serviceCategoryName =
  //       this.vaos.apiData?.serviceCategory?.[0]?.text || {};
  //     if (serviceCategoryName === COMP_AND_PEN) {
  //       const { displayName } = getTypeOfCareById(serviceCategoryName);
  //       return displayName;
  //     }
  //     return name;
  //   },

  //   version: 2,
  // };
}
