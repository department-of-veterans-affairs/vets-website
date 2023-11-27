// import fullSchema from 'vets-json-schema/dist/20-10206-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'pa-10206-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-10206',
  saveInProgress: {
    messages: {
      inProgress: 'Your personal records request (20-10206) is in progress.',
      expired:
        'Your saved Personal records request (20-10206) has expired. If you want to request personal records, please start a new application.',
      saved: 'Your Personal records request has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to request personal records.',
    noAuth: 'Please sign in again to continue your Personal records request.',
  },
  title: 'Request personal records',
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
