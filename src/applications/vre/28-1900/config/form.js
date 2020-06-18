import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { additionalInformation } from './chapters/additional-information';

import {
  veteranInformation,
  veteranAddress,
} from './chapters/veteran-information';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '28-1900-chapter-31-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-1900',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Vocational Rehabilitation.',
    noAuth:
      'Please sign in again to continue your application for Vocational Rehabilitation.',
  },
  title: '28-1900 Vocational Rehabilitation',
  defaultDefinitions: {},
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        basicInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        contactInformation: {
          path: 'veteran-contact-information',
          title: 'Veteran Contact Information',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
        additionalInformation: {
          path: 'additional-information',
          title: 'Additional Information',
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
