import { selectCernerFacilityIds } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/cerner-dsot/selectors';
import { createSelector } from 'reselect';
import {
  selectFeatureCancel,
  selectFeatureRequests,
} from '../../redux/selectors';
import {
  getAppointmentTimezone,
  getPatientTelecom,
  getVAAppointmentLocationId,
  groupAppointmentsByMonth,
  isUpcomingAppointment,
  isValidPastAppointment,
  sortByDateAscending,
  sortByDateDescending,
} from '../../services/appointment';
import { getTypeOfCareById } from '../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  FETCH_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../utils/constants';

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
  return state.appointments.facilitySettings?.some(
    facility =>
      facility.services.find(
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

export function selectBackendServiceFailuresInfo(state) {
  const { backendServiceFailures } = state.appointments;
  return {
    pastStatus: state.appointments.pastStatus,
    pendingStatus: state.appointments.pendingStatus,
    futureStatus: selectFutureStatus(state),
    backendServiceFailures,
  };
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

export function selectAppointmentTravelClaim(appointment) {
  return appointment?.vaos?.apiData?.travelPayClaim;
}

export function selectIsEligibleForTravelClaim(appointment) {
  return (
    appointment.isPastAppointment &&
    (appointment.isInPersonVisit || appointment.isClinicVideoAppointment) &&
    selectAppointmentTravelClaim(appointment)
  );
}

export function selectConfirmedAppointmentData(state, appointment) {
  const isCommunityCare = appointment?.vaos?.isCommunityCare;
  const appointmentTypePrefix = isCommunityCare ? 'cc' : 'va';

  const { isVideo } = appointment;
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
  const { typeOfCareName } = appointment;
  const clinicName = appointment?.location?.clinicName;
  const clinicPhysicalLocation = appointment?.location?.clinicPhysicalLocation;
  const clinicPhone = appointment?.location?.clinicPhone;
  const clinicPhoneExtension = appointment?.location?.clinicPhoneExtension;
  const facilityPhone =
    facility?.telecom?.find(tele => tele.system === 'covid')?.value ||
    facility?.telecom?.find(tele => tele.system === 'phone')?.value;

  const duration = appointment?.minutesDuration;
  const { isPhone } = appointment;
  const timeZoneAbbr = selectTimeZoneAbbr(appointment);
  const providerAddress = selectProviderAddress(appointment);
  const { isAtlasVideo } = appointment;
  const { isPastAppointment } = appointment.vaos;
  const videoProviderName = selectVideoProviderName(appointment);
  const videoProviderAddress = selectVideoProviderAddress(appointment);
  const { atlasConfirmationCode } = appointment;
  const { isCanceled } = appointment;
  const isUpcoming = appointment?.vaos?.isUpcomingAppointment;
  const { practitionerName } = appointment;
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
    isCanceledAppointment: isCanceled,
    isBadAppointmentId,
    isCommunityCare,
    isAtlasVideo,
    isPastAppointment,
    isUpcomingAppointment: isUpcoming,
    isVA,
    isVideo,
    isPhone,
    locationId,
    phone,
    practitionerName,
    providerAddress,
    showCancelButton: selectFeatureCancel(state),
    startDate,
    status,
    timeZoneAbbr,
    timezone,
    typeOfCareName,
    videoProviderAddress,
    videoProviderName,
  };
}
export function selectRequestedAppointmentData(state, appointment) {
  const { facilityData } = state?.appointments || [];

  const cancelInfo = getCancelInfo(state);
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const email = getPatientTelecom(appointment, 'email');
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const facilityPhone =
    appointment?.vaos.apiData.extension?.clinic?.phoneNumber ||
    facility?.telecom?.find(tele => tele.system === 'covid')?.value ||
    facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const isCC = appointment?.isCommunityCare;
  const isCCRequest =
    appointment?.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const { isCanceled } = appointment;
  const { isPastAppointment } = appointment.vaos;
  const phone = getPatientTelecom(appointment, 'phone');
  const preferredLanguage = appointment?.vaos.apiData.preferredLanguage;
  const preferredTimesForPhoneCall = appointment?.preferredTimesForPhoneCall;
  const provider = appointment?.preferredProviderName;
  const providerAddress = selectProviderAddress(appointment);
  const preferredDates = appointment?.preferredDates;
  const status = appointment?.status;
  const typeOfCare = getTypeOfCareById(appointment?.vaos.apiData.serviceType);
  const typeOfCareName = typeOfCare?.name;
  const isPendingAppointment = appointment?.isPendingAppointment;

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
  };
}
export function selectRequestedAppointmentDetails(state, id) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  const appointment = selectAppointmentById(state, id, [
    APPOINTMENT_TYPES.request,
    APPOINTMENT_TYPES.ccRequest,
  ]);

  const cancelInfo = getCancelInfo(state);
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const email = getPatientTelecom(appointment, 'email');
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const facilityPhone =
    appointment?.vaos.apiData.extension?.clinic?.phoneNumber ||
    facility?.telecom?.find(tele => tele.system === 'covid')?.value ||
    facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const isCC = appointment?.isCommunityCare;
  const isCCRequest =
    appointment?.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const isCanceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment } = appointment.vaos;
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
  };
}
