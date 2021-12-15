// In a real app this would be imported from `vets-json-schema`:
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
// import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';
import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { directDepositWarning } from '../helpers';
import toursOfDutyUI from '../definitions/toursOfDuty';

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
  // bankAccount,
  toursOfDuty,
} = fullSchema.definitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewStopWarning: 'view:stopWarning',
  // bankAccount: 'bankAccount',
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
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'sahg-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_26_4555,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your housing grant application (26-4555) is in progress.',
    //   expired: 'Your saved housing grant application (26-4555) has expired. If you want to apply for housing grant, please start a new application.',
    //   saved: 'Your housing grant application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for housing grant.',
    noAuth:
      'Please sign in again to continue your application for housing grant.',
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
            // [formFields.bankAccount]: merge(bankAccountUI, {
            //   'ui:order': [
            //     formFields.accountType,
            //     formFields.accountNumber,
            //     formFields.routingNumber,
            //   ],
            //   'ui:options': {
            //     hideIf: formData => !hasDirectDeposit(formData),
            //   },
            //   [formFields.accountType]: {
            //     'ui:required': hasDirectDeposit,
            //   },
            //   [formFields.accountNumber]: {
            //     'ui:required': hasDirectDeposit,
            //   },
            //   [formFields.routingNumber]: {
            //     'ui:required': hasDirectDeposit,
            //   },
            // }),
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
              // [formFields.bankAccount]: bankAccount,
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
