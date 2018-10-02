// import _ from 'lodash/fp';
import { submit } from '../helpers';
// Example of an imported schema:
// import fullSchema from '../XX-XXXX-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/XX-XXXX-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
// import ssnUI from 'us-forms-system/lib/js/definitions/ssn';
// import bankAccountUI from 'us-forms-system/lib/js/definitions/bankAccount';
// import phoneUI from 'us-forms-system/lib/js/definitions/phone';
// import * as address from 'us-forms-system/lib/js/definitions/address';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  burialActivityType: 'burialActivityType',
  emblemCode: 'emblemCode',
  remainsType: 'remainsType',
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

// function hasDirectDeposit(formData) {
//   return formData[formFields.viewNoDirectDeposit] !== true;
// }

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  intermentInformation: 'intermentInformation',
  decedentInformation: 'decedentInformation',
  veteranInformation: 'veteranInformation',
  contactInformation: 'contactInformation',
  funeralHomeInformation: 'funeralHomeInformation',
  nextOfKin: 'nextOfKinInformation',
  attachments: 'attachments'
};

const formConfig = {
  urlPrefix: '/',
  submit,
  trackingPrefix: 'time-of-need-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'N/A',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for time of need interment benefits.',
    noAuth: 'Please sign in again to continue your application for time of need interment benefits.'
  },
  title: 'Application for Time of Need Interment Benefits',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    intermentInformationChapter: {
      title: 'Interment Information',
      pages: {
        [formPages.intermentInformation]: {
          path: 'interment-information',
          title: 'Interment Information',
          uiSchema: {
            [formFields.burialActivityType]: {
              'ui:title': 'Burial Type',
            },
            [formFields.emblemCode]: {
              'ui:title': 'Emblem',
            },
            [formFields.remainsType]: {
              'ui:title': 'Remains Type',
            }
          },
          schema: {
            type: 'object',
            required: [
              [formFields.burialActivityType],
              [formFields.emblemCode],
              [formFields.remainsType]
            ],
            properties: {
              [formFields.burialActivityType]: {
                type: 'string',
                'enum': [
                  'I',
                  'D',
                  'R',
                  'S',
                  'T'
                ],
                enumNames: [
                  'Interment',
                  'Disinterment',
                  'Reinterment',
                  'Memorial Service Only',
                  'Direct Interment'
                ]
              },
              [formFields.emblemCode]: {
                type: 'string'
              },
              [formFields.remainsType]: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
