import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { veteranInformation } from './chapters/veteran-information';

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '29-1900',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Application for vocational rehabilitation',
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranBasicInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          schema: veteranInformation.schema,
          uiSchema: veteranInformation.uiSchema,
        },
      },
    },
  },
};

export default formConfig;
