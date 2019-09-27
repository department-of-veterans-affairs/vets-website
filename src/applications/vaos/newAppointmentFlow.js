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
    next: 'contactInfo',
    previous(state) {
      if (isCCAudiology(state)) {
        return 'audiologyCareType';
      }

      return 'typeOfFacility';
    },
  },
  vaFacility: {
    url: '/new-appointment/va-facility',
    next: 'visitType',
    // TODO: If user is not CC eligible, return to page prior to typeOfFacility
    previous: 'typeOfFacility',
  },
  visitType: {
    url: '/new-appointment/choose-visit-type',
    previous: 'vaFacility',
    next: 'reasonForAppointment',
  },
  reasonForAppointment: {
    url: '/new-appointment/reason-appointment',
    next: 'contactInfo',
    previous: 'visitType',
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
