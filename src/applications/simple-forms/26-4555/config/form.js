// import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';

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
  trackingPrefix: '4555-adapted-housing-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '26-4555',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your specially adapted housing application (26-4555) is in progress.',
    //   expired: 'Your saved specially adapted housing application (26-4555) has expired. If you want to apply for specially adapted housing, please start a new application.',
    //   saved: 'Your specially adapted housing application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for specially adapted housing.',
    noAuth:
      'Please sign in again to continue your application for specially adapted housing.',
  },
  title:
    '26-4555 Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant',
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
