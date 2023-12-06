import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  selectFeatureBreadcrumbUrlUpdate,
  selectRegisteredCernerFacilityIds,
} from '../redux/selectors';
import {
  getChosenFacilityInfo,
  getFormData,
  getNewAppointment,
  getTypeOfCare,
  selectCommunityCareSupportedSites,
  selectEligibility,
} from './redux/selectors';
import {
  FACILITY_TYPES,
  FLOW_TYPES,
  GA_PREFIX,
  TYPES_OF_CARE,
  COVID_VACCINE_ID,
} from '../utils/constants';
import {
  getSiteIdFromFacilityId,
  isCernerLocation,
} from '../services/location';
import {
  checkEligibility,
  showEligibilityModal,
  showPodiatryAppointmentUnavailableModal,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
  updateFacilityType,
  checkCommunityCareEligibility,
} from './redux/actions';
import { startNewVaccineFlow } from '../appointment-list/redux/actions';

const AUDIOLOGY = '203';
const SLEEP_CARE = 'SLEEP';
const EYE_CARE = 'EYE';
const PODIATRY = 'tbd-podiatry';
const VA_FACILITY_V2_KEY = 'vaFacilityV2';

function isCCAudiology(state) {
  return (
    getFormData(state).facilityType === FACILITY_TYPES.COMMUNITY_CARE &&
    getFormData(state).typeOfCareId === AUDIOLOGY
  );
}

function isCommunityCare(state) {
  return TYPES_OF_CARE.find(
    typeOfCare =>
      typeOfCare.id === getFormData(state).typeOfCareId && typeOfCare.ccId,
  );
}

function isCCFacility(state) {
  return getFormData(state).facilityType === FACILITY_TYPES.COMMUNITY_CARE;
}

function isSleepCare(state) {
  return getFormData(state).typeOfCareId === SLEEP_CARE;
}

function isEyeCare(state) {
  return getFormData(state).typeOfCareId === EYE_CARE;
}

function isPodiatry(state) {
  return getFormData(state).typeOfCareId === PODIATRY;
}

function isCovidVaccine(state) {
  return getFormData(state).typeOfCareId === COVID_VACCINE_ID;
}

async function vaFacilityNext(state, dispatch) {
  let eligibility = selectEligibility(state);

  const location = getChosenFacilityInfo(state);
  const cernerSiteIds = selectRegisteredCernerFacilityIds(state);
  const isCerner = isCernerLocation(location?.id, cernerSiteIds);

  if (isCerner) {
    return 'scheduleCerner';
  }

  // Fetch eligibility if we haven't already
  if (!eligibility) {
    const siteId = getSiteIdFromFacilityId(location.id);

    eligibility = await dispatch(
      checkEligibility({
        location,
        siteId,
        showModal: true,
      }),
    );
  }

  if (eligibility.direct) {
    dispatch(startDirectScheduleFlow());
    return 'clinicChoice';
  }

  if (eligibility.request) {
    dispatch(startRequestAppointmentFlow());
    return 'requestDateTime';
  }

  dispatch(showEligibilityModal());
  return VA_FACILITY_V2_KEY;
}

const flow = {
  home: {
    url: '/',
  },
  typeOfAppointment: {
    url: '/new-appointment',
    // Temporary stub for typeOfAppointment which will eventually be first step
    // Next will direct to type of care or provider once both flows are complete
    next: 'typeOfFacility',
  },
  vaccineFlow: {
    url: '/new-covid-19-vaccine-appointment',
  },
  typeOfCare: {
    url: '/new-appointment',
    async next(state, dispatch) {
      if (isCovidVaccine(state)) {
        recordEvent({
          event: `${GA_PREFIX}-schedule-covid19-button-clicked`,
        });
        dispatch(startNewVaccineFlow());
        return 'vaccineFlow';
      }
      if (isSleepCare(state)) {
        dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
        return 'typeOfSleepCare';
      }
      if (isEyeCare(state)) {
        return 'typeOfEyeCare';
      }
      if (isCommunityCare(state)) {
        const isEligible = await dispatch(checkCommunityCareEligibility());

        if (isEligible && isPodiatry(state)) {
          // If CC enabled systems and toc is podiatry, skip typeOfFacility
          dispatch(updateFacilityType(FACILITY_TYPES.COMMUNITY_CARE));
          dispatch(startRequestAppointmentFlow(true));
          return 'ccRequestDateTime';
        }
        if (isEligible) {
          return 'typeOfFacility';
        }
        if (isPodiatry(state)) {
          // If no CC enabled systems and toc is podiatry, show modal
          dispatch(showPodiatryAppointmentUnavailableModal());
          return 'typeOfCare';
        }
      }

      dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
      return VA_FACILITY_V2_KEY;
    },
  },
  typeOfFacility: {
    url: '/new-appointment/choose-facility-type',
    next(state, dispatch) {
      if (isCCAudiology(state)) {
        return 'audiologyCareType';
      }

      if (isCCFacility(state)) {
        dispatch(startRequestAppointmentFlow(true));
        return 'ccRequestDateTime';
      }

      return VA_FACILITY_V2_KEY;
    },
  },
  typeOfSleepCare: {
    url: '/new-appointment/choose-sleep-care',
    next: VA_FACILITY_V2_KEY,
  },
  typeOfEyeCare: {
    url: '/new-appointment/choose-eye-care',
    async next(state, dispatch) {
      const data = getFormData(state);

      // check that the result does have a ccId
      if (getTypeOfCare(data)?.ccId) {
        const isEligible = await dispatch(checkCommunityCareEligibility());

        if (isEligible) {
          return 'typeOfFacility';
        }
      }

      dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
      return VA_FACILITY_V2_KEY;
    },
  },
  audiologyCareType: {
    url: '/new-appointment/audiology',
    next(state, dispatch) {
      dispatch(startRequestAppointmentFlow(true));
      return 'ccRequestDateTime';
    },
  },
  ccPreferences: {
    url: '/new-appointment/community-care-preferences',
    next: 'ccLanguage',
  },
  ccLanguage: {
    url: '/new-appointment/community-care-language',
    next: 'reasonForAppointment',
  },
  ccClosestCity: {
    url: '/new-appointment/choose-closest-city',
    next: 'ccPreferences',
  },
  vaFacility: {
    url: '/new-appointment/va-facility',
    next: vaFacilityNext,
  },
  vaFacilityV2: {
    url: '/new-appointment/va-facility-2',
    next: vaFacilityNext,
  },
  scheduleCerner: {
    url: '/new-appointment/how-to-schedule',
  },
  clinicChoice: {
    url: '/new-appointment/clinics',
    next(state, dispatch) {
      if (getFormData(state).clinicId === 'NONE') {
        dispatch(startRequestAppointmentFlow());
        return 'requestDateTime';
      }

      // fetch appointment slots
      dispatch(startDirectScheduleFlow());
      return 'preferredDate';
    },
  },
  preferredDate: {
    url: '/new-appointment/preferred-date',
    next: 'selectDateTime',
  },
  selectDateTime: {
    url: '/new-appointment/select-date',
    next: 'reasonForAppointment',
  },
  requestDateTime: {
    url: '/new-appointment/request-date',
    next(state) {
      const supportedSites = selectCommunityCareSupportedSites(state);
      if (isCCFacility(state) && supportedSites.length > 1) {
        return 'ccClosestCity';
      }
      if (isCCFacility(state)) {
        return 'ccPreferences';
      }

      return 'reasonForAppointment';
    },
  },
  reasonForAppointment: {
    url: '/new-appointment/reason-appointment',
    next(state) {
      if (
        isCCFacility(state) ||
        getNewAppointment(state).flowType === FLOW_TYPES.DIRECT
      ) {
        return 'contactInfo';
      }

      return 'visitType';
    },
  },
  visitType: {
    url: '/new-appointment/choose-visit-type',
    next: 'contactInfo',
  },
  appointmentTime: {
    url: '/new-appointment/appointment-time',
    next: 'contactInfo',
  },
  contactInfo: {
    url: '/new-appointment/contact-info',
    next: 'review',
  },
  review: {
    url: '/new-appointment/review',
  },
};

/**
 * Function to get new appointment workflow.
 * The URL displayed in the browser address bar is changed when the feature flag
 * is true.
 *
 * @export
 * @param {boolean} state - New appointment state
 * @returns {object} Appointment workflow object
 */
export default function getNewAppointmentFlow(state) {
  const featureBreadcrumbUrlUpdate = selectFeatureBreadcrumbUrlUpdate(state);

  return {
    ...flow,
    appointmentTime: {
      ...flow.appointmentTime,
      url: featureBreadcrumbUrlUpdate
        ? 'appointment-time'
        : '/new-appointment/appointment-time',
    },
    audiologyCareType: {
      ...flow.audiologyCareType,
      url: featureBreadcrumbUrlUpdate
        ? 'audiology-care'
        : '/new-appointment/audiology',
    },
    ccClosestCity: {
      ...flow.ccClosestCity,
      url: featureBreadcrumbUrlUpdate
        ? 'closest-city'
        : '/new-appointment/choose-closest-city',
    },
    ccLanguage: {
      ...flow.ccLanguage,
      url: featureBreadcrumbUrlUpdate
        ? 'preferred-language'
        : '/new-appointment/community-care-language',
    },
    ccPreferences: {
      ...flow.ccPreferences,
      url: featureBreadcrumbUrlUpdate
        ? 'preferred-provider'
        : '/new-appointment/community-care-preferences',
    },
    clinicChoice: {
      ...flow.clinicChoice,
      url: featureBreadcrumbUrlUpdate
        ? '/schedule/clinic'
        : '/new-appointment/clinics',
    },
    contactInfo: {
      ...flow.contactInfo,
      url: featureBreadcrumbUrlUpdate
        ? 'contact-information'
        : '/new-appointment/contact-info',
    },
    preferredDate: {
      ...flow.preferredDate,
      url: featureBreadcrumbUrlUpdate
        ? 'preferred-date'
        : '/new-appointment/preferred-date',
    },
    reasonForAppointment: {
      ...flow.reasonForAppointment,
      url: featureBreadcrumbUrlUpdate
        ? 'reason'
        : '/new-appointment/reason-appointment',
    },
    requestDateTime: {
      ...flow.requestDateTime,
      url: featureBreadcrumbUrlUpdate
        ? 'va-request/'
        : '/new-appointment/request-date',
    },
    ccRequestDateTime: {
      ...flow.requestDateTime,
      url: featureBreadcrumbUrlUpdate
        ? 'community-request/'
        : '/new-appointment/request-date',
    },
    root: {
      url: featureBreadcrumbUrlUpdate
        ? '/my-health/appointments'
        : '/health-care/schedule-view-va-appointments/appointments/',
    },
    review: {
      ...flow.review,
      url: featureBreadcrumbUrlUpdate ? 'review' : '/new-appointment/review',
    },
    scheduleCerner: {
      ...flow.scheduleCerner,
      url: featureBreadcrumbUrlUpdate
        ? 'how-to-schedule'
        : '/new-appointment/how-to-schedule',
    },
    selectDateTime: {
      ...flow.selectDateTime,
      url: featureBreadcrumbUrlUpdate
        ? 'date-time'
        : '/new-appointment/select-date',
    },
    typeOfAppointment: {
      ...flow.typeOfAppointment,
      url: featureBreadcrumbUrlUpdate ? 'type-of-care' : '/new-appointment',
    },
    typeOfCare: {
      ...flow.typeOfCare,
      url: featureBreadcrumbUrlUpdate
        ? '/schedule/type-of-care'
        : '/new-appointment',
    },
    typeOfEyeCare: {
      ...flow.typeOfEyeCare,
      url: featureBreadcrumbUrlUpdate
        ? 'eye-care'
        : '/new-appointment/choose-eye-care',
    },
    typeOfFacility: {
      ...flow.typeOfFacility,
      url: featureBreadcrumbUrlUpdate
        ? 'facility-type'
        : '/new-appointment/choose-facility-type',
    },
    typeOfSleepCare: {
      ...flow.typeOfSleepCare,
      url: featureBreadcrumbUrlUpdate
        ? 'sleep-care'
        : '/new-appointment/choose-sleep-care',
    },
    vaccineFlow: {
      ...flow.vaccineFlow,
      url: featureBreadcrumbUrlUpdate
        ? // IMPORTANT!!!
          // The trailing slash is needed for going back to the previous page to work properly.
          // The trainling slash indicates that 'new-covid-19-vaccine-appointment' is a parent path
          // with children.
          //
          // Ex. /schedule/new-covid-19-vaccine-appointment/
          //
          // Leaving the '/' off makes '/schedule' the parent.
          'covid-vaccine/'
        : '/new-covid-19-vaccine-appointment',
    },
    vaFacility: {
      ...flow.vaFacility,
      url: featureBreadcrumbUrlUpdate
        ? 'va-facility'
        : '/new-appointment/va-facility',
    },
    vaFacilityV2: {
      ...flow.vaFacilityV2,
      url: featureBreadcrumbUrlUpdate
        ? 'location'
        : '/new-appointment/va-facility-2',
    },
    visitType: {
      ...flow.visitType,
      url: featureBreadcrumbUrlUpdate
        ? 'preferred-method'
        : '/new-appointment/choose-visit-type',
    },
  };
}
