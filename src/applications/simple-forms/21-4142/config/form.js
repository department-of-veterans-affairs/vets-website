// import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';

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
  trackingPrefix: 'medical-release-4142-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4142',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your authorize release of medical information application (21-4142) is in progress.',
    //   expired: 'Your saved authorize release of medical information application (21-4142) has expired. If you want to apply for authorize release of medical information, please start a new application.',
    //   saved: 'Your authorize release of medical information application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for authorize release of medical information.',
    noAuth:
      'Please sign in again to continue your application for authorize release of medical information.',
  },
  title: 'Authorize the release of medical information to the VA',
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
