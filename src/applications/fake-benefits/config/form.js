// import fullSchema from 'vets-json-schema/dist/123-456-schema.json';

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
  trackingPrefix: 'fake-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '123-456',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for fake benefits.',
    noAuth: 'Please sign in again to continue your application for fake benefits.',
  },
  title: '123-456 Fake Benefits',
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
