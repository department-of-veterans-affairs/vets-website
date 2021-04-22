// Example of an imported schema:
// import fullSchema from '../26-1880-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/26-1880-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

import toursOfDutyUI from '../definitions/toursOfDuty';

// chapter schema imports
import {
  veteranInformation,
  veteranContactInfo,
  communicationPreferences,
} from './chapters/veteran';

// TODO: WHen schema is migrated to vets-json-schema, remove common definitions from form schema and get them
// from common definitions instead

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
  toursOfDuty,
  profileAddress,
  email,
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
  email: 'email',
  altEmail: 'altEmail',
  phoneNumber: 'phoneNumber',
};

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
  trackingPrefix: '26-1880-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '26-1880',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Certificate of Eligibility VA Form 26-1880',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
    profileAddress,
    email,
  },
  chapters: {
    veteranInformationChapter: {
      title: 'Your Information',
      pages: {
        veteranInformationSummary: {
          path: 'veteran-information-summary',
          title: 'Your personal informaton on file',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        veteranContactInformation: {
          path: 'veteran-contact-information',
          title: 'Your contact information',
          uiSchema: veteranContactInfo.uiSchema,
          schema: veteranContactInfo.schema,
        },
        veteranCommunicationPreferences: {
          path: 'veteran-communication-preference',
          title: 'Your communication preference',
          uiSchema: communicationPreferences.uiSchema,
          schema: communicationPreferences.schema,
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
  },
};

export default formConfig;
