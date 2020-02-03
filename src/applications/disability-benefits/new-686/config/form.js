// import fullSchema from 'vets-json-schema/dist/21-686-schema.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  schema,
  uiSchema,
} from './chapters/chapter-2/1-veteran-formation/veteran-information';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

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
    chapter1: {
      title: "Veteran's Information",
      pages: {
        page1: {
          path: 'veteran-information',
          title: 'Veteran Information - Page 1',
          uiSchema,
          schema,
        },
      },
    },
  },
};

export default formConfig;
