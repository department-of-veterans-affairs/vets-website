// _ from 'lodash/fp';

// Example of an imported schema:
import fullSchema4142 from '../../../../../../vets-json-schema/dist/21-4142-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-4142-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
// import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import PrivateProviderTreatmentView from '../../../../platform/forms/components/ServicePeriodView';
import { schema as addressSchema, uiSchema as addressUI } from '../../../../platform/forms/definitions/address';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  veteranFullName,
  veteranSocialSecurityNumber,
  veteranDateOfBirth,
  veteranAddress,
  email,
  limitedConsent,
  providerFacility,
  treatmentDateRange
} = fullSchema4142.properties;

const {
  fullName,
  ssn,
  date,
  address,
  phone,
  dateRange,
  privacyAgreementAccepted
} = fullSchema4142.definitions;

import {
  medicalRecDescription,
  letUsKnow,
  aboutPrivateMedicalRecs,
  limitedConsentDescription,
  summary,
} from '../helpers';


import PhoneNumberWidget from 'us-forms-system/lib/js/widgets/PhoneNumberWidget';

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  uploadInfo: 'uploadInfo',
  treatmentHistory: 'treatmentHistory',
  summary: 'summary'
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/private_medical_record_auth/submit',
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4142',
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
    phone,
    address
  },
  chapters: {
    chapterApplicantInfo: {
      title: 'Apply for disability increase',
      pages: {
        [formPages.uploadInfo]: {
          path: 'private-medical-record',
          title: 'Supporting Evidence',
          uiSchema: {
            'view:uploadRecs': {
              'ui:description': aboutPrivateMedicalRecs,
              'ui:title': aboutPrivateMedicalRecs,
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No, please get them from my doctor.',
                },
              },
            },
            'view:privateRecordsChoiceHelp': {
              'ui:description': medicalRecDescription,
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:uploadRecs': {
                type: 'string',
                'enum': ['Yes', 'No, please get them from my doctor.'],
              },
              'view:privateRecordsChoiceHelp': {
                type: 'object',
                properties: {},
              }
            },
          },
        },
      },
    },
    chapterServiceHistory: {
      title: 'Supporting Evidence',
      pages: {
        [formPages.treatmentHistory]: {
          path: 'treatment-history',
          title: 'Supporting Evidence',
          uiSchema: {
            'ui:description': letUsKnow,
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
                limitedConsent: {
                  'ui:title':
                    'I give consent, or permission, to my doctor to release only records related to [condition].',
                },
                'view:privateRecordsChoiceHelp': {
                  'ui:description': limitedConsentDescription,
                },
                treatmentDateRange: dateRangeUI(
                  'Approximate date of first treatment',
                  'Approximate date of last treatment',
                  'End of treatment must be after start of treatment',
                ),
                // privateProviderCountry: {
                //   'ui:title': 'Country',
                // },
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
                }),
                // privateProviderState: {
                //   'ui:title': 'State',
                // },
                // privateProviderCity: {
                //   'ui:title': 'City',
                // },
                // privateProviderPostalCode: {
                //   'ui:title': 'Postal code',
                //   'ui:options': {
                //     widgetClassNames: 'usa-input-medium',
                //   },
                // },
                phone: {
                  'ui:title': 'Primary phone number',
                  'ui:widget': PhoneNumberWidget,
                  'ui:options': {
                    widgetClassNames: 'va-input-medium-large',
                  },
                  'ui:errorMessages': {
                    pattern: 'Phone numbers must be 10 digits (dashes allowed)',
                  },
                },
              },
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
                    },
                    limitedConsent: {
                      type: 'boolean',
                    },
                    'view:privateRecordsChoiceHelp': {
                      type: 'object',
                      properties: {},
                    },
                    treatmentDateRange: {
                      $ref: '#/definitions/dateRange',
                    },
                    // privateProviderCountry: {
                    //   type: 'string',
                    // },
                    providerFacilityAddress: _.merge(addressSchema(fullSchema4142, true), {
                      properties: {
                        street: {
                          minLength: 1,
                          maxLength: 30,
                          type:'string'
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
                    }),
                    // privateProviderCity: {
                    //   type: 'string',
                    // },
                    // privateProviderState: {
                    //   type: 'string',
                    // },
                    // privateProviderPostalCode: {
                    //   type: 'string',
                    // },
                    phone: {
                      type: 'string',
                    },
                  },
                  required: [
                    'providerFacilityName',
                    'providerFacilityAddress',
                    'treatmentDateRange'
                  ],
                },
              },
            },
          },
        },
        [formPages.summary]: {
          path: 'summary-information',
          title: 'Summary Information',
          uiSchema: {
            'ui:title': 'Summary of evidence',
            'ui:description': summary,
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
