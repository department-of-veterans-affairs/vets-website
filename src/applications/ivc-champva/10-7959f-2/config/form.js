// import fullSchema from 'vets-json-schema/dist/10-7959F-2-schema.json';

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
  trackingPrefix: 'fmp-cover-sheet-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-7959F-2',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your health care benefits application (10-7959F-2) is in progress.',
    //   expired: 'Your saved health care benefits application (10-7959F-2) has expired. If you want to apply for health care benefits, please start a new application.',
    //   saved: 'Your health care benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for health care benefits.',
    noAuth:
      'Please sign in again to continue your application for health care benefits.',
  },
  title: 'Foreign Medical Program  Cover Sheet',
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
