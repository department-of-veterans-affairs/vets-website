import {
  getFormData,
  getChosenFacilityInfo,
  getTypeOfCare,
} from './utils/selectors';

import mockClinicList from './actions/clinicList983.json';
import mockPastAppts from './actions/pastAppointments983.json';

const AUDIOLOGY = '203';
const DISABLED_LIMIT_VALUE = 0;

function isCCAudiology(state) {
  return (
    getFormData(state).facilityType === 'communityCare' &&
    getFormData(state).typeOfCareId === AUDIOLOGY
  );
}

function mockFetchPastVisits(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        durationInMonths: 24,
        hasVisitedInPastMonths: url.includes('984'),
      });
    }, 500);
  });
}

function mockFetchRequestLimit(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        requestLimit: 1,
        numberOfRequests: url.includes('984') ? 1 : 0,
      });
    }, 500);
  });
}

function mockFetchClinics(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (url.includes('983')) {
        resolve(mockClinicList);
      } else {
        resolve([]);
      }
    }, 500);
  });
}

function mockFetchPastAppointments(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (url.includes('983')) {
        resolve(mockPastAppts);
      } else {
        resolve([]);
      }
    }, 6000);
  });
}

export default {
  home: {
    url: '/',
  },
  typeOfCare: {
    url: '/new-appointment',
    next: 'typeOfFacility',
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
    // next: 'visitType',
    async next(state, dispatch) {
      const facility = getChosenFacilityInfo(state);
      const typeOfCareId = getTypeOfCare(state)?.id;

      const {
        durationInMonths,
        hasVisitedInPastMonths,
      } = await mockFetchPastVisits(
        `/vaos/facilities/${
          facility.institution.institutionCode
        }/visits?typeOfCareId=${typeOfCareId}`,
      );

      if (
        durationInMonths === DISABLED_LIMIT_VALUE ||
        !hasVisitedInPastMonths
      ) {
        return 'visitRequirements';
      }

      // The facility page should prevent you from choosing
      // a facility that doesn't have either requests or
      // direct scheduling, so we only need to check one
      if (!facility.directSchedulingSupported) {
        const { requestLimit, numberOfRequests } = await mockFetchRequestLimit(
          `/vaos/facilities/${
            facility.institution.institutionCode
          }/limits?typeOfCareId=${typeOfCareId}`,
        );

        if (
          requestLimit === DISABLED_LIMIT_VALUE ||
          numberOfRequests >= requestLimit
        ) {
          return 'visitType';
        }

        return 'requestLimits';
      }

      const [clinics, appointments] = await Promise.all([
        mockFetchClinics(),
        mockFetchPastAppointments(),
      ]);
      const apptHash = buildApptHash(appointments);

      if (clinics.some(clinic => !!apptHash[clinic.clinicId])) {
        dispatch({
          type: 'START_DIRECT_SCHEDULE_FLOW',
          clinics,
          appointments,
        });

        return 'clinicChoice';
      }

      return 'visitType';
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
    next: 'contactInfo',
  },
  contactInfo: {
    url: '/new-appointment/contact-info',
    next: 'home',
    previous(state) {
      if (getFormData(state).facilityType === 'communityCare') {
        return 'ccProvider';
      }

      return 'visitType';
    },
  },
};
