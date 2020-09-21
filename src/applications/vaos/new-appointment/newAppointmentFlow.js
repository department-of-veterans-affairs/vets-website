import {
  getFormData,
  getNewAppointment,
  getEligibilityStatus,
  vaosCommunityCare,
  getTypeOfCare,
  vaosFlatFacilityPage,
} from '../utils/selectors';
import { FACILITY_TYPES, FLOW_TYPES, TYPES_OF_CARE } from '../utils/constants';
import {
  showTypeOfCareUnavailableModal,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
  updateFacilityType,
  checkCommunityCareEligibility,
} from './redux/actions';

const AUDIOLOGY = '203';
const SLEEP_CARE = 'SLEEP';
const EYE_CARE = 'EYE';
const PODIATRY = 'tbd-podiatry';

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

function isCCEligible(state) {
  return getNewAppointment(state).isCCEligible;
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

function getFacilityPageKey(state) {
  return vaosFlatFacilityPage(state) ? 'vaFacilityV2' : 'vaFacility';
}

async function vaFacilityNext(state, dispatch) {
  const eligibilityStatus = getEligibilityStatus(state);

  if (eligibilityStatus.direct) {
    dispatch(startDirectScheduleFlow());
    return 'clinicChoice';
  }

  if (eligibilityStatus.request) {
    dispatch(startRequestAppointmentFlow());
    return 'requestDateTime';
  }

  throw new Error('Veteran not eligible for direct scheduling or requests');
}

function vaFacilityPrevious(state) {
  let nextState = 'typeOfCare';
  const communityCareEnabled = vaosCommunityCare(state);

  if (isSleepCare(state)) {
    nextState = 'typeOfSleepCare';
  } else if (
    communityCareEnabled &&
    isCCEligible(state) &&
    getTypeOfCare(getFormData(state))?.ccId !== undefined
  ) {
    nextState = 'typeOfFacility';
  } else if (isEyeCare(state)) {
    nextState = 'typeOfEyeCare';
  }

  return nextState;
}

export default {
  home: {
    url: '/',
  },
  typeOfAppointment: {
    url: '/new-appointment',
    // Temporary stub for typeOfAppointment which will eventually be first step
    // Next will direct to type of care or provider once both flows are complete
    next: 'typeOfFacility',
    previous: 'home',
  },
  typeOfCare: {
    url: '/new-appointment',
    async next(state, dispatch) {
      if (isSleepCare(state)) {
        dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
        return 'typeOfSleepCare';
      } else if (isEyeCare(state)) {
        return 'typeOfEyeCare';
      } else if (isCommunityCare(state)) {
        const isEligible = await dispatch(checkCommunityCareEligibility());

        if (isEligible && isPodiatry(state)) {
          // If CC enabled systems and toc is podiatry, skip typeOfFacility
          dispatch(updateFacilityType(FACILITY_TYPES.COMMUNITY_CARE));
          dispatch(startRequestAppointmentFlow(true));
          return 'requestDateTime';
        } else if (isEligible) {
          return 'typeOfFacility';
        } else if (isPodiatry(state)) {
          // If no CC enabled systems and toc is podiatry, show modal
          dispatch(showTypeOfCareUnavailableModal());
          return 'typeOfCare';
        }
      }

      dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
      return getFacilityPageKey(state);
    },
    previous: 'home',
  },
  typeOfFacility: {
    url: '/new-appointment/choose-facility-type',
    next(state, dispatch) {
      if (isCCAudiology(state)) {
        return 'audiologyCareType';
      }

      if (isCCFacility(state)) {
        dispatch(startRequestAppointmentFlow(true));
        return 'requestDateTime';
      }

      return getFacilityPageKey(state);
    },
    previous(state) {
      //  check for eye care flow
      if (isEyeCare(state)) {
        return 'typeOfEyeCare';
      }

      return 'typeOfCare';
    },
  },
  typeOfSleepCare: {
    url: '/new-appointment/choose-sleep-care',
    async next(state) {
      return getFacilityPageKey(state);
    },
    previous: 'typeOfCare',
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
      return getFacilityPageKey(state);
    },
    previous: 'typeOfCare',
  },
  audiologyCareType: {
    url: '/new-appointment/audiology',
    next(state, dispatch) {
      dispatch(startRequestAppointmentFlow(true));
      return 'requestDateTime';
    },
    previous: 'typeOfFacility',
  },
  ccPreferences: {
    url: '/new-appointment/community-care-preferences',
    next: 'reasonForAppointment',
    previous: 'requestDateTime',
  },
  vaFacility: {
    url: '/new-appointment/va-facility',
    next: vaFacilityNext,
    previous: vaFacilityPrevious,
  },
  vaFacilityV2: {
    url: '/new-appointment/va-facility-2',
    next: vaFacilityNext,
    previous: vaFacilityPrevious,
  },
  clinicChoice: {
    url: '/new-appointment/clinics',
    previous(state) {
      return getFacilityPageKey(state);
    },
    next(state, dispatch) {
      if (getFormData(state).clinicId === 'NONE') {
        dispatch(startRequestAppointmentFlow());
        return 'requestDateTime';
      }

      // fetch appointment slots
      return 'preferredDate';
    },
  },
  preferredDate: {
    url: '/new-appointment/preferred-date',
    next: 'selectDateTime',
    previous: 'clinicChoice',
  },
  selectDateTime: {
    url: '/new-appointment/select-date',
    next: 'reasonForAppointment',
    previous: 'preferredDate',
  },
  requestDateTime: {
    url: '/new-appointment/request-date',
    next(state) {
      if (isCCFacility(state)) {
        return 'ccPreferences';
      }

      return 'reasonForAppointment';
    },
    previous(state) {
      if (isPodiatry(state)) {
        return 'typeOfCare';
      }

      if (isCCFacility(state)) {
        if (isCCAudiology(state)) {
          return 'audiologyCareType';
        }
        return 'typeOfFacility';
      }

      return getFacilityPageKey(state);
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
    previous(state) {
      if (isCCFacility(state)) {
        return 'ccPreferences';
      }

      if (getNewAppointment(state).flowType === FLOW_TYPES.DIRECT) {
        return 'selectDateTime';
      }

      return 'requestDateTime';
    },
  },
  visitType: {
    url: '/new-appointment/choose-visit-type',
    previous: 'reasonForAppointment',
    next: 'contactInfo',
  },
  appointmentTime: {
    url: '/new-appointment/appointment-time',
    next: 'contactInfo',
    previous(state) {
      return getFacilityPageKey(state);
    },
  },
  contactInfo: {
    url: '/new-appointment/contact-info',
    next: 'review',
    previous(state) {
      if (
        isCCFacility(state) ||
        getNewAppointment(state).flowType === FLOW_TYPES.DIRECT
      ) {
        return 'reasonForAppointment';
      }

      return 'visitType';
    },
  },
  review: {
    url: '/new-appointment/review',
  },
};
