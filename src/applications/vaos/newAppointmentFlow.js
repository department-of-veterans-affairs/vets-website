import { getFormData } from './utils/selectors';

const AUDIOLOGY = '203';

export default {
  home: {
    url: '/',
  },
  typeOfCare: {
    url: '/new-appointment',
    next: 'reasonForAppointment',
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
  reasonForAppointment: {
    url: '/new-appointment/reason-appointment',
    next: 'contactInfo',
    previous: 'typeOfCare',
  },
  contactInfo: {
    url: '/new-appointment/contact-info',
    next: 'home',
    previous: 'reasonForAppointment',
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
