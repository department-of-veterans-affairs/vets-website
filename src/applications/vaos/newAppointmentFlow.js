import * as Sentry from '@sentry/browser';
import {
  getFormData,
  getNewAppointment,
  getEligibilityStatus,
  vaosCommunityCare,
  getCCEType,
  getClinicsForChosenFacility,
} from './utils/selectors';
import { FACILITY_TYPES, FLOW_TYPES, TYPES_OF_CARE } from './utils/constants';
import {
  getCommunityCare,
  getSystemIdentifiers,
  getLongTermAppointmentHistory,
  getSitesSupportingVAR,
} from './api';
import {
  showTypeOfCareUnavailableModal,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
  updateFacilityType,
  updateCCEnabledSystems,
  updateCCEligibility,
} from './actions/newAppointment';

const AUDIOLOGY = '203';
const SLEEP_CARE = 'SLEEP';
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

function isPodiatry(state) {
  return getFormData(state).typeOfCareId === PODIATRY;
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
      let nextState = 'vaFacility';
      const communityCareEnabled = vaosCommunityCare(state);

      if (isSleepCare(state)) {
        nextState = 'typeOfSleepCare';
      } else if (isCommunityCare(state)) {
        try {
          if (communityCareEnabled) {
            // Check if user registered systems support community care...
            const userSystemIds = await getSystemIdentifiers();
            const ccSites = await getSitesSupportingVAR(userSystemIds);
            const ccEnabledSystems = userSystemIds.filter(id =>
              ccSites.some(site => site.id === id),
            );
            dispatch(updateCCEnabledSystems(ccEnabledSystems));

            // Reroute to VA facility page if none of the user's registered systems support community care.
            if (ccEnabledSystems.length) {
              const response = await getCommunityCare(getCCEType(state));

              dispatch(updateCCEligibility(response.eligible));

              if (response.eligible) {
                // If CC enabled systems and toc is podiatry, skip typeOfFacility
                if (isPodiatry(state)) {
                  dispatch(updateFacilityType(FACILITY_TYPES.COMMUNITY_CARE));
                  return 'requestDateTime';
                }
                return 'typeOfFacility';
              }
            }
          }

          // If no CC enabled systems and toc is podiatry, show modal
          if (isPodiatry(state)) {
            dispatch(showTypeOfCareUnavailableModal());
            return 'typeOfCare';
          }

          dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
          return 'vaFacility';
        } catch (e) {
          Sentry.captureException(e);
          Sentry.captureMessage(
            'Community Care eligibility check failed with errors',
          );
          dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
          return 'vaFacility';
        }
      }

      dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
      return nextState;
    },
    previous: 'home',
  },
  typeOfFacility: {
    url: '/new-appointment/choose-facility-type',
    next(state) {
      if (isCCAudiology(state)) {
        return 'audiologyCareType';
      }

      if (isCCFacility(state)) {
        return 'requestDateTime';
      }

      return 'vaFacility';
    },
    previous: 'typeOfCare',
  },
  typeOfSleepCare: {
    url: '/new-appointment/choose-sleep-care',
    next: 'vaFacility',
    previous: 'typeOfCare',
  },
  audiologyCareType: {
    url: '/new-appointment/audiology',
    next: 'requestDateTime',
    previous: 'typeOfFacility',
  },
  ccPreferences: {
    url: '/new-appointment/community-care-preferences',
    next: 'reasonForAppointment',
    previous: 'requestDateTime',
  },
  vaFacility: {
    url: '/new-appointment/va-facility',
    async next(state, dispatch) {
      const eligibilityStatus = getEligibilityStatus(state);

      if (eligibilityStatus.direct) {
        let appointments = null;

        // If we can't get the history, then continue anyway
        // and we'll show the full clinic list
        try {
          appointments = await getLongTermAppointmentHistory();
        } catch (error) {
          Sentry.captureException(error);
        }

        if (appointments) {
          const clinics = getClinicsForChosenFacility(state);
          const hasMatchingClinics = clinics.some(
            clinic =>
              !!appointments.find(
                appt =>
                  clinic.siteCode === appt.facilityId &&
                  clinic.clinicId === appt.clinicId,
              ),
          );

          if (hasMatchingClinics) {
            dispatch(startDirectScheduleFlow(appointments));
            return 'clinicChoice';
          }
        } else {
          dispatch(startDirectScheduleFlow(appointments));
          return 'clinicChoice';
        }
      }

      if (eligibilityStatus.request) {
        dispatch(startRequestAppointmentFlow());
        return 'requestDateTime';
      }

      throw new Error('Veteran not eligible for direct scheduling or requests');
    },
    previous(state) {
      let nextState = 'typeOfCare';
      const communityCareEnabled = vaosCommunityCare(state);

      if (
        communityCareEnabled &&
        isCCEligible(state) &&
        isCommunityCare(state)
      ) {
        nextState = 'typeOfFacility';
      }

      return nextState;
    },
  },
  clinicChoice: {
    url: '/new-appointment/clinics',
    previous: 'vaFacility',
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

      return 'vaFacility';
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
    previous: 'vaFacility',
  },
  contactInfo: {
    url: '/new-appointment/contact-info',
    next: 'review',
    previous(state) {
      if (isCCFacility(state)) {
        return 'ccPreferences';
      }

      if (getNewAppointment(state).flowType === FLOW_TYPES.DIRECT) {
        return 'reasonForAppointment';
      }

      return 'visitType';
    },
  },
  review: {
    url: '/new-appointment/review',
  },
};
