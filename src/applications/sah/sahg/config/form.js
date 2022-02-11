// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
// import fullSchema from '../schema.js';
import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  contactInformation,
  serviceFileInformation,
  personalInformation,
  currentLivingSituation,
  previousApplications,
} from '../chapters';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'sahg-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_26_4555,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your housing grant application (26-4555) is in progress.',
    //   expired: 'Your saved housing grant application (26-4555) has expired. If you want to apply for housing grant, please start a new application.',
    //   saved: 'Your housing grant application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for housing grant.',
    noAuth:
      'Please sign in again to continue your application for housing grant.',
  },
  title:
    'Apply for a Specially Adapted Housing Grant or Special Home Adaptation Grant',
  defaultDefinitions: {},
  chapters: {
    personalInformation: {
      title: 'Your personal information',
      pages: {
        personalInformation: {
          path: 'personal-information',
          ...personalInformation,
        },
      },
    },
    serviceFileInformation: {
      title: 'Your service file information',
      pages: {
        serviceFileInformation: {
          path: 'service-file-information',
          ...serviceFileInformation,
        },
      },
    },
    contactInformation: {
      title: 'Your contact information',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          ...contactInformation.mailingAddress,
        },
        additionalInformation: {
          path: 'additional-contact-information',
          ...contactInformation.additionalInformation,
        },
      },
    },
    previousApplications: {
      title: 'Your previous applications for specially adapted housing',
      pages: {
        appliedForSpeciallyAdaptedHousing: {
          path: 'applied-for-specially-adapted-housing',
          ...previousApplications.appliedForSpeciallyAdaptedHousing.default,
        },
        speciallyAdaptedHousingApplicationDate: {
          path: 'specially-adapted-housing-application-date',
          ...previousApplications.appliedForSpeciallyAdaptedHousing
            .applicationDate,
        },
        speciallyAdaptedHousingApplicationAddress: {
          path: 'specially-adapted-housing-application-address',
          ...previousApplications.appliedForSpeciallyAdaptedHousing
            .applicationAddress,
        },
        appliedForHomeImprovement: {
          path: 'applied-for-home-improvement',
          ...previousApplications.appliedForHomeImprovement.default,
        },
        homeImprovementApplicationDate: {
          path: 'home-improvement-application-date',
          ...previousApplications.appliedForHomeImprovement.applicationDate,
        },
        homeImprovementApplicationAddress: {
          path: 'home-improvement-application-address',
          ...previousApplications.appliedForHomeImprovement.applicationAddress,
        },
      },
    },
    currentLivingSituation: {
      title: 'Your current living situation',
      pages: {
        confinement: {
          path: 'confinement',
          ...currentLivingSituation.confinement,
        },
        facilityInformation: {
          path: 'facility-information',
          ...currentLivingSituation.facilityInformation,
        },
        facilityAddress: {
          path: 'facility-address',
          ...currentLivingSituation.facilityAddress,
        },
        additionalComments: {
          path: 'additional-comments',
          ...currentLivingSituation.additionalComments,
        },
      },
    },
  },
};

export default formConfig;
