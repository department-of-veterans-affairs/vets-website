// import fullSchema from 'vets-json-schema/dist/PRE-CHECK-IN-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'pre-check-in-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'PRE-CHECK-IN',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your pre-check-in application (PRE-CHECK-IN) is in progress.',
    //   expired: 'Your saved pre-check-in application (PRE-CHECK-IN) has expired. If you want to apply for pre-check-in, please start a new application.',
    //   saved: 'Your pre-check-in application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for pre-check-in.',
    noAuth:
      'Please sign in again to continue your application for pre-check-in.',
  },
  title: 'pre-check-in',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
