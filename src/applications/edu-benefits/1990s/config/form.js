import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import manifest from '../manifest.json';
import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990s`,
  trackingPrefix: 'edu-1990s-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_1990S,
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
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
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
