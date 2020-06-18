// import fullSchema from 'vets-json-schema/dist/28-8832-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { veteranInformation } from './chapters/veteran-information';
import { militaryHistory } from './chapters/military-history';
import { dependentInformation } from './chapters/dependent-information';
import { additionalInformation } from './chapters/additional-information';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '28-8832-planning-and-career-guidance-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-8832',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Planning and career guidance.',
    noAuth:
      'Please sign in again to continue your application for Planning and career guidance.',
  },
  title: '28-8832-planning-and-guidance',
  defaultDefinitions: {},
  chapters: {
    veteranDetails: {
      title: 'Personal Information',
      pages: {
        veteranInformation: {
          path: 'first-name',
          title: 'Personal Information - Page 1',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
    militaryHistory: {
      title: 'MIlitary History',
      pages: {
        militaryHistory: {
          path: 'military-history',
          title: 'Military History',
          uiSchema: militaryHistory.uiSchema,
          schema: militaryHistory.schema,
        },
      },
    },
    dependentInformation: {
      title: 'Dependent Information',
      pages: {
        dependentInformation: {
          path: 'dependent-information',
          title: 'Dependent Information',
          uiSchema: dependentInformation.uiSchema,
          schema: dependentInformation.schema,
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
