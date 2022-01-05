import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  addressChangeAuthorization,
  basicInformation,
  contactInformation,
  disclosureAuthorization,
  location,
  organizationName,
  representative,
  search,
  serviceFileInformation,
  transitionPage,
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
      title: '',
      pages: {
        representativeType: {
          path: 'representative-type',
          uiSchema: basicInformation.uiSchema,
          schema: basicInformation.schema,
        },
        location: {
          path: 'location',
          uiSchema: location.uiSchema,
          schema: location.schema,
        },
        representative: {
          path: 'representative-name',
          uiSchema: representative.uiSchema,
          schema: representative.schema,
        },
        organizationName: {
          path: 'organization-name',
          uiSchema: organizationName.uiSchema,
          schema: organizationName.schema,
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
        personalInformation: {
          path: 'personal-information',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
      },
    },
    serviceFileInformation: {
      title: 'Your service file information',
      pages: {
        serviceFileInformation: {
          path: 'service-file-information',
          uiSchema: serviceFileInformation.uiSchema,
          schema: serviceFileInformation.schema,
        },
      },
    },
    contactInformation: {
      title: 'Your contact information',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          uiSchema: contactInformation.mailingAddress.uiSchema,
          schema: contactInformation.mailingAddress.schema,
        },
        additionalInformation: {
          path: 'additional-contact-information',
          uiSchema: contactInformation.additionalInformation.uiSchema,
          schema: contactInformation.additionalInformation.schema,
        },
      },
    },
    disclosureAuthorization: {
      title: 'Authorization to disclose protected treatment records',
      pages: {
        disclosureAuthorization: {
          path: 'disclosure-authorization',
          uiSchema: disclosureAuthorization.uiSchema,
          schema: disclosureAuthorization.schema,
        },
      },
    },
    addressChangeAuthorization: {
      title: 'Authorization to change your address',
      pages: {
        addressChangeAuthorization: {
          path: 'address-change-authorization',
          uiSchema: addressChangeAuthorization.uiSchema,
          schema: addressChangeAuthorization.schema,
        },
      },
    },
  },
};

export default formConfig;
