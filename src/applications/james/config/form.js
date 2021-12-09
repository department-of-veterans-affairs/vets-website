// import fullSchema from 'vets-json-schema/dist/235-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formFields = {
  firstName: 'firstName',
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'james-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '235',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (235) is in progress.',
    //   expired: 'Your saved benefits application (235) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Reasons James Is Awesome Form',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Personal Information',
      pages: {
        page1: {
          path: 'first-name',
          title: 'Personal Information - Page 1',
          uiSchema: {
            [formFields.firstName]: {
              'ui:title': 'First Name',
            },
          },
          schema: {
            required: [formFields.firstName],
            type: 'object',
            properties: {
              [formFields.firstName]: {
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
