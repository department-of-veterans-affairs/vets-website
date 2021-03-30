// import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import manifest from '../manifest.json';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'vrrap-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'VRRAP',
  saveInProgress: {
    messages: {
      inProgress:
        'Your Veteran Rapid Retraining Assistance Program application is in progress.',
      expired:
        'Veteran Rapid Retraining Assistance Program application has expired. If you want to apply for Veteran Rapid Retraining Assistance Program, please start a new application.',
      saved:
        'Veteran Rapid Retraining Assistance Program application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Veteran Rapid Retraining Assistance Program',
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
