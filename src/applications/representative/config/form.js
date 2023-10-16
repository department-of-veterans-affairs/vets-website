import manifest from '../manifest.json';
import GetFormHelp from '../components/GetFormHelp';
// eslint-disable-next-line import/no-cycle
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

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
  urlPrefix: '/form/',
  submitUrl: '/v0/api',
  trackingPrefix: 'search-representative-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22',
  getHelp: GetFormHelp,
  saveInProgress: {
    messages: {
      inProgress: 'Your VA Form 21-21 / VAForm 21-22a is in progress.',
      expired:
        'Your saved VA Form 21-21 / VA Form 21-22a has expired. Please start over to continue.',
      saved: 'Your VA Form 21-21 / VA Form 21-22a has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over by searching for a representative.',
    noAuth:
      'Please sign in again to continue filling out VA Form 21-21 / VA Form 21-22a.',
  },
  title: 'Appoint a Representative',
  subTitle: 'VA Form 21-22 / VA Form 21-22a',
  defaultDefinitions: {},
  chapters: {
    personalInformation: {
      title: 'Veteran Personal Information',
      pages: {
        // personalInformationAuth: {
        //   title: personalInformation.title,
        //   path: 'personal-information-auth',
        //   ...personalInformation.authenticated,
        //   depends: () => false,
        // },
        personalInformationNoAuth: {
          title: personalInformation.unauthenticated.title,
          path: 'personal-information',
          ...personalInformation.unauthenticated,
        },
        serviceFileInformation: {
          title: serviceFileInformation.title,
          path: 'service-file-information',
          ...serviceFileInformation,
        },
        mailingAddress: {
          title: contactInformation.mailingAddress.title,
          path: 'mailing-address',
          ...contactInformation.mailingAddress,
        },
        additionalInformation: {
          title: contactInformation.additionalInformation.title,
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
