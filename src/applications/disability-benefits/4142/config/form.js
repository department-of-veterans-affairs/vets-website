// _ from 'lodash/fp';

// Example of an imported schema:
import fullSchema from '../22-4142-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-4142-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import PrivateProviderTreatmentView from '../../../../platform/forms/components/ServicePeriodView';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

// import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
// import ssnUI from 'us-forms-system/lib/js/definitions/ssn';
// import bankAccountUI from 'us-forms-system/lib/js/definitions/bankAccount';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';
import * as address from 'us-forms-system/lib/js/definitions/address';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

import {
//  directDepositWarning,
  medicalRecDescription,
  documentDescription,
  // letUsKnow,
  limitedConsentDescription,
} from '../helpers';

// import toursOfDutyUI from '../definitions/toursOfDuty';

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
  // bankAccount,
  // toursOfDuty,
  // privateMedicalProvider,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  privateMedicalProvider: 'privateMedicalProvider',
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

// function hasDirectDeposit(formData) {
//   return formData[formFields.viewNoDirectDeposit] !== true;
// }

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInfo: 'applicantInfo',
  serviceHistory: 'serviceHistory',
  contactInfo: 'contactInfo',
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
  title: '4142 Private Medical Record Release Form',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    chapterApplicantInfo: {
      title: 'Apply for disability increase',
      pages: {
        [formPages.applicantInfo]: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: {
            uploadRecs: {
              'ui:description':
                'Do you want to upload your private medical records?',
              'ui:title': documentDescription,
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No, my doctor has my medical records',
                },
              },
            },
            'view:privateRecordsChoiceHelp': {
              'ui:description': medicalRecDescription,
            },
          },
          schema: {
            type: 'object',
            properties: {
              uploadRecs: {
                type: 'string',
                'enum': ['Yes', 'No'],
              },
              'view:privateRecordsChoiceHelp': {
                type: 'object',
                properties: {},
              },
            },
          },
          // uiSchema: {
          //   [formFields.fullName]: fullNameUI,
          //   [formFields.ssn]: ssnUI
          // },
          // schema: {
          //   type: 'object',
          //   required: [formFields.fullName],
          //   properties: {
          //     [formFields.fullName]: fullName,
          //     [formFields.ssn]: ssn,
          //   }
          // }
        },
      },
    },
    chapterServiceHistory: {
      title: 'Supporting Evidence',
      pages: {
        [formPages.serviceHistory]: {
          path: 'service-history',
          title: 'Service History',
          uiSchema: {
            //  [formFields.toursOfDuty]: toursOfDutyUI,
            [formFields.privateMedicalProvider]: {
              //  'ui:title': 'Service periods',
              'ui:options': {
                itemName: 'Service Period',
                viewField: PrivateProviderTreatmentView,
                hideTitle: true,
              },
              items: {
                dateRange: dateRangeUI(
                  'Approximate date of first treatment',
                  'Approximate date of last treatment',
                  'End of service must be after start of service',
                ),
                privateProviderName: {
                  'ui:title': 'Name of private provider or hospital',
                },
                privateProviderCountry: {
                  'ui:title': 'Country',
                },
                privateProviderStreetAddress: {
                  'ui:title': 'Street address',
                },
                privateProviderState: {
                  'ui:title': 'State',
                },
                privateProviderPostalCode: {
                  'ui:title': 'Postal code',
                },
                privatePrimaryPhoneNumber: {
                  'ui:title': 'Primary phone number',
                },
                limitedConsent: {
                  'ui:title':
                    'I give consent, or permission, to my doctor to release only records related to [condition].',
                  // 'ui:options': {
                  //   hideOnReviewIfFalse: true
                  // }
                },
                'view:privateRecordsChoiceHelp': {
                  'ui:description': limitedConsentDescription,
                },
                // benefitsToApplyTo: {
                //   // 'ui:title': 'Please explain how you’d like this service period applied.',
                //   // 'ui:widget': 'textarea',
                //   // 'ui:options': {
                //   //   expandUnder: 'applyPeriodToSelected',
                //   //   expandUnderCondition: false
                //   // }
                // }
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              // [formFields.toursOfDuty]: toursOfDuty,
              [formFields.privateMedicalProvider]: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    privateProviderName: {
                      type: 'string',
                    },
                    dateRange: {
                      $ref: '#/definitions/dateRange',
                    },
                    privateProviderCountry: {
                      type: 'string',
                    },
                    limitedConsent: {
                      type: 'boolean',
                    },
                    'view:privateRecordsChoiceHelp': {
                      type: 'object',
                      properties: {},
                    },
                    privateProviderStreetAddress: {
                      type: 'string',
                    },
                    privateProviderState: {
                      type: 'string',
                    },
                    privateProviderPostalCode: {
                      type: 'string',
                    },
                    privatePrimaryPhoneNumber: {
                      type: 'string',
                    },
                    // benefitsToApplyTo: {
                    //   type: 'string',
                    // },
                  },
                  //  required: ['dateRange', 'serviceBranch'],
                },
              },
            },
          },
        },
      },
    },
    chapterAdditionalInfo: {
      title: 'Additional Information',
      pages: {
        [formPages.contactInfo]: {
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
        // [formPages.directDeposit]: {
        //   path: 'direct-deposit',
        //   title: 'Direct Deposit',
        //   uiSchema: {
        //     'ui:title': 'Direct deposit',
        //     [formFields.viewNoDirectDeposit]: {
        //       'ui:title': 'I don’t want to use direct deposit',
        //     },
        //     [formFields.bankAccount]: _.merge(bankAccountUI, {
        //       'ui:order': [
        //         formFields.accountType,
        //         formFields.accountNumber,
        //         formFields.routingNumber,
        //       ],
        //       'ui:options': {
        //         hideIf: formData => !hasDirectDeposit(formData),
        //       },
        //       [formFields.accountType]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //       [formFields.accountNumber]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //       [formFields.routingNumber]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //     }),
        //     [formFields.viewStopWarning]: {
        //       'ui:description': directDepositWarning,
        //       'ui:options': {
        //         hideIf: hasDirectDeposit,
        //       },
        //     },
        //   },
        //   schema: {
        //     type: 'object',
        //     properties: {
        //       [formFields.viewNoDirectDeposit]: {
        //         type: 'boolean',
        //       },
        //       [formFields.bankAccount]: bankAccount,
        //       [formFields.viewStopWarning]: {
        //         type: 'object',
        //         properties: {},
        //       },
        //     },
        //   },
        // },
      },
    },
  },
};

export default formConfig;
