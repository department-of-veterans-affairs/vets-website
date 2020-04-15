import * as Sentry from '@sentry/browser';
import { captureError } from './utils/error';

import {
  getFormData,
  getNewAppointment,
  getEligibilityStatus,
  vaosCommunityCare,
  getCCEType,
  getClinicsForChosenFacility,
  getTypeOfCare,
  selectSystemIds,
} from './utils/selectors';
import { FACILITY_TYPES, FLOW_TYPES, TYPES_OF_CARE } from './utils/constants';
import {
  getCommunityCare,
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
import { recordVaosError, recordEligibilityFailure } from './utils/events';

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
      const communityCareEnabled = vaosCommunityCare(state);

      if (isSleepCare(state)) {
        dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
        return 'typeOfSleepCare';
      } else if (isEyeCare(state)) {
        return 'typeOfEyeCare';
      } else if (isCommunityCare(state)) {
        try {
          if (communityCareEnabled) {
            // Check if user registered systems support community care...
            const userSystemIds = selectSystemIds(state);
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
                  dispatch(startRequestAppointmentFlow(true));
                  return 'requestDateTime';
                }
                return 'typeOfFacility';
              }
            }
          }
        } catch (e) {
          captureError(e);
          Sentry.captureMessage(
            'Community Care eligibility check failed with errors',
          );
        }

        // If no CC enabled systems and toc is podiatry, show modal
        if (isPodiatry(state)) {
          dispatch(showTypeOfCareUnavailableModal());
          return 'typeOfCare';
        }
      }

      dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
      return 'vaFacility';
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

      return 'vaFacility';
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
    next: 'vaFacility',
    previous: 'typeOfCare',
  },
  typeOfEyeCare: {
    url: '/new-appointment/choose-eye-care',
    async next(state, dispatch) {
      const data = getFormData(state);
      const communityCareEnabled = vaosCommunityCare(state);

      // check that the result does have a ccId
      if (getTypeOfCare(data)?.ccId !== undefined) {
        try {
          if (communityCareEnabled) {
            // Check if user registered systems support community care...
            const userSystemIds = selectSystemIds(state);
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
                return 'typeOfFacility';
              }
            }
          }
        } catch (e) {
          captureError(e);
          Sentry.captureMessage(
            'Community Care eligibility check failed with errors',
          );
        }
      }

      dispatch(updateFacilityType(FACILITY_TYPES.VAMC));
      return 'vaFacility';
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
    async next(state, dispatch) {
      const eligibilityStatus = getEligibilityStatus(state);

      if (eligibilityStatus.direct) {
        let appointments = null;

        try {
          appointments = await getLongTermAppointmentHistory();
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
          recordEligibilityFailure('direct-no-matching-past-clinics');
        } catch (error) {
          recordVaosError('eligbility-direct-no-matching-past-clinics-error');
          captureError(error);
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
