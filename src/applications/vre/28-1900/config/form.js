import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { additionalInformation } from './chapters/additional-information';
import { communicationPreferences } from './chapters/communication-preferences';
import { veteranInformation, veteranAddress } from './chapters/veteran';

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
    notFound:
      'Please start over to apply for Veteran Readiness and Employment.',
    noAuth:
      'Please sign in again to continue your application for Vocational Readiness and Employment.',
  },
  title: '28-1900 Vocational Readiness and Employment',
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
    communicationPreferences: {
      title: 'Communication Preferences',
      pages: {
        communicationPreferences: {
          path: 'communication-preferences',
          title: 'VR&E Communication Preferences',
          uiSchema: communicationPreferences.uiSchema,
          schema: communicationPreferences.schema,
        },
      },
    },
  },
};

export default formConfig;
