// import fullSchema from 'vets-json-schema/dist/28-8832-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { statusSelection } from './chapters/status-selection';
import {
  veteranInformation,
  veteranAddress,
  veteranOptions,
} from './chapters/veteran-information';
import { militaryHistory } from './chapters/military-history';
import { dependentInformation } from './chapters/dependent-information';
import { additionalInformation } from './chapters/additional-information';
import { isDependent } from './helpers';

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
    statusSelection: {
      title: 'Your Status',
      pages: {
        wizard: {
          path: 'your-status',
          title: 'Your Status',
          uiSchema: statusSelection.uiSchema,
          schema: statusSelection.schema,
        },
      },
    },
    dependentInformation: {
      title: 'Dependent Information',
      pages: {
        dependentInformation: {
          depends: formData => isDependent(formData),
          path: 'dependent-information',
          title: 'Dependent Information',
          uiSchema: dependentInformation.uiSchema,
          schema: dependentInformation.schema,
        },
      },
    },
    veteranDetails: {
      title: 'Service member or Veteran information',
      pages: {
        veteranInformation: {
          path: 'first-name',
          title: 'Personal Information - Page 1',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran Address',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
        veteranOptions: {
          path: 'veteran-options',
          title: 'Service Member or Veteran Information',
          uiSchema: veteranOptions.uiSchema,
          schema: veteranOptions.schema,
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
