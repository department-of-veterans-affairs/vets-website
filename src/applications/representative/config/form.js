import manifest from '../manifest.json';
import GetFormHelp from '../components/GetFormHelp';
// eslint-disable-next-line import/no-cycle
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  addressChangeAuthorization,
  // contactInformation,
  // serviceFileInformation,
  treatmentDisclosureAuthorization,
  // personalInformation,
} from './chapters';

import {
  unauthContactInfo,
  unauthIdInfo,
  unauthMailingAddress,
  unauthNameAndDob,
} from './chapters/veteran-personal-information';

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
        //   title: personalInformation.authenticated.title,
        //   path: 'personal-information-auth',
        //   ...personalInformation.authenticated,
        //   depends: () => false,
        // },
        personalInformationNoAuth: {
          title: unauthNameAndDob.title,
          path: 'personal-information',
          ...unauthNameAndDob,
        },
        serviceFileInformation: {
          title: unauthIdInfo.title,
          path: 'service-file-information',
          ...unauthIdInfo,
        },
        mailingAddress: {
          title: unauthMailingAddress.title,
          path: 'mailing-address',
          ...unauthMailingAddress,
        },
        additionalInformation: {
          title: unauthContactInfo.title,
          path: 'additional-contact-information',
          ...unauthContactInfo,
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
