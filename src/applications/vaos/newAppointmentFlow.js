import { getFormData } from './utils/selectors';

const AUDIOLOGY = '203';

function isCCAudiology(state) {
  return (
    getFormData(state).facilityType === 'communityCare' &&
    getFormData(state).typeOfCareId === AUDIOLOGY
  );
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

      return 'contactInfo';
    },
    previous: 'typeOfCare',
  },
  audiologyCareType: {
    url: '/new-appointment/audiology',
    next: 'contactInfo',
    previous: 'typeOfFacility',
  },
  contactInfo: {
    url: '/new-appointment/contact-info',
    next: 'home',
    previous(state) {
      if (isCCAudiology(state)) {
        return 'audiologyCareType';
      }
      // TODO: If user is not CC eligible, return to page prior to typeOfFacility
      return 'typeOfFacility';
    },
  },
};
