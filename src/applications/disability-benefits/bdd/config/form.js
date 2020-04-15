// import fullSchema from 'vets-json-schema/dist/21-526EZ-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'bdd-21-526ez',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-526EZ',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits delivery at discharge.',
    noAuth:
      'Please sign in again to continue your application for benefits delivery at discharge.',
  },
  title: '21-526EZ Benefits Delivery at Discharge',
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
