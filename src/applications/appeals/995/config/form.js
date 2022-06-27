// import fullSchema from 'vets-json-schema/dist/20-0995-schema.json';

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
  trackingPrefix: '995-supplemental-claim-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-0995',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your VA Form 20-0995 (Supplemental Claim) application (20-0995) is in progress.',
    //   expired: 'Your saved VA Form 20-0995 (Supplemental Claim) application (20-0995) has expired. If you want to apply for VA Form 20-0995 (Supplemental Claim), please start a new application.',
    //   saved: 'Your VA Form 20-0995 (Supplemental Claim) application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for VA Form 20-0995 (Supplemental Claim).',
    noAuth:
      'Please sign in again to continue your application for VA Form 20-0995 (Supplemental Claim).',
  },
  title: 'Request a Supplemental Claim',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Personal Information',
      pages: {
        page1: {
          path: 'first-name',
          title: 'Personal Information - Page 1',
          uiSchema: {
            firstName: {
              'ui:title': 'First Name',
            },
          },
          schema: {
            required: ['firstName'],
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
