// import fullSchema from 'vets-json-schema/dist/10-7959A-schema.json';

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
  trackingPrefix: '10-7959a-reimbursement-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-7959A',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your medical expense reimbursement application (10-7959A) is in progress.',
    //   expired: 'Your saved medical expense reimbursement application (10-7959A) has expired. If you want to apply for medical expense reimbursement, please start a new application.',
    //   saved: 'Your medical expense reimbursement application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for medical expense reimbursement.',
    noAuth:
      'Please sign in again to continue your application for medical expense reimbursement.',
  },
  title: 'Form 10-7959a Reimbursement ',
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
