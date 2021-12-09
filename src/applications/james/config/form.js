// import fullSchema from 'vets-json-schema/dist/235-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import CustomPage from '../containers/CustomPage';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'james-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '235',
  saveInProgress: {},
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
          CustomPage,
          CustomPageReview: null,
          schema: { type: 'object', properties: {} },
          uiSchema: {},
          /* uiSchema: {
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
          }, */
        },
      },
    },
  },
};

export default formConfig;
