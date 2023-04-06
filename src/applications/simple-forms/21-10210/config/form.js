// import fullSchema from 'vets-json-schema/dist/21-10210-schema.json';

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
  trackingPrefix: 'lay-witness-10210-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-10210',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your claims application (21-10210) is in progress.',
    //   expired: 'Your saved claims application (21-10210) has expired. If you want to apply for claims, please start a new application.',
    //   saved: 'Your claims application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to apply for claims.',
    noAuth: 'Please sign in again to continue your application for claims.',
  },
  title: '21-10210 Lay/Witness Statement',
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
