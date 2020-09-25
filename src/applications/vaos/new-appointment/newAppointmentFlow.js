import {
  getFormData,
  getNewAppointment,
  getEligibilityStatus,
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

export default {
  home: {
    url: '/',
  },
  typeOfAppointment: {
    url: '/new-appointment',
    // Temporary stub for typeOfAppointment which will eventually be first step
    // Next will direct to type of care or provider once both flows are complete
    next: 'typeOfFacility',
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
  },
  typeOfSleepCare: {
    url: '/new-appointment/choose-sleep-care',
    next: getFacilityPageKey,
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
  },
  audiologyCareType: {
    url: '/new-appointment/audiology',
    next(state, dispatch) {
      dispatch(startRequestAppointmentFlow(true));
      return 'requestDateTime';
    },
  },
  ccPreferences: {
    url: '/new-appointment/community-care-preferences',
    next: 'reasonForAppointment',
  },
  vaFacility: {
    url: '/new-appointment/va-facility',
    async next(state, dispatch) {
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
    },
  },
  vaFacilityV2: {
    url: '/new-appointment/va-facility-2',
  },
  clinicChoice: {
    url: '/new-appointment/clinics',
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
  },
  selectDateTime: {
    url: '/new-appointment/select-date',
    next: 'reasonForAppointment',
  },
  requestDateTime: {
    url: '/new-appointment/request-date',
    next(state) {
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
