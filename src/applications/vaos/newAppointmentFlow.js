import {
  getFormData,
  getEligibilityStatus,
  getClinicsForChosenFacility,
} from './utils/selectors';
import { getPastAppointments } from './api';

import { CANCELLED_APPOINTMENT_SET } from './utils/constants';

const AUDIOLOGY = '203';
const SLEEP_CARE = 'SLEEP';

function isCCAudiology(state) {
  return (
    getFormData(state).facilityType === 'communityCare' &&
    getFormData(state).typeOfCareId === AUDIOLOGY
  );
}

function buildApptHash(pastAppointments) {
  return pastAppointments
    .filter(
      appt =>
        appt.clinicId &&
        !CANCELLED_APPOINTMENT_SET.has(
          appt.vdsAppointments?.[0].currentStatus || 'FUTURE',
        ),
    )
    .reduce(
      (map, next) => ({
        ...map,
        [next.clinicId]: (map[next.clinicId] || 0) + 1,
      }),
      {},
    );
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
    next(state) {
      if (getFormData(state).typeOfCareId === SLEEP_CARE) {
        return 'typeOfSleepCare';
      }
      return 'typeOfFacility';
    },

    // async next(state) {
    //   try {
    //     const data = await apiRequest('/vaos/community-care/eligibility');
    //
    //     if (isAllowedTypeOfCare(state) && isEligible(data.eligibility)) {
    //       return 'typeOfFacility';
    //     }
    //
    //     return 'vaLocation';
    //   } catch (e) {
    //     return 'vaLocation';
    //   }
    // },
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

      if (eligibilityStatus.direct) {
        const appointments = await getPastAppointments();
        const apptHash = buildApptHash(appointments);

        if (clinics.some(clinic => !!apptHash[clinic.clinicId])) {
          dispatch({
            type: 'START_DIRECT_SCHEDULE_FLOW',
            appointments,
            apptHash,
          });

          return 'clinicChoice';
        }
      }

      if (eligibilityStatus.request) {
        return 'reasonForAppointment';
      }

      throw new Error('Veteran not eligible for direct scheduling or requests');
    },
    // TODO: If user is not CC eligible, return to page prior to typeOfFacility
    previous: 'typeOfFacility',
  },
  reasonForAppointment: {
    url: '/new-appointment/reason-appointment',
    next: 'visitType',
    previous: 'vaFacility',
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
