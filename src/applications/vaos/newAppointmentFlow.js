import {
  getFormData,
  getEligibilityStatus,
  getClinicsForChosenFacility,
} from './utils/selectors';
import { TYPES_OF_CARE } from './utils/constants';
import { getCommunityCare, getPastAppointments } from './api';
import { hasEligibleClinics } from './utils/eligibility';

const AUDIOLOGY = '203';
const SLEEP_CARE = 'SLEEP';

function isCCAudiology(state) {
  return (
    getFormData(state).facilityType === 'communityCare' &&
    getFormData(state).typeOfCareId === AUDIOLOGY
  );
}

function isCommunityCare(state) {
  return TYPES_OF_CARE.find(
    typeOfCare =>
      typeOfCare.id === getFormData(state).typeOfCareId && typeOfCare.ccId,
  );
}

function isSleepCare(state) {
  return getFormData(state).typeOfCareId === SLEEP_CARE;
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
    async next(state) {
      let nextState = 'vaFacility';

      if (isSleepCare(state)) {
        nextState = 'typeOfSleepCare';
      } else if (isCommunityCare(state)) {
        try {
          const data = await getCommunityCare(
            '/vaos/community-care/eligibility',
          );

          if (data.isEligible) {
            nextState = 'typeOfFacility';
          }
        } catch (e) {
          return 'vaFacility';
        }
      }

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

      if (getFormData(state).facilityType === 'communityCare') {
        return 'ccProvider';
      }

      return 'vaFacility';
    },
    previous: 'typeOfCare',
  },
  typeOfSleepCare: {
    url: '/new-appointment/choose-sleep-care',
    next: 'typeOfFacility',
    previous: 'typeOfCare',
  },
  audiologyCareType: {
    url: '/new-appointment/audiology',
    next: 'ccProvider',
    previous: 'typeOfFacility',
  },
  ccProvider: {
    url: '/new-appointment/community-care-provider',
    next: 'ccPreferences',
    previous(state) {
      if (isCCAudiology(state)) {
        return 'audiologyCareType';
      }

      return 'typeOfFacility';
    },
  },
  ccPreferences: {
    url: '/new-appointment/community-care-preferences',
    next: 'contactInfo',
    previous: 'ccProvider',
  },
  vaFacility: {
    url: '/new-appointment/va-facility',
    async next(state, dispatch) {
      const eligibilityStatus = getEligibilityStatus(state);
      const clinics = getClinicsForChosenFacility(state);
      const facilityId = getFormData(state).vaFacility;

      if (eligibilityStatus.direct) {
        const appointments = await getPastAppointments();

        if (hasEligibleClinics(facilityId, appointments, clinics)) {
          dispatch({
            type: 'newAppointment/START_DIRECT_SCHEDULE_FLOW',
            appointments,
          });

          return 'clinicChoice';
        }
      }

      if (eligibilityStatus.request) {
        return 'requestDateTime';
      }

      throw new Error('Veteran not eligible for direct scheduling or requests');
    },
    // TODO: If user is not CC eligible, return to page prior to typeOfFacility
    previous(state) {
      let nextState = 'typeOfCare';

      if (getFormData(state).facilityType) {
        nextState = 'typeOfFacility';
      }
      return nextState;
    },
  },
  clinicChoice: {
    url: '/new-appointment/clinics',
    previous: 'vaFacility',
    next(state) {
      if (getFormData(state).clinicId === 'NONE') {
        // When there's an appointment time page, go there instead
        return 'reasonForAppointment';
      }

      // fetch appointment slots

      return 'selectDateTime';
    },
  },
  selectDateTime: {
    url: '/new-appointment/select-date',
    next: 'reasonForAppointment',
    previous: 'clinicChoice',
  },
  requestDateTime: {
    url: '/new-appointment/request-date',
    next: 'reasonForAppointment',
    previous: 'vaFacility',
  },
  reasonForAppointment: {
    url: '/new-appointment/reason-appointment',
    next: 'visitType',
    previous(state) {
      if (getFormData(state).clinicId) {
        return 'clinicChoice';
      }

      return 'vaFacility';
    },
  },
  visitType: {
    url: '/new-appointment/choose-visit-type',
    previous: 'reasonForAppointment',
    // Update this when reasonForAppointment is merged
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
      if (getFormData(state).facilityType === 'communityCare') {
        return 'ccProvider';
      }

      return 'visitType';
    },
  },
  review: {
    url: '/new-appointment/review',
  },
};
