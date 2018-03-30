// import fullSchema from 'vets-json-schema/dist/c00L-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'cool-event',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'c00L',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for description of a cool form.',
    noAuth: 'Please sign in again to continue your application for description of a cool form.'
  },
  title: 'cool-party',
  defaultDefinitions: {
  },
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    }
  }
};

export default formConfig;
