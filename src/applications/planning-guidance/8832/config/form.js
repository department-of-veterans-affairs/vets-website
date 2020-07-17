import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  selection,
  veteranInformation,
  veteranAddress,
  veteranOptionalInformation,
  militaryService,
  dependentInformation,
  dependentAddress,
  dependentOptions,
  sponsorInformation,
} from './pages/exports';

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '1234',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Complex Form',
  chapters: {
    applicantInformation: {
      pages: {
        status: {
          path: 'your-status',
          title: 'Your Status',
          uiSchema: selection.uiSchema,
          schema: selection.schema,
        },
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran Address',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
        veteranOptional: {
          path: 'optional-information',
          title: 'Serivce member or Veteran information',
          uiSchema: veteranOptionalInformation.uiSchema,
          schema: veteranOptionalInformation.schema,
        },
        militaryService: {
          path: 'military-service',
          title: 'Military Service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
        },
        dependentInformation: {
          path: 'dependentInformation',
          title: 'Dependent Information',
          uiSchema: dependentInformation.uiSchema,
          schema: dependentInformation.schema,
        },
        dependentAddress: {
          path: 'dependent-address',
          title: 'Dependent Address',
          uiSchema: dependentAddress.uiSchema,
          schema: dependentAddress.schema,
        },
        dependentOptions: {
          path: 'dependent-options',
          title: 'Dependent Options',
          uiSchema: dependentOptions.uiSchema,
          schema: dependentOptions.schema,
        },
        sponsorInformation: {
          path: 'sponsor-information',
          title: 'Sponsor Information',
          uiSchema: sponsorInformation.uiSchema,
          schema: sponsorInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
