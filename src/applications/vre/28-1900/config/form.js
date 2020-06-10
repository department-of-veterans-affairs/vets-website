// import fullSchema from 'vets-json-schema/dist/21-1900-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formFields = {
  firstName: 'firstName',
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '28-1900-chapter-31-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-1900',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Vocational Rehabilitation.',
    noAuth: 'Please sign in again to continue your application for Vocational Rehabilitation.',
  },
  title: '28-1900 Vocational Rehabilitation',
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
