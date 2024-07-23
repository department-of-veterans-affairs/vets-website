import { createSelector } from 'reselect';
import { selectIsCernerOnlyPatient } from 'platform/user/cerner-dsot/selectors';
import moment from 'moment';
import { selectCernerFacilityIds } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { lowerCase } from 'lodash';
import {
  FETCH_STATUS,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  COMP_AND_PEN,
} from '../../utils/constants';
import {
  getVAAppointmentLocationId,
  isUpcomingAppointmentOrRequest,
  isValidPastAppointment,
  sortByDateDescending,
  sortByDateAscending,
  sortUpcoming,
  groupAppointmentsByMonth,
  isUpcomingAppointment,
  sortByCreatedDateDescending,
  isPendingOrCancelledRequest,
  getAppointmentTimezone,
  isClinicVideoAppointment,
  getPatientTelecom,
} from '../../services/appointment';
import {
  selectFeatureRequests,
  selectFeatureCancel,
  selectFeatureVAOSServiceVAAppointments,
  selectFeatureVAOSServiceCCAppointments,
} from '../../redux/selectors';
import { TYPE_OF_CARE_ID as VACCINE_TYPE_OF_CARE_ID } from '../../covid-19-vaccine/utils';
import { getTypeOfCareById } from '../../utils/appointment';
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

export const selectFutureAppointments = createSelector(
  state => state.appointments.pending,
  state => state.appointments.confirmed,
  (pending, confirmed) => {
    if (!confirmed || !pending) {
      return null;
    }

    return confirmed
      .concat(...pending)
      .filter(isUpcomingAppointmentOrRequest)
      .sort(sortUpcoming);
  },
);

export const selectUpcomingAppointments = createSelector(
  state => state.appointments.confirmed,
  confirmed => {
    if (!confirmed) {
      return null;
    }

    const sortedAppointments = confirmed
      .filter(isUpcomingAppointment)
      .sort(sortByDateAscending);

    return groupAppointmentsByMonth(sortedAppointments);
  },
);

export const selectPendingAppointments = createSelector(
  state => state.appointments.pending,
  pending =>
    pending
      ?.filter(isPendingOrCancelledRequest)
      .sort(sortByCreatedDateDescending) || null,
);

export const selectPastAppointments = createSelector(
  state => state.appointments.past,
  past => {
    return past?.filter(isValidPastAppointment).sort(sortByDateDescending);
  },
);

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

      const sortedAppointments = past
        .filter(isValidPastAppointment)
        .sort(sortByDateDescending);

      return groupAppointmentsByMonth(sortedAppointments);
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
  return state.appointments.facilitySettings?.some(
    facility =>
      facility.services.find(service => service.id === VACCINE_TYPE_OF_CARE_ID)
        ?.direct.enabled,
  );
}

export function selectAppointmentDetails(appointment) {
  if (!appointment) return '';

  if (appointment.version === 2) {
    return appointment.comment ? appointment.comment : 'none';
  }

  const { comment } = appointment;
  if (appointment.vaos.isCommunityCare) {
    return comment || 'none';
  }
  return appointment.reason && comment
    ? `${appointment.reason}: ${comment}`
    : comment || (appointment.reason ? appointment.reason : null);
}

export function selectProviderAddress(appointment) {
  const practitioners = appointment?.practitioners || [];
  return practitioners.length > 0 ? practitioners[0].address : null;
}

export function selectComment(appointment) {
  if (!appointment) return '';

  if (appointment.version === 2) {
    return appointment.comment ? appointment.comment : 'none';
  }

  const { comment } = appointment;
  if (appointment.vaos.isCommunityCare) {
    return comment || 'none';
  }
  return appointment.reason && comment
    ? `${appointment.reason}: ${comment}`
    : comment || (appointment.reason ? appointment.reason : null);
}

export function getRequestedAppointmentListInfo(state) {
  return {
    facilityData: state.appointments.facilityData,
    pendingStatus: state.appointments.pendingStatus,
    pendingAppointments: selectPendingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}

export function getUpcomingAppointmentListInfo(state) {
  return {
    facilityData: state.appointments.facilityData,
    futureStatus: state.appointments.confirmedStatus,
    appointmentsByMonth: selectUpcomingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
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
  return name;
}

export function selectIsPhone(appointment) {
  return appointment?.vaos?.isPhoneAppointment;
}

export function selectTimeZoneAbbr(appointment) {
  const { abbreviation } = getAppointmentTimezone(appointment);
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
  const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
    state,
  );
  return {
    appointment: selectAppointmentById(state, id, [
      APPOINTMENT_TYPES.ccAppointment,
    ]),
    appointmentDetailsStatus,
    facilityData,
    useV2: featureVAOSServiceCCAppointments,
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
  if (
    appointment.vaos.appointmentType === APPOINTMENT_TYPES.request ||
    appointment.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest
  ) {
    return moment(appointment.requestedPeriod[0].start);
  }

  return moment(appointment.start);
}

export function selectIsCanceled(appointment) {
  return appointment?.status === APPOINTMENT_STATUS.cancelled;
}

export function selectIsCommunityCare(appointment) {
  return appointment.vaos.isCommunityCare;
}

export function selectIsVideo(appointment) {
  return appointment.vaos.isVideo;
}

export function selectIsInPerson(appointment) {
  return (
    !selectIsVideo(appointment) &&
    !selectIsCommunityCare(appointment) &&
    !selectIsPhone(appointment)
  );
}

export function selectPractitionerName(appointment) {
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
  let { practitioners } = appointment;
  practitioners = practitioners.map(practitioner => {
    const { name = { given: '', family: '' } } = practitioner;
    return `${name.given.toString().replaceAll(',', ' ')} ${name.family}`;
  });

  return practitioners.length > 0 ? practitioners[0] : '';
}

export function selectIsPending(appointment) {
  return (
    appointment.status === APPOINTMENT_STATUS.proposed ||
    appointment.status === APPOINTMENT_STATUS.pending
  );
}

export function selectIsPast(appointment) {
  if (appointment) {
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
  const isInPerson = selectIsInPerson(appointment);

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

export function selectIsClinicVideo(appointment) {
  return isClinicVideoAppointment(appointment);
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

export function selectIsAtlasVideo(appointment) {
  const { isAtlas } = appointment?.videoData || {};
  return isAtlas;
}

export function selectIsGFEVideo(appointment) {
  const { kind } = appointment?.videoData || {};
  return kind === VIDEO_TYPES.gfe;
}

export function selectIsHomeVideo(appointment) {
  return (
    selectIsVideo(appointment) &&
    (!selectIsClinicVideo(appointment) &&
      !selectIsAtlasVideo(appointment) &&
      !selectIsGFEVideo(appointment))
  );
}

export function selectModalityText(appointment, isPendingAppointment = false) {
  const isCommunityCare = selectIsCommunityCare(appointment);
  const isInPerson = selectIsInPerson(appointment);
  const isPhone = selectIsPhone(appointment);
  const isVideoAtlas = selectIsAtlasVideo(appointment);
  const isVideoClinic = selectIsClinicVideo(appointment);
  const isVideoHome = selectIsHomeVideo(appointment);
  const isVideoVADevice = selectIsGFEVideo(appointment);
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

    if (isVideoHome || isVideoVADevice) return 'Video';
  }

  if (isInPerson || isVideoClinic) {
    return facilityName ? `At ${facilityName}` : 'At VA facility';
  }

  if (isPhone) return 'Phone';
  if (isCommunityCare) return 'Community care';
  // if (facilityName) return `At ${facilityName}`;

  return '';
}

export function selectApptDetailAriaText(appointment, isRequest = false) {
  const appointmentDate = selectStartDate(appointment);
  const isCanceled = selectIsCanceled(appointment);
  const isCommunityCare = selectIsCommunityCare(appointment);
  const isPhone = selectIsPhone(appointment);
  const isVideo = selectIsVideo(appointment);
  const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(appointment));
  const typeOfCareName = selectTypeOfCareName(appointment);
  const modalityText = selectModalityText(appointment);
  const fillin1 = isCanceled ? `Details for canceled` : 'Details for';
  let fillin2 =
    typeOfCareName && typeof typeOfCareName !== 'undefined'
      ? `${typeOfCareName} appointment on`
      : 'appointment on';
  const fillin3 = appointmentDate.format(
    `dddd, MMMM D h:mm a, [${timezoneName}]`,
  );

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

  let modality = 'in-person';
  if (isCommunityCare) modality = 'community care';
  if (isPhone) modality = 'phone';
  if (isVideo) modality = 'video';

  return `${fillin1} ${modality} ${fillin2} ${fillin3}`;
}
export function selectApptDateAriaText(appointment) {
  const appointmentDate = selectStartDate(appointment);
  const isCanceled = selectIsCanceled(appointment);
  const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(appointment));
  return `${
    isCanceled ? 'canceled ' : ''
  } appointment on ${appointmentDate.format(
    `dddd, MMMM D h:mm a, [${timezoneName}]`,
  )}`;
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
  const isInPerson = selectIsInPerson(appointment);
  const isPhone = selectIsPhone(appointment);
  const isVideoAtlas = selectIsAtlasVideo(appointment);
  const isVideoClinic = selectIsClinicVideo(appointment);
  const isVideoHome = selectIsHomeVideo(appointment);
  const isVideoVADevice = selectIsGFEVideo(appointment);

  let icon = '';

  if (isInPerson || isVideoAtlas || isVideoClinic) icon = 'location_city';
  if (isVideoHome || isVideoVADevice) icon = 'videocam';
  if (isPhone) icon = 'phone';

  return icon;
}

export function selectAppointmentType(appointment) {
  return appointment?.vaos.appointmentType;
}

export function selectAtlasConfirmationCode(appointment) {
  return appointment?.videoData?.atlasConfirmationCode;
}

export function selectConfirmedAppointmentData(state, appointment) {
  const comment = selectComment(appointment);
  const isCommunityCare = appointment?.vaos?.isCommunityCare;
  const appointmentTypePrefix = isCommunityCare ? 'cc' : 'va';

  const isVideo = appointment?.vaos?.isVideo;
  const isVA = !isVideo && !isCommunityCare;

  const locationId = getVAAppointmentLocationId(appointment);

  const { appointmentDetailsStatus, facilityData } = state.appointments;
  const facility =
    facilityData?.[locationId] || appointment?.vaos?.facilityData;

  const phone = getPatientTelecom(appointment, 'phone');
  const ccProvider = selectCCProvider(appointment);
  const startDate = moment.parseZone(appointment?.start);
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
  const bookingNotes = selectAppointmentDetails(appointment);
  const isPhone = selectIsPhone(appointment);
  const timeZoneAbbr = selectTimeZoneAbbr(appointment);
  const providerAddress = selectProviderAddress(appointment);
  const isAtlasVideo = selectIsAtlasVideo(appointment);
  const isPastAppointment = selectIsPast(appointment);
  const videoProviderName = selectVideoProviderName(appointment);
  const videoProviderAddress = selectVideoProviderAddress(appointment);
  const atlasConfirmationCode = selectAtlasConfirmationCode(appointment);
  const isCanceledAppointment = selectIsCanceled(appointment);
  const isUpcoming = appointment?.vaos?.isUpcomingAppointment;

  return {
    appointment,
    appointmentDetailsStatus,
    appointmentTypePrefix,
    atlasConfirmationCode,
    bookingNotes,
    cancelInfo: getCancelInfo(state),
    ccProvider,
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    clinicPhysicalLocation,
    comment,
    duration,
    facility,
    facilityData,
    facilityPhone,
    isCanceledAppointment,
    isCommunityCare,
    isAtlasVideo,
    isPastAppointment,
    isUpcomingAppointment: isUpcoming,
    isVA,
    isVideo,
    isPhone,
    locationId,
    phone,
    providerAddress,
    showCancelButton: selectFeatureCancel(state),
    startDate,
    status,
    timeZoneAbbr,
    typeOfCareName,
    videoProviderAddress,
    videoProviderName,
  };
}
export function getConfirmedAppointmentDetailsInfo(state, id) {
  const appointment = selectAppointmentById(state, id);
  const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
    state,
  );
  return {
    ...selectConfirmedAppointmentData(state, appointment),
    useV2: featureVAOSServiceVAAppointments,
  };
}
export function selectRequestedAppointmentData(state, appointment) {
  const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
    state,
  );
  const { facilityData } = state?.appointments || [];

  const bookingNotes = selectAppointmentDetails(appointment);
  const cancelInfo = getCancelInfo(state);
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const comment = selectComment(appointment);
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
  const provider = featureVAOSServiceCCAppointments
    ? appointment?.preferredProviderName
    : appointment?.preferredCommunityCareProviders?.[0];
  const providerAddress = selectProviderAddress(appointment);
  const preferredDates = appointment?.preferredDates;
  const status = appointment?.status;
  const typeOfCare = getTypeOfCareById(appointment?.vaos.apiData.serviceType);
  const typeOfCareName = typeOfCare?.name;
  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);
  const typeOfVisit = appointment?.requestVisitType;
  const isPendingAppointment = selectIsPendingAppointment(appointment);

  return {
    appointment,
    bookingNotes,
    cancelInfo,
    canceled,
    comment,
    email,
    facility,
    facilityData,
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
    typeOfCareText,
    typeOfVisit,
  };
}
export function selectRequestedAppointmentDetails(state, id) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
    state,
  );
  const appointment = selectAppointmentById(state, id, [
    APPOINTMENT_TYPES.request,
    APPOINTMENT_TYPES.ccRequest,
  ]);

  const bookingNotes = selectAppointmentDetails(appointment);
  const cancelInfo = getCancelInfo(state);
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const comment = selectComment(appointment);
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
  const provider = featureVAOSServiceCCAppointments
    ? appointment?.preferredProviderName
    : appointment?.preferredCommunityCareProviders?.[0];
  const providerAddress = selectProviderAddress(appointment);
  const preferredDates = appointment?.preferredDates;
  const status = appointment?.status;
  const typeOfCare = getTypeOfCareById(appointment?.vaos.apiData.serviceType);
  const typeOfCareName = typeOfCare?.name;
  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);
  const typeOfVisit = appointment?.requestVisitType;

  return {
    appointment,
    appointmentDetailsStatus,
    bookingNotes,
    cancelInfo,
    canceled,
    comment,
    email,
    facility,
    facilityData,
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
    typeOfCareText,
    typeOfVisit,
  };
}
