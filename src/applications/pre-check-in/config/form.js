// import fullSchema from 'vets-json-schema/dist/PRE-CHECK-IN-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import CustomPage from '../pages/CustomPage';

import Validate from '../pages/Validate';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'pre-check-in-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'PRE-CHECK-IN',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for pre-check-in.',
    noAuth:
      'Please sign in again to continue your application for pre-check-in.',
  },
  additionalRoutes: [
    {
      path: 'validate',
      component: Validate,
      pageKey: 'validate',
      depends: () => {},
    },
  ],

  title: 'pre-check-in',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'my-schemaless-page',
          title: 'Bypassing the SchemaForm',
          CustomPage,
          CustomPageReview: CustomPage,
          schema: {
            type: 'object',
            properties: {},
          },
          uiSchema: {},
        },
        page2: {
          path: 'my-other-page',
          title: 'ByPassed the SchemaForm',
          CustomPage,
          CustomPageReview: CustomPage,
          schema: {
            type: 'object',
            properties: {},
          },
          uiSchema: {},
        },
      },
    },
  },
};

export default formConfig;
