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
  trackingPrefix: 'travel-pay-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-3542',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your beneficiary travel claim application (10-3542) is in progress.',
    //   expired: 'Your saved beneficiary travel claim application (10-3542) has expired. If you want to apply for beneficiary travel claim, please start a new application.',
    //   saved: 'Your beneficiary travel claim application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for beneficiary travel claim.',
    noAuth:
      'Please sign in again to continue your application for beneficiary travel claim.',
  },
  title: 'Complex Form',
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
