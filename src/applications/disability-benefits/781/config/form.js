// import _ from 'lodash/fp';

// Example of an imported schema:
// import fullSchema from '../21-0781-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

import {
  introductionText
} from '../helpers';

// Define all the fields in the form to aid reuse
// const formFields = {
// };

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  introductionPage: 'introductionPage',
};

import {
  ptsdChoice,
  ptsdSecondaryChoice,
  uploadPtsd,
  uploadPtsdSecondary
} from '../pages';

const formConfig = {
  urlPrefix: '/',
  submit: () => Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '1234',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.'
  },
  title: 'Apply for increased disability compensation',
  chapters: {
    introductionPage: {
      title: 'Disability Details',
      pages: {
        [formPages.introductionPage]: {
          'ui:title': '',
          path: 'info',
          uiSchema: {
            'ui:description': introductionText,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
        ptsdChoice: {
          path: 'ptsdChoice',
          title: 'Disability Details',
          uiSchema: ptsdChoice.uiSchema,
          schema: ptsdChoice.schema
        },
        uploadPtsd: {
          path: 'upload-781',
          title: 'Disability Details',
          depends: (form) => form['view:uploadPtsdChoice'] === 'upload',
          uiSchema: uploadPtsd.uiSchema,
          schema: uploadPtsd.schema
        },
        ptsdSecondaryChoice: {
          path: 'ptsdSecondaryChoice',
          title: 'Disability Details',
          uiSchema: ptsdSecondaryChoice.uiSchema,
          schema: ptsdSecondaryChoice.schema
        },
        uploadPtsdSecondary: {
          path: 'upload-781a',
          title: 'Disability Details',
          depends: (form) => form['view:uploadPtsdSecondaryChoice'] === 'upload',
          uiSchema: uploadPtsdSecondary.uiSchema,
          schema: uploadPtsdSecondary.schema
        }
      }
    }
  }
};

export default formConfig;
