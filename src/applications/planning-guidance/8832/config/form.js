import _ from 'lodash/fp';

// Example of an imported schema:
import fullSchema from '../28-8832-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/28-8832-schema.json';

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

import {
  selection,
  veteranInformation,
  veteranAddress,
  veteranOptionalInformation,
  militaryService,
  dependentInformation,
} from './pages/exports';

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
    applicantInformation: {
      pages: {
        status: {
          path: 'your-status',
          title: 'Your Status',
          uiSchema: selection.uiSchema,
          schema: selection.schema,
        },
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran Address',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
        vereranOptional: {
          path: 'optional-information',
          title: 'Serivce member or Veteran information',
          uiSchema: veteranOptionalInformation.uiSchema,
          schema: veteranOptionalInformation.schema,
        },
        militaryService: {
          path: 'military-service',
          title: 'Military Service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
        },
        dependentInformation: {
          path: 'dependentInformation',
          title: 'Dependent Information',
          uiSchema: dependentInformation.uiSchema,
          schema: dependentInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
