// Example of an imported schema:
import fullSchema from '../20-0996-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const { fullName, date, dateRange, usaPhone } = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  altEmail: 'altEmail',
  phoneNumber: 'phoneNumber',
};

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  confirmVeteranDetails: 'confirmVeteranDetails',
  selectContestedIssues: 'selectContestedIssues',
  addNotes: 'addNotes',
  requestOriginalJurisdiction: 'requestOriginalJurisdiction',
  // requestAnInformalConference: 'requestAnInformalConference',
};

const formConfig = {
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/v0/higher_level_review/submit`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'hlr-0996-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_20_0996,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to request a Higher-Level Review.',
    noAuth:
      'Please sign in again to continue your request for Higher-Level Review.',
  },
  title: 'Higher-Level Review',
  defaultDefinitions: {
    fullName,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    confirmVeteranDetails: {
      title: 'Confirm Veteran details',
      pages: {
        [formPages.confirmVeteranDetails]: {
          path: 'confirm-veteran-details',
          title: 'Confirm Veteran details',
          uiSchema: {
            [formFields.fullName]: fullNameUI,
          },
          schema: {
            type: 'object',
            // required: [formFields.fullName],
            properties: {
              [formFields.fullName]: fullName,
            },
          },
        },
      },
    },
    selectContestedIssues: {
      title: 'Select your contested issues',
      pages: {
        [formPages.selectContestedIssues]: {
          path: 'select-your-contested-issues',
          title: 'Select your contested issues',
          uiSchema: {
            [formFields.address]: address.uiSchema('Mailing address'),
            [formFields.email]: {
              'ui:title': 'Primary email',
            },
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.address]: address.schema(fullSchema, true),
              [formFields.email]: {
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    },
    addNotes: {
      title: 'Add notes',
      pages: {
        [formPages.selectContestedIssues]: {
          path: 'add-notes',
          title: 'Add notes (optional)',
          uiSchema: {
            [formFields.altEmail]: {
              'ui:title': 'Secondary email',
            },
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.altEmail]: {
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    },
    requestOriginalJurisdiction: {
      title: 'Request original jurisdiction',
      pages: {
        [formPages.selectContestedIssues]: {
          path: 'request-original-jurisdiction',
          title: 'Request original jurisdiction',
          uiSchema: {
            [formFields.phoneNumber]: phoneUI('Daytime phone'),
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.phoneNumber]: usaPhone,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
