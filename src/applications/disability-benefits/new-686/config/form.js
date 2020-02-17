import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Chapter imports
import { wizard } from './chapters/taskWizard';
import { veteranInformation } from './chapters/veteran-information';
import { deceasedDependentInformation } from './chapters/report-dependent-death';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'new-686-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-686',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declare or remove a dependent.',
    noAuth:
      'Please sign in again to continue your application for declare or remove a dependent.',
  },
  title: 'New 686',
  defaultDefinitions: {},
  chapters: {
    veteranInformation: {
      title: "Veteran's Information",
      pages: {
        page1: {
          path: 'veteran-information',
          title: 'Veteran Information - Page 1',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
    optionSelection: {
      title: '686c Options',
      pages: {
        wizard: {
          title: '686c Options',
          path: '686-options-selection',
          uiSchema: wizard.uiSchema,
          schema: wizard.schema,
        },
      },
    },
    deceasedDependents: {
      title: 'Report the death of a dependent',
      pages: {
        dependentInformation: {
          title: 'Report the death of a dependent',
          path: '686-report-dependent-death',
          uiSchema: deceasedDependentInformation.uiSchema,
          schema: deceasedDependentInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
