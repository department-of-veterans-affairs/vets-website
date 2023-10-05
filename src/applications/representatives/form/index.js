import manifest from '../manifest.json';

import GetFormHelp from '../components/form/GetFormHelp';
// eslint-disable-next-line import/no-cycle
import IntroductionPage from '../components/form/IntroductionPage';
import ConfirmationPage from '../components/form/ConfirmationPage';

import {
  addressChangeAuthorization,
  contactInformation,
  serviceFileInformation,
  treatmentDisclosureAuthorization,
  personalInformation,
} from './chapters';

const formConfig = {
  rootUrl: manifest.rootUrl,
  customText: {
    appType: 'Form 21-21 or Form 21-22a',
  },
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'search-representative-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22',
  getHelp: GetFormHelp,
  saveInProgress: {
    messages: {
      inProgress: 'Your Form 21-21 or Form 21-22a is in progress.',
      expired:
        'Your saved Form 21-21 or Form 21-22a has expired. Please start over to continue.',
      saved: 'Your Form 21-21 or Form 21-22a has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over by searching for a representative.',
    noAuth:
      'Please sign in again to continue filling out Form 21-21 or Form 21-22a.',
  },
  title: 'Find a Local Representative',
  defaultDefinitions: {},
  chapters: {
    personalInformation: {
      title: 'Your personal information',
      pages: {
        // personalInformationAuth: {
        //   path: 'personal-information-auth',
        //   title: personalInformation.title,
        //   ...personalInformation.authenticated,
        //   depends: () => false,
        // },
        personalInformationNoAuth: {
          path: 'personal-information',
          title: personalInformation.title,
          ...personalInformation.unauthenticated,
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
    treatmentDisclosureAuthorization: {
      title: 'Authorization to disclose protected treatment records',
      pages: {
        treatmentDisclosureAuthorization: {
          path: 'treatment-disclosure-authorization',
          ...treatmentDisclosureAuthorization,
        },
      },
    },
    addressChangeAuthorization: {
      title: 'Authorization to change your address',
      pages: {
        addressChangeAuthorization: {
          path: 'address-change-authorization',
          ...addressChangeAuthorization,
        },
      },
    },
  },
};

export default formConfig;
