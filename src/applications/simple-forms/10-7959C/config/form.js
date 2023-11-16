// import fullSchema from 'vets-json-schema/dist/10-7959C-schema.json';

import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  addressUI,
  addressSchema,
  radioUI,
  radioSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

/** @type {PageSchema} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959C-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-7959C',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your CHAMPVA other health insurance certification application (10-7959C) is in progress.',
    //   expired: 'Your saved CHAMPVA other health insurance certification application (10-7959C) has expired. If you want to apply for CHAMPVA other health insurance certification, please start a new application.',
    //   saved: 'Your CHAMPVA other health insurance certification application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA other health insurance certification.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA other health insurance certification.',
  },
  title: '10-7959C CHAMPVA Other Health Insurance Certification form',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Beneficiary Information',
      pages: {
        page1: {
          path: 'beneficiary-name',
          title: 'Beneficiary Name',
          uiSchema: {
            beneficiaryFullName: fullNameNoSuffixUI(),
          },
          schema: {
            type: 'object',
            properties: {
              beneficiaryFullName: fullNameNoSuffixSchema,
            },
          },
        },
        page2: {
          path: 'beneficiary-ssn',
          title: 'Beneficiary SSN',
          uiSchema: {
            beneficiarySSN: ssnUI(),
          },
          schema: {
            type: 'object',
            properties: {
              beneficiarySSN: ssnSchema,
            },
          },
        },
        page3: {
          path: 'beneficiary-address',
          title: 'Beneficiary Address',
          uiSchema: {
            beneficiaryAddress: addressUI(),
            beneficiaryNewAddress: checkboxGroupUI({
              title: 'Address Information',
              required: false,
              labels: {
                addressIsNew: 'Check if this is a new address',
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              beneficiaryAddress: addressSchema({
                omit: [
                  'isMilitary',
                  'view:militaryBaseDescription',
                  'country',
                  'street2',
                  'street3',
                ],
              }),
              beneficiaryNewAddress: checkboxGroupSchema(['addressIsNew']),
            },
          },
        },
        page4: {
          path: 'beneficiary-gender',
          title: 'Beneficiary Gender',
          uiSchema: {
            beneficiaryGender: radioUI({
              title: 'Gender',
              labels: {
                male: 'Male',
                female: 'Female',
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              beneficiaryGender: radioSchema(['male', 'female']),
            },
          },
        },
      },
    },
  },
};

export default formConfig;
