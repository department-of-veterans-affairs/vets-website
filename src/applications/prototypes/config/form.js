// import fullSchema from 'vets-json-schema/dist/-schema.json';

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
  trackingPrefix: 'combobox-prototype-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application () is in progress.',
    //   expired: 'Your saved benefits application () has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'combobox prototype',
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
