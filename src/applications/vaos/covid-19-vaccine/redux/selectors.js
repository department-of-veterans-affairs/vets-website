import { parseISO } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { selectCanUseVaccineFlow } from '../../appointment-list/redux/selectors';
import { getSiteIdFromFacilityId } from '../../services/location';
import {
  DATE_FORMATS,
  FETCH_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../utils/constants';
import {
  getTimezoneByFacilityId,
  getTimezoneDescByFacilityId,
} from '../../utils/timezone';
import { selectFeatureUseVpg } from '../../redux/selectors';

function selectCovid19Vaccine(state) {
  return state.covid19Vaccine;
}

export function selectCovid19VaccineNewBooking(state) {
  return selectCovid19Vaccine(state).newBooking;
}

export function selectCovid19VaccineFormData(state) {
  return selectCovid19VaccineNewBooking(state).data;
}

export function selectPageChangeInProgress(state) {
  return selectCovid19VaccineNewBooking(state).pageChangeInProgress;
}

export function getCovid19VaccineFormPageInfo(state, pageKey) {
  const newBooking = selectCovid19VaccineNewBooking(state);
  return {
    schema: newBooking.pages[pageKey],
    data: newBooking.data,
    pageChangeInProgress: newBooking.pageChangeInProgress,
  };
}

function getSiteIdForChosenFacility(state) {
  return getSiteIdFromFacilityId(
    selectCovid19VaccineFormData(state).vaFacility,
  );
}

export function getChosenSlot(state) {
  const { availableSlots } = selectCovid19VaccineNewBooking(state);
  const selectedTime = selectCovid19VaccineFormData(state).date1?.[0];

  // Convert to UTC since slots are in UTC.
  return availableSlots?.find(
    slot =>
      slot.start ===
      formatInTimeZone(
        parseISO(selectedTime),
        'UTC',
        DATE_FORMATS.ISODateTimeUTC,
      ),
  );
}

function getChosenFacilityInfo(state) {
  return (
    selectCovid19VaccineNewBooking(state).facilities?.find(
      facility =>
        facility.id === selectCovid19VaccineFormData(state).vaFacility,
    ) || null
  );
}

export function getDateTimeSelect(state, pageKey) {
  const newBooking = selectCovid19VaccineNewBooking(state);
  const { appointmentSlotsStatus } = newBooking;
  const data = selectCovid19VaccineFormData(state);
  const formInfo = getCovid19VaccineFormPageInfo(state, pageKey);
  let { availableSlots } = newBooking;

  const timezoneDescription = getTimezoneDescByFacilityId(data.vaFacility);
  const timezone = getTimezoneByFacilityId(data.vaFacility);

  if (availableSlots && availableSlots.length > 0) {
    availableSlots = availableSlots.map(element => {
      return {
        ...element,
        start: formatInTimeZone(
          toDate(element.start),
          timezone,
          DATE_FORMATS.ISODateTimeLocal,
        ),
        end: formatInTimeZone(
          toDate(element.end),
          timezone,
          DATE_FORMATS.ISODateTimeLocal,
        ),
      };
    });
  }

  return {
    ...formInfo,
    availableSlots,
    facilityId: data.vaFacility,
    selectedFacility: getChosenFacilityInfo(state),
    appointmentSlotsStatus,
    preferredDate: data.preferredDate,
    timezone,
    timezoneDescription,
  };
}

export function getFacilityPageInfo(state) {
  const formInfo = getCovid19VaccineFormPageInfo(state, 'vaFacility');
  const data = selectCovid19VaccineFormData(state);
  const newBooking = selectCovid19VaccineNewBooking(state);
  const featureUseVpg = selectFeatureUseVpg(state);

  const {
    facilities,
    facilitiesStatus,
    facilityPageSortMethod,
    requestLocationStatus,
    showEligibilityModal,
    clinics,
    clinicsStatus,
  } = newBooking;

  const supportedFacilities = facilities?.filter(
    facility =>
      featureUseVpg
        ? facility.legacyVAR.settings[TYPE_OF_CARE_IDS.COVID_VACCINE_ID]
            ?.bookedAppointments
        : facility.legacyVAR.settings[TYPE_OF_CARE_IDS.COVID_VACCINE_ID]?.direct
            .enabled,
  );

  return {
    ...formInfo,
    address: selectVAPResidentialAddress(state),
    canScheduleAtChosenFacility: !!clinics[data.vaFacility]?.length,
    facilitiesStatus,
    clinicsStatus,
    noValidVAFacilities:
      facilitiesStatus === FETCH_STATUS.succeeded &&
      !supportedFacilities?.length,
    requestLocationStatus,
    selectedFacility: getChosenFacilityInfo(state),
    singleValidVALocation:
      supportedFacilities?.length === 1 && !!data.vaFacility,
    showEligibilityModal,
    sortMethod: facilityPageSortMethod,
    supportedFacilities,
    initialData: data,
  };
}

export function getClinicPageInfo(state, pageKey) {
  const formPageInfo = getCovid19VaccineFormPageInfo(state, pageKey);
  const newBooking = selectCovid19VaccineNewBooking(state);
  const { facilities } = newBooking;

  return {
    ...formPageInfo,
    facilityDetails: facilities?.find(
      facility => facility.id === formPageInfo.data.vaFacility,
    ),
  };
}

export function getChosenClinicInfo(state) {
  const data = selectCovid19VaccineFormData(state);
  const { clinics } = selectCovid19VaccineNewBooking(state);

  return (
    clinics[data.vaFacility]?.find(clinic => clinic.id === data.clinicId) ||
    null
  );
}

export function getReviewPage(state) {
  return {
    data: selectCovid19VaccineFormData(state),
    facility: getChosenFacilityInfo(state),
    facilityDetails: getChosenFacilityInfo(state),
    clinic: getChosenClinicInfo(state),
    submitStatus: selectCovid19Vaccine(state).submitStatus,
    submitStatusVaos400: selectCovid19Vaccine(state).submitStatusVaos400,
    systemId: getSiteIdForChosenFacility(state),
  };
}

export function selectContactFacilitiesPageInfo(state) {
  const newBooking = selectCovid19VaccineNewBooking(state);

  const { facilities, facilitiesStatus } = newBooking;

  return {
    facilities,
    facilitiesStatus,
    sortMethod: newBooking.facilityPageSortMethod,
    canUseVaccineFlow: selectCanUseVaccineFlow(state),
  };
}
