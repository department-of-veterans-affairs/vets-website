import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { veteranInformation } from './chapters/veteran-information';

import { serviceHistory, serviceFlags } from './chapters/military-history';

import { workInformation } from './chapters/work-information';

import { educationInformation } from './chapters/education-information';

import { disabilityInformation } from './chapters/disability-information';

import { documentUpload } from './chapters/documnent-upload';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '28-1900-chapter-31-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-1900',
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
      },
    },
    serviceHistory: {
      title: 'Military History',
      pages: {
        serviceHistory: {
          path: 'service-history',
          title: 'Service History',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
        serviceFlags: {
          path: 'service-type',
          title: 'Service Type',
          uiSchema: serviceFlags.uiSchema,
          schema: serviceFlags.schema,
        },
      },
    },
    workInformation: {
      title: 'Work Information',
      pages: {
        workInformation: {
          path: 'work-information',
          title: 'Work Information',
          uiSchema: workInformation.uiSchema,
          schema: workInformation.schema,
        },
      },
    },
    educationInformation: {
      title: 'Education Information',
      pages: {
        educationInformation: {
          path: 'education-information',
          title: 'Education Information',
          uiSchema: educationInformation.uiSchema,
          schema: educationInformation.schema,
        },
      },
    },
    disabilityInformation: {
      title: 'Disability Information',
      pages: {
        disabilityInformation: {
          path: 'disability-information',
          title: 'Disability Information',
          uiSchema: disabilityInformation.uiSchema,
          schema: disabilityInformation.schema,
        },
      },
    },
    documentUpload: {
      title: 'Document Upload',
      pages: {
        document: {
          path: 'document-upload',
          title: 'Document Upload',
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
      },
    },
  },
};

export default formConfig;
