import _ from 'lodash/fp';

// Example of an imported schema:
import fullSchema from '../26-1880-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/26-1880-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

import { directDepositWarning } from '../helpers';
import toursOfDutyUI from '../definitions/toursOfDuty';

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
  bankAccount,
  toursOfDuty,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewStopWarning: 'view:stopWarning',
  bankAccount: 'bankAccount',
  accountType: 'accountType',
  accountNumber: 'accountNumber',
  routingNumber: 'routingNumber',
  address: 'address',
  email: 'email',
  altEmail: 'altEmail',
  phoneNumber: 'phoneNumber',
};

function hasDirectDeposit(formData) {
  return formData[formFields.viewNoDirectDeposit] !== true;
}

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  serviceHistory: 'serviceHistory',
  contactInformation: 'contactInformation',
  directDeposit: 'directDeposit',
};

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '1234',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Complex Form',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Applicant Information',
      pages: {
        [formPages.applicantInformation]: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: {
            [formFields.fullName]: fullNameUI,
            [formFields.ssn]: ssnUI,
          },
          schema: {
            type: 'object',
            required: [formFields.fullName],
            properties: {
              [formFields.fullName]: fullName,
              [formFields.ssn]: ssn,
            },
          },
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Service History',
      pages: {
        [formPages.serviceHistory]: {
          path: 'service-history',
          title: 'Service History',
          uiSchema: {
            [formFields.toursOfDuty]: toursOfDutyUI,
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.toursOfDuty]: toursOfDuty,
            },
          },
        },
      },
    },
    additionalInformationChapter: {
      title: 'Additional Information',
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            [formFields.address]: address.uiSchema('Mailing address'),
            [formFields.email]: {
              'ui:title': 'Primary email',
            },
            [formFields.altEmail]: {
              'ui:title': 'Secondary email',
            },
            [formFields.phoneNumber]: phoneUI('Daytime phone'),
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.address]: address.schema(fullSchema, true),
              [formFields.email]: {
                type: 'string',
                format: 'email',
              },
              [formFields.altEmail]: {
                type: 'string',
                format: 'email',
              },
              [formFields.phoneNumber]: usaPhone,
            },
          },
        },
        [formPages.directDeposit]: {
          path: 'direct-deposit',
          title: 'Direct Deposit',
          uiSchema: {
            'ui:title': 'Direct deposit',
            [formFields.viewNoDirectDeposit]: {
              'ui:title': 'I don’t want to use direct deposit',
            },
            [formFields.bankAccount]: _.merge(bankAccountUI, {
              'ui:order': [
                formFields.accountType,
                formFields.accountNumber,
                formFields.routingNumber,
              ],
              'ui:options': {
                hideIf: formData => !hasDirectDeposit(formData),
              },
              [formFields.accountType]: {
                'ui:required': hasDirectDeposit,
              },
              [formFields.accountNumber]: {
                'ui:required': hasDirectDeposit,
              },
              [formFields.routingNumber]: {
                'ui:required': hasDirectDeposit,
              },
            }),
            [formFields.viewStopWarning]: {
              'ui:description': directDepositWarning,
              'ui:options': {
                hideIf: hasDirectDeposit,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.viewNoDirectDeposit]: {
                type: 'boolean',
              },
              [formFields.bankAccount]: bankAccount,
              [formFields.viewStopWarning]: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
