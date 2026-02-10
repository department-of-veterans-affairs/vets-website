import { formatInTimeZone } from 'date-fns-tz';
import { selectCernerFacilityIds } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/cerner-dsot/selectors';
import { createSelector } from 'reselect';
import {
  selectFeatureRequests,
  selectFeatureUseVpg,
} from '../../redux/selectors';
import {
  getAppointmentTimezone,
  getPatientTelecom,
  getVAAppointmentLocationId,
  groupAppointmentsByMonth,
  isAtlasVideoAppointment,
  isClinicVideoAppointment,
  isInPersonVisit,
  isPendingOrCancelledRequest,
  isUpcomingAppointment,
  isValidPastAppointment,
  isVideoAtHome,
  sortByDateAscending,
  sortByDateDescending,
} from '../../services/appointment';
import { getTypeOfCareById } from '../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  COMP_AND_PEN,
  FETCH_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../utils/constants';
import { getTimezoneNameFromAbbr } from '../../utils/timezone';

export function getCancelInfo(state) {
  const {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
    cancelAppointmentStatusVaos400,
    facilityData,
  } = state.appointments;

  let facility = null;
  if (appointmentToCancel?.status === APPOINTMENT_STATUS.booked) {
    // Confirmed in person VA and video appts
    const locationId = getVAAppointmentLocationId(appointmentToCancel);
    facility = facilityData[locationId];
  } else if (appointmentToCancel?.facility) {
    // Requests
    facility = facilityData[appointmentToCancel.facility.facilityCode];
  }
  let isCerner = null;
  if (appointmentToCancel) {
    isCerner = selectCernerFacilityIds(state)?.some(
      cernerSite =>
        appointmentToCancel.location.vistaId?.startsWith(cernerSite.vhaId),
      // appointmentToCancel.location.vistaId?.startsWith(cernerSite.facilityId),
    );
  }
  return {
    facility,
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
    cancelAppointmentStatusVaos400,
    isCerner,
  };
}

export function selectFutureStatus(state) {
  const { pendingStatus, confirmedStatus } = state.appointments;
  if (
    pendingStatus === FETCH_STATUS.failed ||
    confirmedStatus === FETCH_STATUS.failed
  ) {
    return FETCH_STATUS.failed;
  }

  if (
    pendingStatus === FETCH_STATUS.loading ||
    confirmedStatus === FETCH_STATUS.loading
  ) {
    return FETCH_STATUS.loading;
  }

  if (
    pendingStatus === FETCH_STATUS.succeeded &&
    confirmedStatus === FETCH_STATUS.succeeded
  ) {
    return FETCH_STATUS.succeeded;
  }

  return FETCH_STATUS.notStarted;
}

export const selectUpcomingAppointments = createSelector(
  state => state.appointments.confirmed,
  confirmed => {
    if (!confirmed) {
      return null;
    }

    const sortedAppointments = confirmed
      .filter(item => isUpcomingAppointment(item))
      .sort(sortByDateAscending);

    return groupAppointmentsByMonth(sortedAppointments);
  },
);

export const selectPastAppointments = state => {
  const selector = createSelector(
    () => state.appointments.past,
    past => {
      if (!past) {
        return null;
      }

      return past.filter(isValidPastAppointment).sort(sortByDateDescending);
    },
  );
  return selector(state);
};

/*
 * V2 Past appointments state selectors
 */

export const selectPastAppointmentsV2 = state => {
  const selector = createSelector(
    () => state.appointments.past,
    past => {
      if (!past) {
        return null;
      }

      return groupAppointmentsByMonth(selectPastAppointments(state));
    },
  );
  return selector(state);
};

export function selectAppointmentById(state, id, types = null) {
  const { appointmentDetails, past, confirmed, pending } = state.appointments;

  if (
    appointmentDetails[id] &&
    (types === null ||
      types.includes(appointmentDetails[id].vaos.appointmentType))
  ) {
    return appointmentDetails[id];
  }

  const allAppointments = []
    .concat(pending)
    .concat(past)
    .concat(confirmed)
    .filter(item => !!item);

  return allAppointments.find(p => p.id === id);
}

export function selectFacility(state, id) {
  const { facilityData } = state.appointments;
  return facilityData?.[id] || {};
}

export function selectFacilitySettingsStatus(state) {
  return state.appointments.facilitySettingsStatus;
}

export function selectCanUseVaccineFlow(state) {
  const featureUseVpg = selectFeatureUseVpg(state);
  return state.appointments.facilitySettings?.some(
    facility =>
      featureUseVpg
        ? facility.services.find(
            service => service.id === TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
          )?.bookedAppointments
        : facility.services.find(
            service => service.id === TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
          )?.direct.enabled,
  );
}

export function selectProviderAddress(appointment) {
  const practitioners = appointment?.practitioners || [];
  return practitioners.length > 0 ? practitioners[0].address : null;
}

export function getUpcomingAppointmentListInfo(state) {
  return {
    facilityData: state.appointments.facilityData,
    futureStatus: state.appointments.confirmedStatus,
    appointmentsByMonth: selectUpcomingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
    hasBackendServiceFailures: !!state.appointments?.backendServiceFailures
      ?.meta?.length,
  };
}

export function selectProviderTelecom(appointment, system) {
  return appointment?.communityCareProvider?.telecom?.find(
    t => t.system === system,
  )?.value;
}
export function selectCCProvider(appointment) {
  const { address, providerName, treatmentSpecialty } =
    appointment?.communityCareProvider || {};
  const phone = selectProviderTelecom(appointment, 'phone');

  return {
    address,
    phone,
    providerName,
    treatmentSpecialty,
  };
}

export function selectTypeOfCareName(appointment) {
  if (!appointment) return '';

  const { name } =
    getTypeOfCareById(appointment.vaos.apiData?.serviceType) || '';
  const serviceCategoryName =
    appointment.vaos.apiData?.serviceCategory?.[0]?.text || {};
  if (serviceCategoryName === COMP_AND_PEN) {
    const { displayName } = getTypeOfCareById(serviceCategoryName);
    return displayName;
  }

  if (
    !name &&
    appointment.vaos?.isCerner &&
    appointment.vaos.apiData?.description
  ) {
    return appointment.vaos.apiData.description;
  }

  return name;
}

export function selectIsPhone(appointment) {
  return appointment?.vaos?.isPhoneAppointment;
}

export function selectTimeZoneAbbr(appointment, isUseBrowserTimezone) {
  const { abbreviation } = getAppointmentTimezone(
    appointment,
    isUseBrowserTimezone,
  );
  return abbreviation;
}

export function getPastAppointmentListInfo(state) {
  return {
    showScheduleButton: selectFeatureRequests(state),
    pastAppointmentsByMonth: selectPastAppointmentsV2(state),
    pastStatus: state.appointments.pastStatus,
    pastSelectedIndex: state.appointments.pastSelectedIndex,
    facilityData: state.appointments.facilityData,
  };
}

export function selectCommunityCareDetailsInfo(state, id) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  return {
    appointment: selectAppointmentById(state, id, [
      APPOINTMENT_TYPES.ccAppointment,
    ]),
    appointmentDetailsStatus,
    facilityData,
  };
}
export function selectBackendServiceFailuresInfo(state) {
  const { backendServiceFailures } = state.appointments;
  return {
    pastStatus: state.appointments.pastStatus,
    pendingStatus: state.appointments.pendingStatus,
    futureStatus: selectFutureStatus(state),
    backendServiceFailures,
  };
}
export function selectStartDate(appointment) {
  if (appointment.vaos.isPendingAppointment) {
    return new Date(appointment.requestedPeriod[0].start);
  }

  return new Date(appointment.start);
}

export function selectIsCanceled(appointment) {
  return appointment?.status === APPOINTMENT_STATUS.cancelled;
}

export function selectIsCommunityCare(appointment) {
  return appointment?.vaos?.isCommunityCare;
}

export function selectIsVideo(appointment) {
  return appointment?.vaos?.isVideo;
}

export function selectPractitionerName(appointment) {
  if (!appointment) return null;

  if (selectIsCommunityCare(appointment)) {
    // NOTE: appointment.communityCareProvider is populated for booked CC only
    const { providerName, name } = appointment.communityCareProvider || {
      providerName: null,
      name: null,
    };

    // NOTE: appointment.preferredProviderName is populated for CC request only
    const {
      // rename since 'providerName' is defined above
      providerName: preferredProviderName,
    } = appointment.preferredProviderName || { providerName: null };

    return providerName || name || preferredProviderName || '';
  }

  // TODO: Refactor!!! This logic is a rewrite of the function 'getPractitionerName'
  // located at vaos/services/appointments/index.js which is in the domain layer.
  // It should be in the UI layer as a selector. The refactor is to remove the
  // 'getPractitionerName' function and move all other similar functions to this
  // layer. See the following link for details.
  //
  // https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/engineering/architecture/front_end_architecture.md
  let { practitioners = [] } = appointment;
  practitioners = practitioners
    .map(practitioner => {
      const { name } = practitioner;
      if (name)
        return `${name.given.toString().replaceAll(',', ' ')} ${name.family}`;
      return null;
    })
    .filter(Boolean);

  return practitioners.length > 0 ? practitioners[0] : '';
}

export function selectIsPending(appointment) {
  return (
    appointment.status === APPOINTMENT_STATUS.proposed ||
    appointment.status === APPOINTMENT_STATUS.pending
  );
}

export function selectIsPast(appointment) {
  if (appointment && appointment.vaos) {
    const { isPastAppointment } = appointment.vaos;
    return isPastAppointment;
  }

  return false;
}

export function selectIsPendingAppointment(appt) {
  return (
    !appt.vaos.isExpressCare &&
    (appt.status === APPOINTMENT_STATUS.proposed ||
      appt.status === APPOINTMENT_STATUS.pending)
  );
}

export function selectIsCancelledAppointment(appt) {
  return (
    !appt.vaos.isExpressCare && appt.status === APPOINTMENT_STATUS.cancelled
  );
}

export function selectAppointmentLocality(
  appointment,
  isPendingAppointment = false,
) {
  const practitioner = selectPractitionerName(appointment);
  const typeOfCareName = selectTypeOfCareName(appointment);
  const isCommunityCare = selectIsCommunityCare(appointment);
  const isPhone = selectIsPhone(appointment);
  const isVideo = selectIsVideo(appointment);
  const isInPerson = isInPersonVisit(appointment);

  if (isPendingAppointment) {
    const { name: facilityName } = appointment.vaos.facilityData || {
      name: '',
    };
    if (isCommunityCare) {
      return practitioner;
    }

    return facilityName;
  }

  if (isInPerson || isVideo || isPhone || isCommunityCare) {
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

export function selectClinicLocationInfo(appointment) {
  const returningInfo = { location: undefined, name: undefined };

  if (!appointment || selectIsCommunityCare(appointment)) return returningInfo;

  const inPersonVisit = isInPersonVisit(appointment); // also checks for COVID/In Person/and Claim & Pension Exam -- in transformer
  const isVideoClinic = isClinicVideoAppointment(appointment); // Video at VA Facility

  if (inPersonVisit || isVideoClinic) {
    returningInfo.location = appointment.location?.clinicPhysicalLocation;
  }

  returningInfo.name = appointment.location?.clinicName;
  return returningInfo;
}

export function selectVideoData(appointment) {
  return appointment?.videoData || {};
}

export function selectVideoProviderName(appointment) {
  const videoData = selectVideoData(appointment);
  const [first] = videoData?.providers || [];
  return first?.display;
}

export function selectVideoProviderAddress(appointment) {
  const videoData = selectVideoData(appointment);
  return videoData?.atlasLocation?.address;
}

export function selectModalityText(appointment, isPendingAppointment = false) {
  const isCommunityCare = selectIsCommunityCare(appointment);
  const isInPerson = isInPersonVisit(appointment);
  const isPhone = selectIsPhone(appointment);
  const isVideoAtlas = isAtlasVideoAppointment(appointment);
  const isVideoClinic = isClinicVideoAppointment(appointment);
  const isVideoHome = isVideoAtHome(appointment);
  const { name: facilityName } = appointment.vaos.facilityData || {
    name: '',
  };

  if (isPendingAppointment) {
    if (isInPerson) {
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
  if (selectIsVideo(appointment)) {
    if (isVideoAtlas) {
      const { line, city, state } = appointment.videoData.atlasLocation.address;
      return `At ${line} ${city}, ${state}`;
    }

    if (isVideoHome) return 'Video';
  }

  if (isInPerson || isVideoClinic) {
    return facilityName ? `At ${facilityName}` : 'At VA facility';
  }

  if (isPhone) return 'Phone';
  if (isCommunityCare) return 'Community care';
  // if (facilityName) return `At ${facilityName}`;

  return '';
}
/**
 *
 * @param {*} appointment
 * @param {*} isRequest
 * @param {*} featureListViewClinicInfo
 * @returns
 */
export function selectApptDetailAriaText(
  appointment,
  isRequest = false,
  featureListViewClinicInfo = false,
) {
  const appointmentDate = selectStartDate(appointment);
  const isCanceled = selectIsCanceled(appointment);
  const isCommunityCare = selectIsCommunityCare(appointment);
  const isPhone = selectIsPhone(appointment);
  const isVideo = selectIsVideo(appointment);
  const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(appointment));
  const typeOfCareName = selectTypeOfCareName(appointment);
  const modalityText = selectModalityText(appointment);
  const practitioner = selectPractitionerName(appointment);

  const fillin1 = isCanceled ? `Details for canceled` : 'Details for';
  let fillin2 =
    typeOfCareName && typeof typeOfCareName !== 'undefined'
      ? `${typeOfCareName} appointment`
      : 'appointment';
  const fillin3 = `${formatInTimeZone(
    appointmentDate,
    appointment.timezone,
    'EEEE, MMMM d h:mm aaaa',
  )}, ${timezoneName}`;

  // Override fillin2 text for canceled or pending appointments
  if (isRequest && isPendingOrCancelledRequest(appointment)) {
    fillin2 = '';
    if (typeOfCareName && typeof typeOfCareName !== 'undefined') {
      fillin2 = `${typeOfCareName}`;
    }

    return `${fillin1} request for a ${fillin2} ${modalityText.replace(
      /^at /i,
      '',
    )} appointment`;
  }

  const fillinWithOn = `${
    featureListViewClinicInfo && practitioner ? `with ${practitioner} on` : 'on'
  }`;

  let modality = 'in-person';
  if (isCommunityCare) modality = 'community care';
  if (isPhone) modality = 'phone';
  if (isVideo) modality = 'video';

  return `${fillin1} ${modality} ${fillin2} ${fillinWithOn} ${fillin3}`;
}

export function selectApptDateAriaText(appointment) {
  const appointmentDate = selectStartDate(appointment);
  const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(appointment));
  return `${formatInTimeZone(
    appointmentDate,
    appointment.timezone,
    'EEEE, MMMM d h:mm aaaa',
  )}, ${timezoneName}`;
}

export function selectTypeOfCareAriaText(appointment) {
  const typeOfCareText = selectAppointmentLocality(appointment);
  const isCanceled = selectIsCanceled(appointment);
  return `${isCanceled ? 'canceled ' : ''}${typeOfCareText}`;
}

export function selectModalityAriaText(appointment) {
  const modalityText = selectModalityText(appointment);
  const isCanceled = selectIsCanceled(appointment);
  return `${isCanceled ? 'canceled ' : ''}${modalityText} appointment`;
}

export function selectModalityIcon(appointment) {
  const isInPerson = isInPersonVisit(appointment);
  const isPhone = selectIsPhone(appointment);
  const isVideoAtlas = isAtlasVideoAppointment(appointment);
  const isVideoClinic = isClinicVideoAppointment(appointment);
  const isVideoHome = isVideoAtHome(appointment);

  let icon = '';

  if (isInPerson || isVideoAtlas || isVideoClinic) icon = 'location_city';
  if (isVideoHome) icon = 'videocam';
  if (isPhone) icon = 'phone';

  return icon;
}

export function selectAppointmentType(appointment) {
  return appointment?.vaos.appointmentType;
}

export function selectAtlasConfirmationCode(appointment) {
  return appointment?.videoData?.atlasConfirmationCode;
}

export function selectAppointmentTravelClaim(appointment) {
  return appointment?.vaos?.apiData?.travelPayClaim;
}

export function selectIsEligibleForTravelClaim(appointment) {
  return (
    selectIsPast(appointment) &&
    (isInPersonVisit(appointment) || isClinicVideoAppointment(appointment)) &&
    selectAppointmentTravelClaim(appointment)
  );
}

export function selectConfirmedAppointmentData(state, appointment) {
  const isCommunityCare = appointment?.vaos?.isCommunityCare;
  const appointmentTypePrefix = isCommunityCare ? 'cc' : 'va';
  const isCerner = appointment?.vaos?.isCerner;
  const isVideo = appointment?.vaos?.isVideo;
  const isVA = !isVideo && !isCommunityCare;

  const locationId = getVAAppointmentLocationId(appointment);

  const {
    appointmentDetailsStatus,
    facilityData,
    isBadAppointmentId,
  } = state.appointments;
  const facility =
    facilityData?.[locationId] || appointment?.vaos?.facilityData;

  const phone = getPatientTelecom(appointment, 'phone');
  const ccProvider = selectCCProvider(appointment);
  const startDate = appointment?.start;
  const status = appointment?.status;
  const typeOfCareName = selectTypeOfCareName(appointment);
  const clinicName = appointment?.location?.clinicName;
  const clinicPhysicalLocation = appointment?.location?.clinicPhysicalLocation;
  const clinicPhone = appointment?.location?.clinicPhone;
  const clinicPhoneExtension = appointment?.location?.clinicPhoneExtension;
  const facilityPhone =
    facility?.telecom?.find(tele => tele.system === 'covid')?.value ||
    facility?.telecom?.find(tele => tele.system === 'phone')?.value;

  const duration = appointment?.minutesDuration;
  const isPhone = selectIsPhone(appointment);
  const timeZoneAbbr = selectTimeZoneAbbr(appointment);
  const providerAddress = selectProviderAddress(appointment);
  const isAtlasVideo = isAtlasVideoAppointment(appointment);
  const isPastAppointment = selectIsPast(appointment);
  const videoProviderName = selectVideoProviderName(appointment);
  const videoProviderAddress = selectVideoProviderAddress(appointment);
  const atlasConfirmationCode = selectAtlasConfirmationCode(appointment);
  const isCanceledAppointment = selectIsCanceled(appointment);
  const isUpcoming = appointment?.vaos?.isUpcomingAppointment;
  const practitionerName = selectPractitionerName(appointment);
  const timezone = appointment?.timezone;

  return {
    appointment,
    appointmentDetailsStatus,
    appointmentTypePrefix,
    atlasConfirmationCode,
    cancelInfo: getCancelInfo(state),
    ccProvider,
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    clinicPhysicalLocation,
    duration,
    facility,
    facilityData,
    facilityPhone,
    isCanceledAppointment,
    isBadAppointmentId,
    isCommunityCare,
    isAtlasVideo,
    isPastAppointment,
    isUpcomingAppointment: isUpcoming,
    isVA,
    isVideo,
    isPhone,
    isCerner,
    locationId,
    phone,
    practitionerName,
    providerAddress,
    startDate,
    status,
    timeZoneAbbr,
    timezone,
    typeOfCareName,
    videoProviderAddress,
    videoProviderName,
  };
}
export function getConfirmedAppointmentDetailsInfo(state, id) {
  const appointment = selectAppointmentById(state, id);
  return selectConfirmedAppointmentData(state, appointment);
}
export function selectRequestedAppointmentData(state, appointment) {
  const { facilityData } = state?.appointments || [];
  const isCerner = appointment?.vaos?.isCerner;

  const cancelInfo = getCancelInfo(state);
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const email = getPatientTelecom(appointment, 'email');
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const facilityPhone =
    appointment?.vaos.apiData.extension?.clinic?.phoneNumber ||
    facility?.telecom?.find(tele => tele.system === 'covid')?.value ||
    facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const isCC = appointment?.vaos.isCommunityCare;
  const isCCRequest =
    appointment?.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const isCanceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = selectIsPast(appointment);
  const phone = getPatientTelecom(appointment, 'phone');
  const preferredLanguage = appointment?.vaos.apiData.preferredLanguage;
  const preferredTimesForPhoneCall = appointment?.preferredTimesForPhoneCall;
  const provider = appointment?.preferredProviderName;
  const providerAddress = selectProviderAddress(appointment);
  const preferredDates = appointment?.preferredDates;
  const status = appointment?.status;
  const typeOfCare = getTypeOfCareById(appointment?.vaos.apiData.serviceType);
  const typeOfCareName = typeOfCare?.name;
  const isPendingAppointment = selectIsPendingAppointment(appointment);

  return {
    appointment,
    cancelInfo,
    canceled,
    email,
    facility,
    facilityData,
    facilityId,
    facilityPhone,
    isCC,
    isCCRequest,
    isCanceled,
    isPastAppointment,
    isPendingAppointment,
    phone,
    preferredDates,
    preferredLanguage,
    preferredTimesForPhoneCall,
    provider,
    providerAddress,
    status,
    typeOfCare,
    typeOfCareName,
    isCerner,
  };
}
export function selectRequestedAppointmentDetails(state, id) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  const appointment = selectAppointmentById(state, id, [
    APPOINTMENT_TYPES.request,
    APPOINTMENT_TYPES.ccRequest,
  ]);
  const isCerner = appointment?.vaos?.isCerner;
  const cancelInfo = getCancelInfo(state);
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const email = getPatientTelecom(appointment, 'email');
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const facilityPhone =
    appointment?.vaos.apiData.extension?.clinic?.phoneNumber ||
    facility?.telecom?.find(tele => tele.system === 'covid')?.value ||
    facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const isCC = appointment?.vaos.isCommunityCare;
  const isCCRequest =
    appointment?.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const isCanceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = selectIsPast(appointment);
  const phone = getPatientTelecom(appointment, 'phone');
  const preferredLanguage = appointment?.vaos.apiData.preferredLanguage;
  const preferredTimesForPhoneCall = appointment?.preferredTimesForPhoneCall;
  const provider = appointment?.preferredProviderName;
  const providerAddress = selectProviderAddress(appointment);
  const preferredDates = appointment?.preferredDates;
  const status = appointment?.status;
  const typeOfCare = getTypeOfCareById(appointment?.vaos.apiData.serviceType);
  const typeOfCareName = typeOfCare?.name;
  const preferredModality = appointment?.preferredModality;

  return {
    appointment,
    appointmentDetailsStatus,
    cancelInfo,
    canceled,
    email,
    facility,
    facilityData,
    facilityId,
    facilityPhone,
    isCC,
    isCCRequest,
    isCanceled,
    isPastAppointment,
    phone,
    preferredDates,
    preferredLanguage,
    preferredTimesForPhoneCall,
    provider,
    providerAddress,
    status,
    typeOfCare,
    typeOfCareName,
    preferredModality,
    isCerner,
  };
}
