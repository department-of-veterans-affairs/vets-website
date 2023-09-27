import manifest from '../manifest.json';

import GetFormHelp from '../components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  addressChangeAuthorization,
  basicInformation,
  contactInformation,
  location,
  organizationName,
  representative,
  search,
  serviceFileInformation,
  transitionPage,
  treatmentDisclosureAuthorization,
  personalInformation,
} from './chapters';

const formConfig = {
  rootUrl: manifest.rootUrl,
  customText: {
    appType: 'search',
  },
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'search-representative-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22a',
  getHelp: GetFormHelp,
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for search for a representative.',
    noAuth:
      'Please sign in again to continue your application for search for a representative.',
  },
  title: 'Find an accredited representative',
  defaultDefinitions: {},
  chapters: {
    basicInformation: {
      title: 'Your selected representative',
      pages: {
        representativeType: {
          path: 'representative-type',
          ...basicInformation,
        },
        location: {
          path: 'location',
          ...location,
        },
        representative: {
          path: 'representative-name',
          uiSchema: representative.uiSchema,
          schema: representative.schema,
        },
        organizationName: {
          path: 'organization-name',
          ...organizationName,
        },
        searchRepresentative: {
          path: 'search-for-representative',
          uiSchema: search.uiSchema,
          schema: search.schema,
        },
        transitionPage: {
          path: 'more-information',
          uiSchema: transitionPage.uiSchema,
          schema: transitionPage.schema,
        },
      },
    },
    personalInformation: {
      title: 'Your personal information',
      pages: {
        personalInformationAuth: {
          path: 'personal-information-auth',
          title: personalInformation.title,
          ...personalInformation.authenticated,
          depends: () => false,
        },
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
