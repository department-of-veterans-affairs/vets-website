import { getFormData } from './utils/selectors';

const AUDIOLOGY = '203';

export default {
  home: {
    url: '/',
  },
  typeOfCare: {
    url: '/new-appointment',
    next: 'contactInfo',
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
  contactInfo: {
    url: '/new-appointment/contact-info',
    next: 'home',
    previous: 'typeOfCare',
  },
  typeOfFacility: {
    url: '/new-appointment/type-of-facility',
    next(state) {
      if (
        getFormData(state).facilityType === 'communityCare' &&
        getFormData(state).typeOfCareId === AUDIOLOGY
      ) {
        return 'audiologyCareType';
      } else if (getFormData(state).facilityType === 'communityCare') {
        return 'preferredDates';
      }

      return 'vaLocation';
    },
    previous: 'typeOfCare',
  },
  audiologyCareType: {
    url: '/new-appointment/audiology',
    next: 'preferredDates',
    previous: 'typeOfFacility',
  },
  ccProvider: {
    url: '/new-appointment/community-care-provider',
    next: 'home',
    previous: 'contactInfo',
  },
};
