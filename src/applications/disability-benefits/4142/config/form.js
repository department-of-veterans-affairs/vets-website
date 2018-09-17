import _ from 'lodash/fp';

// Example of an imported schema:
// import fullSchema4142 from '../21-4142-schema.json';
// In a real app this would be imported from `vets-json-schema`:
import fullSchema4142 from 'vets-json-schema/dist/21-4142-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';
import { schema as addressSchema, uiSchema as addressUI } from '../../../../platform/forms/definitions/address';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import environment from '../../../../platform/utilities/environment';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// import {
//   uiSchema as facilityAddressUiSchema,
//   schema as facilityAddressSchema
// } from '../pages/facilityAddress';

// const { } = fullSchema4142.properties;

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
  disabilityNameTitle,
  validateZIP,
  transform,
} from '../helpers';

import { validateDate } from 'us-forms-system/lib/js/validation';

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  uploadInformation: 'uploadInformation',
  treatmentHistory: 'treatmentHistory',
  recordReleaseSummary: 'recordReleaseSummary',
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/private_medical_records/submit`,
  trackingPrefix: '21-4142-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4142',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  transformForSubmit: transform,
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
            'ui:title': disabilityNameTitle,
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
            'ui:title': disabilityNameTitle,
            providerFacility: {
              'ui:options': {
                itemName: 'Provider',
                viewField: PrivateProviderTreatmentView,
                hideTitle: true,
              },
              items: {
                providerFacilityName: {
                  'ui:title': 'Name of private provider or hospital',
                  'ui:errorMessages': {
                    pattern: 'Provider name must be less than 100 characters.',
                  }
                },
                'ui:validations': [validateDate],
                treatmentDateRange: dateRangeUI(
                  'Approximate date of first treatment',
                  'Approximate date of last treatment',
                  'End of treatment must be after start of treatment',
                ),
                providerFacilityAddress: _.merge(addressUI('', false), {
                  street: {
                    'ui:errorMessages': {
                      pattern: 'Street address must be less than 20 characters.',
                    },
                  },
                  street2: {
                    'ui:title': 'Street 2',
                    'ui:errorMessages': {
                      pattern: 'Street address must be less than 20 characters.',
                    }
                  },
                  city: {
                    'ui:errorMessages': {
                      pattern: 'Please provide a valid city. Must be at least 1 character.'
                    }
                  },
                  postalCode: {
                    'ui:title': 'Postal code',
                    'ui:options': {
                      widgetClassNames: 'usa-input-medium',
                    },
                    'ui:validations': [
                      {
                        validator: validateZIP,
                      },
                    ],
                  },
                }),
              },
            },
            limitedConsent: {
              'ui:title':
                'I give consent, or permission, to my doctor to release only records related to [condition].',
            },
            'view:privateRecordsChoiceHelp': {
              'ui:description': limitedConsentDescription,
            },
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
                      pattern: '^(.{1,100})$',
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
                          maxLength: 50,
                          type: 'string'
                        },
                        street2: {
                          minLength: 1,
                          maxLength: 50,
                          type: 'string'
                        },
                        city: {
                          minLength: 1,
                          maxLength: 51,
                          type: 'string'
                        },
                        postalCode: {
                          type: 'string'
                        },
                        country: {
                          type: 'string',
                        },
                        state: {
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
              'view:privateRecordsChoiceHelp': {
                type: 'object',
                properties: {},
              },
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
