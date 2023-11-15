// import fullSchema from 'vets-json-schema/dist/20-10206-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// TODO: Double-check post-MVP roadmap, and
// refactor tracking-prefix and manifest prop(s) where needed
// Our current MVP only supports PA, and we'll likely have to
// add FOIA support down the road.
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'foia-pa-10206',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-10206',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your personal records application (20-10206) is in progress.',
    //   expired: 'Your saved personal records application (20-10206) has expired. If you want to apply for personal records, please start a new application.',
    //   saved: 'Your personal records application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for personal records.',
    noAuth:
      'Please sign in again to continue your application for personal records.',
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
