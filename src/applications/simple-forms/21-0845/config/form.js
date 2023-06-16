// import fullSchema from 'vets-json-schema/dist/21-0845-schema.json';

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
  trackingPrefix: 'auth-disclose-0845',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-0845',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your disclosure authorization application (21-0845) is in progress.',
    //   expired: 'Your saved disclosure authorization application (21-0845) has expired. If you want to apply for disclosure authorization, please start a new application.',
    //   saved: 'Your disclosure authorization application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for disclosure authorization.',
    noAuth:
      'Please sign in again to continue your application for disclosure authorization.',
  },
  title: 'Authorize VA to Disclose Personal Information to a Third Party',
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
