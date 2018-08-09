// import fullSchema from 'vets-json-schema/dist/4142-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;


const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '4142',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '4142',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for private medical records release.',
    noAuth: 'Please sign in again to continue your application for private medical records release.'
  },
  title: '4142 Private Medical Record Release Form',
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
