import personalInformation from '../pages/personalInformation';
import identificationInformation from '../pages/identificationInformation';
import mailingAddress from '../pages/mailingAddress';
import contactInformation from '../pages/contactInformation';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  dev: {
    showNavLinks: false,
  },
  v3SegmentedProgressBar: true,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-form-patterns-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FORM_MOCK_PATTERNS_V3',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for web component examples.',
    noAuth:
      'Please sign in again to continue your application for web component examples.',
  },
  title: '[Plain Language title of form that starts with a verb]',
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInformation1: {
          path: 'personal-information-1',
          title: 'Your Personal Information',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        personalInformation2: {
          path: 'personal-information-2',
          title: 'Your Personal Information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
      },
    },
    mailingAddressChapter: {
      title: 'Mailing address',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing Address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    contactInformation: {
      title: 'Contact information',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Your contact information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
