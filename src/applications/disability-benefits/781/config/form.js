import _ from 'lodash/fp';

// Example of an imported schema:
import fullSchema from '../21-0781-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/21-0781-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
import ssnUI from 'us-forms-system/lib/js/definitions/ssn';
import bankAccountUI from 'us-forms-system/lib/js/definitions/bankAccount';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';
import * as address from 'us-forms-system/lib/js/definitions/address';

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
  phoneNumber: 'phoneNumber'
};

function hasDirectDeposit(formData) {
  return formData[formFields.viewNoDirectDeposit] !== true;
}

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  serviceHistory: 'serviceHistory',
  contactInformation: 'contactInformation',
  directDeposit: 'directDeposit'
};

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
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
  title: 'Complex Form',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    introductionPage: {
      title: 'Disability Details',
      pages: {
        veteranInformation: {
          title: 'Veteran Information', // TODO: Figure out if this is even necessary
          path: 'ptsd',
          uiSchema: {
            'ui:description': 'text on a page',
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      }
    }
  }
};

export default formConfig;
