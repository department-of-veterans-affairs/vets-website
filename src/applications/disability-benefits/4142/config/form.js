import _ from 'lodash/fp';

// Example of an imported schema:
import fullSchema4142 from 'vets-json-schema/dist/21-4142-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-4142-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
// import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';
import { schema as addressSchema, uiSchema as addressUI } from '../../../../platform/forms/definitions/address';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const {
//   limitedConsent,
//   providerFacility,
//   treatmentDateRange
// } = fullSchema4142.properties;

const {
  fullName,
  ssn,
  date,
  address,
  phone,
  dateRange
} = fullSchema4142.definitions;

import {
  recordHelp,
  recordReleaseDescription,
  aboutPrivateMedicalRecords,
  limitedConsentDescription,
  recordReleaseSummary,
} from '../helpers';

import PhoneNumberWidget from 'us-forms-system/lib/js/widgets/PhoneNumberWidget';

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  uploadInformation: 'uploadInformation',
  treatmentHistory: 'treatmentHistory',
  recordReleaseSummary: 'recordReleaseSummary',
};

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '${environment.API_URL}/v0/private_medical_record_auth/submit', //TODO When BE is ready
  submit: () =>
    Promise.resolve({
      attributes: { confirmationNumber: '123123123', timestamp: Date.now() },
    }),

  trackingPrefix: '21-4142-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4142',
  version: 0,
  prefillEnabled: true,
  //  prefillTransformer, //TODO: Will enable this when BE is ready
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  //  transformForSumbit: transform, //TODO
  title: '4142 Private Medical Record Release Form', // TODO: Verify the title and subtitle
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    phone,
    address
  },
  chapters: {
    applicantInformation: {
      title: 'Apply for disability increase', // TODO: Verify title
      pages: {
        [formPages.uploadInformation]: {
          // THIS IS NOT A REAL PAGE; WILL BE THROWN OUT IN 526 INTEGRATION TODO
          path: 'private-medical-record-upload',
          title: 'Supporting Evidence',
          uiSchema: {
            'view:uploadRecords': {
              'ui:description': aboutPrivateMedicalRecords,
              'ui:title': aboutPrivateMedicalRecords,
              'ui:widget': 'radio',
              'ui:options': {
                // TODO depends: (formData) => !formData.view:uploadRecs
                labels: {
                  yes: 'Yes',
                  no: 'No, please get them from my doctor.',
                },
              },
            },
            'view:privateRecordsChoiceHelp': {
              'ui:description': recordHelp,
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:uploadRecords': {
                type: 'string',
                'enum': ['Yes', 'No, please get them from my doctor.'],
              },
              'view:privateRecordsChoiceHelp': {
                type: 'object',
                properties: {},
              }
            },
          },
        }, // THIS IS NOT A REAL PAGE; WILL BE THROWN OUT IN 526 INTEGRATION TODO
      },
    },
    treatmentHistory: {
      title: 'Supporting Evidence',
      pages: {
        [formPages.treatmentHistory]: {
          path: 'private-medical-record-request',
          title: 'Supporting Evidence',
          uiSchema: {
            'ui:description': recordReleaseDescription,
            providerFacility: {
              'ui:options': {
                itemName: 'Provider',
                viewField: PrivateProviderTreatmentView,
                hideTitle: true,
              },
              items: {
                providerFacilityName: {
                  'ui:title': 'Name of private provider or hospital',
                },
                'view:privateRecordsChoiceHelp': {
                  'ui:description': limitedConsentDescription,
                },
                treatmentDateRange: dateRangeUI(
                  'Approximate date of first treatment',
                  'Approximate date of last treatment',
                  'End of treatment must be after start of treatment',
                ),
                providerFacilityAddress: _.merge(addressUI('', false), {
                  street: {
                    'ui:errorMessages': {
                      pattern: 'Please provide a valid street. Must be at least 1 character.'
                    }
                  },
                  street2: {
                    'ui:title': 'Street 2'
                  },
                  city: {
                    'ui:errorMessages': {
                      pattern: 'Please provide a valid city. Must be at least 1 character.'
                    }
                  }
                })
              },
            },
            limitedConsent: {
              'ui:title':
                'I give consent, or permission, to my doctor to release only records related to [condition].',
            },
            'view:privateRecordsChoiceHelp': {
              'ui:description': limitedConsentDescription,
            },
            phone: {
              'ui:title': 'Primary phone number',
              'ui:widget': PhoneNumberWidget,
              'ui:options': {
                widgetClassNames: 'va-input-medium-large',
              },
              'ui:errorMessages': {
                pattern: 'Phone numbers must be 10 digits (dashes allowed)',
              },
            }
          },
          schema: {
            type: 'object',
            properties: {
              providerFacility: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    providerFacilityName: {
                      type: 'string',
                    },
                    treatmentDateRange: {
                      type: 'object',
                      properties: {
                        from: {
                          $ref: '#/definitions/date',
                        },
                        to: {
                          $ref: '#/definitions/date',
                        }
                      },
                      required: ['from', 'to']
                    },
                    providerFacilityAddress: _.merge(addressSchema(fullSchema4142, true), {
                      properties: {
                        street: {
                          minLength: 1,
                          maxLength: 30,
                          type: 'string'
                        },
                        street2: {
                          minLength: 1,
                          maxLength: 30,
                          type: 'string'
                        },
                        city: {
                          minLength: 1,
                          maxLength: 30,
                          type: 'string'
                        }
                      }
                    })
                  },
                  required: [
                    'providerFacilityName',
                    'providerFacilityAddress'
                  ],
                },
              },
              limitedConsent: {
                type: 'boolean',
              },
              // 'view:privateRecordsChoiceHelp': {
              //   type: 'object',
              //   properties: {},
              // },
              phone: {
                type: 'string',
              }
            },
          },
        },
        [formPages.recordReleaseSummary]: {
          path: 'private-medical-record-summary',
          title: 'Summary Information',
          uiSchema: {
            'ui:title': 'Summary of evidence',
            'ui:description': recordReleaseSummary,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
