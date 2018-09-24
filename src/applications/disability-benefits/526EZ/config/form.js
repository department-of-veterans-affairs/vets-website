import _ from '../../../../platform/utilities/data';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
import fullSchema4142 from 'vets-json-schema/dist/21-4142-schema.json';

// NOTE: Easier to run schema locally with hot reload for dev
// import fullSchema526EZ from '/path/Sites/vets-json-schema/dist/21-526EZ-schema.json';

import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import ServicePeriodView from '../../../../platform/forms/components/ServicePeriodView';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from '../../../../platform/forms/definitions/address';

import { uiSchema as autoSuggestUiSchema } from 'us-forms-system/lib/js/definitions/autosuggest';

import FormFooter from '../../../../platform/forms/components/FormFooter';
import environment from '../../../../platform/utilities/environment';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPoll from '../components/ConfirmationPoll';

import {
  uiSchema as primaryAddressUiSchema,
  schema as primaryAddressSchema,
} from '../pages/primaryAddress';

import treatmentAddressUiSchema from '../pages/treatmentAddress';

import {
  uiSchema as paymentInfoUiSchema,
  schema as paymentInfoSchema
} from '../../all-claims/pages/paymentInformation';

import PrivateProviderTreatmentView from '../../4142/components/PrivateProviderTreatmentView';

import {
  uiSchema as reservesNationalGuardUISchema,
  schema as reservesNationalGuardSchema,
} from '../pages/reservesNationalGuardService';

import SelectArrayItemsWidget from '../../all-claims/components/SelectArrayItemsWidget';

import {
  transform,
  prefillTransformer,
  supportingEvidenceOrientation,
  evidenceTypeHelp,
  disabilityNameTitle,
  vaMedicalRecordsIntro,
  privateMedicalRecordsIntro,
  privateRecordsChoice,
  facilityDescription,
  treatmentView,
  documentDescription,
  evidenceSummaryView,
  additionalDocumentDescription,
  GetFormHelp,
  FDCDescription,
  FDCWarning,
  noFDCWarning,
  queryForFacilities,
  getEvidenceTypesDescription,
  veteranInfoDescription,
  editNote,
  getlimitedConsentTitle,
  validateBooleanIfEvidence,
  privateRecordsChoiceHelp,
  patientAcknowledgementText
} from '../helpers';

import {
  recordReleaseDescription,
  countries,
  states,
  stateNames,
  limitedConsentDescription,
  validateZIP
} from '../../4142/helpers';

import { hasGuardOrReservePeriod } from '../../all-claims/utils';

import {
  disabilityOption,
  disabilitiesClarification,
} from '../../all-claims/content/ratedDisabilities';

import { requireOneSelected } from '../validations';
import {
  validateBooleanGroup,
  validateDate,
} from 'us-forms-system/lib/js/validation';
import PhoneNumberWidget from 'us-forms-system/lib/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'us-forms-system/lib/js/review/PhoneNumberWidget';

const {
  treatments,
  serviceInformation: { properties: { servicePeriods } },
  standardClaim,
  veteran: { properties: { homelessness } },
  attachments: uploadSchema,
} = fullSchema526EZ.properties;

const {
  address,
  date,
  fullName,
  phone,
  dateRange,
  dateRangeFromRequired,
  dateRangeAllRequired,
  disabilities,
  vaTreatmentCenterAddress,
} = fullSchema526EZ.definitions;

const FIFTY_MB = 52428800;

const formConfig = {
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  submitUrl: `${environment.API_URL}/v0/disability_compensation_form/submit`,
  trackingPrefix: 'disability-526EZ-',
  formId: '21-526EZ',
  version: 1,
  migrations: [],
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for disability claims increase.',
    noAuth:
      'Please sign in again to resume your application for disability claims increase.',
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPoll,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: {
    address,
    vaTreatmentCenterAddress,
    date,
    fullName,
    phone,
    // files
    dateRange,
    dateRangeFromRequired,
    dateRangeAllRequired,
    disabilities,
  },
  title: 'Apply for increased disability compensation',
  subTitle: 'Form 21-526EZ',
  // getHelp: GetFormHelp, // TODO: May need updated form help content
  chapters: {
    veteranDetails: {
      title: isReviewPage => `${isReviewPage ? 'Review ' : ''}Veteran Details`,
      pages: {
        veteranInformation: {
          title: 'Veteran Information', // TODO: Figure out if this is even necessary
          path: 'veteran-information',
          uiSchema: {
            'ui:description': veteranInfoDescription,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
        primaryAddress: {
          title: 'Address information',
          path: 'veteran-details/address-information',
          uiSchema: primaryAddressUiSchema,
          schema: primaryAddressSchema,
        },
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: {
            servicePeriods: {
              'ui:title': 'Military service history',
              'ui:description':
                'This is the military service history we have on file for you.',
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView,
                reviewMode: true,
              },
              items: {
                serviceBranch: {
                  'ui:title': 'Branch of service',
                },
                dateRange: dateRangeUI(
                  'Service start date',
                  'Service end date',
                  'End of service must be after start of service',
                ),
              },
            },
            'view:militaryHistoryNote': {
              'ui:description': editNote('service history'),
            },
          },
          schema: {
            type: 'object',
            properties: {
              servicePeriods,
              'view:militaryHistoryNote': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        reservesNationalGuardService: {
          title: 'Reserves and National Guard Service',
          path:
            'review-veteran-details/military-service-history/reserves-national-guard',
          depends: hasGuardOrReservePeriod,
          uiSchema: reservesNationalGuardUISchema,
          schema: reservesNationalGuardSchema,
        },
        paymentInformation: {
          title: 'Payment Information',
          path: 'payment-information',
          uiSchema: paymentInfoUiSchema,
          schema: paymentInfoSchema,
        },
        specialCircumstances: {
          title: 'Special Circumstances',
          path: 'special-circumstances',
          uiSchema: {
            veteran: {
              'ui:title': 'Homelessness',
              homelessness: {
                isHomeless: {
                  'ui:title':
                    'Are you homeless or at risk of becoming homeless?',
                  'ui:widget': 'yesNo',
                },
                pointOfContact: {
                  'ui:description':
                    'Please provide the name and number of a person we should call if we need to get in touch with you.',
                  'ui:options': {
                    expandUnder: 'isHomeless',
                  },
                  pointOfContactName: {
                    'ui:title': 'Name of person we should contact',
                    'ui:errorMessages': {
                      pattern:
                        "Full names can only contain letters, numbers, spaces, dashes ('-'), and forward slashes ('/')",
                    },
                    'ui:required': formData => {
                      const {
                        homelessness: homelessOrAtRisk,
                      } = formData.veteran;
                      if (homelessOrAtRisk.isHomeless !== true) {
                        return false;
                      }
                      return !!homelessOrAtRisk.pointOfContact.primaryPhone;
                    },
                  },
                  primaryPhone: {
                    'ui:title': 'Phone number',
                    'ui:widget': PhoneNumberWidget,
                    'ui:reviewWidget': PhoneNumberReviewWidget,
                    'ui:options': {
                      widgetClassNames: 'va-input-medium-large',
                    },
                    'ui:errorMessages': {
                      pattern:
                        'Phone numbers must be 10 digits (dashes allowed)',
                    },
                    'ui:required': formData => {
                      const {
                        homelessness: homelessOrAtRisk,
                      } = formData.veteran;
                      if (homelessOrAtRisk.isHomeless !== true) {
                        return false;
                      }
                      return !!homelessOrAtRisk.pointOfContact
                        .pointOfContactName;
                    },
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              veteran: {
                type: 'object',
                properties: {
                  homelessness,
                },
              },
            },
          },
        },
      },
    },
    ratedDisabilities: {
      title: 'Rated Disabilities',
      pages: {
        ratedDisabilities: {
          title: 'Your Rated Disabilities',
          path: 'select-disabilities',
          uiSchema: {
            'ui:description':
              'Below are your rated disabilities. Please choose the disability that you’re filing for an increase because the condition has gotten worse.',
            disabilities: {
              'ui:field': 'StringField',
              'ui:widget': SelectArrayItemsWidget,
              'ui:validations': [
                {
                  options: { selectedPropName: 'view:selected' },
                  validator: requireOneSelected,
                },
              ],
              // Need a "blank" title to show the validation error message but not the property name (disabilities)
              'ui:title': ' ',
              'ui:options': {
                showFieldLabel: 'label',
                label: disabilityOption,
                widgetClassNames: 'widget-outline',
                keepInPageOnReview: true,
              },
            },
            'view:disabilitiesClarification': {
              'ui:description': disabilitiesClarification,
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities,
              'view:disabilitiesClarification': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
    supportingEvidence: {
      title: 'Supporting Evidence',
      pages: {
        orientation: {
          title: '',
          path: 'supporting-evidence/orientation',
          uiSchema: {
            'ui:description': supportingEvidenceOrientation,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
        evidenceType: {
          title: (formData) => `${formData.name} supporting evidence`,
          path: 'supporting-evidence/:index/evidence-type',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'view:hasEvidence': {
                  'ui:title': 'Do you have any evidence that you would like to submit with your claim?',
                  'ui:description': '',
                  'ui:widget': 'yesNo',
                },
                'view:selectableEvidenceTypes': {
                  'ui:options': {
                    // Only way to get access to the disability info like 'name' within this nested schema
                    updateSchema: (form, schema, uiSchema, index) => ({ title: getEvidenceTypesDescription(form, index) }),
                    showFieldLabel: true,
                    hideIf: (formData, index) => {
                      return !_.get(`disabilities[${index}].view:hasEvidence`, formData, true);
                    }
                  },
                  'ui:validations': [{
                    validator: validateBooleanIfEvidence,
                    options: {
                      wrappedValidator: validateBooleanGroup
                    }
                  }],
                  'ui:errorMessages': {
                    atLeastOne:
                      'Please select at least one type of supporting evidence',
                  },
                  'view:vaMedicalRecords': {
                    'ui:title': 'VA medical records',
                  },
                  'view:privateMedicalRecords': {
                    'ui:title': 'Private medical records',
                  },
                  'view:otherEvidence': {
                    'ui:title': 'Lay statements or other evidence'
                  },
                },
                'view:evidenceTypeHelp': {
                  'ui:description': evidenceTypeHelp,
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'view:hasEvidence': {
                      type: 'boolean',
                      'default': true
                    },
                    'view:selectableEvidenceTypes': {
                      type: 'object',
                      properties: {
                        'view:vaMedicalRecords': {
                          type: 'boolean',
                        },
                        'view:privateMedicalRecords': {
                          type: 'boolean',
                        },
                        'view:otherEvidence': {
                          type: 'boolean',
                        },
                      },
                    },
                    'view:evidenceTypeHelp': {
                      type: 'object',
                      properties: {},
                    },
                  },
                },
              },
            },
          },
        },
        vaMedicalRecordsIntro: {
          title: '',
          path: 'supporting-evidence/:index/va-medical-records-intro',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(
            `disabilities.${
              index
            }.view:selectableEvidenceTypes.view:vaMedicalRecords`,
            formData,
          ),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': vaMedicalRecordsIntro,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
        vaFacilities: {
          title: '',
          path: 'supporting-evidence/:index/va-facilities',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(
            `disabilities.${
              index
            }.view:selectableEvidenceTypes.view:vaMedicalRecords`,
            formData,
          ),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': facilityDescription,
                treatments: {
                  'ui:options': {
                    itemName: 'Facility',
                    viewField: treatmentView,
                  },
                  items: {
                    treatmentCenterName: autoSuggestUiSchema(
                      'Name of VA medical facility',
                      queryForFacilities,
                      {
                        'ui:options': {
                          queryForResults: true,
                          freeInput: true,
                        },
                        'ui:errorMessages': {
                          // If the maxLength changes, we'll want to update the message too
                          maxLength:
                            'Please enter a name with fewer than 100 characters.',
                          pattern: 'Please enter a valid name.',
                        },
                      },
                    ),
                    treatmentDateRange: dateRangeUI(
                      'Date of first treatment (This date doesn’t have to be exact.)',
                      'Date of last treatment (This date doesn’t have to be exact.)',
                      'Date of last treatment must be after date of first treatment',
                    ),
                    treatmentCenterAddress: treatmentAddressUiSchema,
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['treatments'],
                  properties: {
                    treatments,
                  },
                },
              },
            },
          },
        },
        privateMedicalRecordsIntro: {
          title: '',
          path: 'supporting-evidence/:index/private-medical-records-intro',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(
            `disabilities.${
              index
            }.view:selectableEvidenceTypes.view:privateMedicalRecords`,
            formData,
          ),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': privateMedicalRecordsIntro,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
        privateRecordChoice: {
          title: '',
          path: 'supporting-evidence/:index/private-medical-records-choice',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(
            `disabilities.${
              index
            }.view:selectableEvidenceTypes.view:privateMedicalRecords`,
            formData,
          ),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': privateRecordsChoice,
                'view:uploadPrivateRecords': {
                  'ui:title':
                    'Do you want to upload your private medical records?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      yes: 'Yes',
                      no: 'No, please get them from my doctor',
                    },
                  },
                },
                'view:patientAcknowledgement': {
                  'ui:title': ' ',
                  'ui:help': patientAcknowledgementText,
                  'ui:options': {
                    expandUnder: 'view:uploadPrivateRecords',
                    expandUnderCondition: 'no',
                    showFieldLabel: true,
                  },
                  'view:acknowledgement': {
                    'ui:title': 'Patient Acknowledgement',
                  },
                  'ui:validations': [
                    (errors, item) => {
                      if (!item['view:acknowledgement']) {
                        errors.addError('You must accept the acknowledgement');
                      }
                    }
                  ]
                },
                'view:privateRecordsChoiceHelp': {
                  'ui:description': privateRecordsChoiceHelp,
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['view:uploadPrivateRecords'],
                  properties: {
                    'view:uploadPrivateRecords': {
                      type: 'string',
                      'enum': ['yes', 'no'],
                    },
                    'view:patientAcknowledgement': {
                      type: 'object',
                      required: ['view:acknowledgement'],
                      properties: {
                        'view:acknowledgement': {
                          type: 'boolean',
                          'default': true
                        }
                      }
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
        },
        privateMedicalRecordRelease: {
          title: 'Private Medical Records Release',
          path: 'supporting-evidence/:index/private-medical-records-release',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          depends: (formData, index) => {
            const hasRecords = _.get(
              `disabilities.${
                index
              }.view:selectableEvidenceTypes.view:privateMedicalRecords`,
              formData,
            );
            const requestsRecords = _.get(
              `disabilities.${index}.view:uploadPrivateRecords`,
              formData,
            ) === 'no';
            return hasRecords && requestsRecords;
          },
          uiSchema: {
            disabilities: {
              items: {
                'ui:description': recordReleaseDescription,
                'ui:title': disabilityNameTitle,
                limitedConsent: {
                  'ui:options': {
                    // Only way to get access to the disability info like 'name' within this nested schema. Similar to ln 381
                    updateSchema: (form, schema, uiSchema, index) => ({ title: getlimitedConsentTitle(form, index) })
                  }
                },
                'view:privateRecordsChoiceHelp': {
                  'ui:description': limitedConsentDescription,
                },
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
                        pattern:
                          'Provider name must be less than 100 characters.',
                      },
                    },
                    'ui:validations': [validateDate],
                    treatmentDateRange: dateRangeUI(
                      'Approximate date of first treatment',
                      'Approximate date of last treatment',
                      'End of treatment must be after start of treatment',
                    ),
                    providerFacilityAddress: Object.assign(
                      addressUI('', false),
                      {
                        street: {
                          'ui:title': 'Street',
                          'ui:errorMessages': {
                            pattern:
                              'Street address must be less than 20 characters.',
                          },
                        },
                        street2: {
                          'ui:title': 'Street 2',
                          'ui:errorMessages': {
                            pattern:
                              'Street address must be less than 20 characters.',
                          },
                        },
                        city: {
                          'ui:title': 'City',
                          'ui:errorMessages': {
                            pattern:
                              'Please provide a valid city. Must be at least 1 character.',
                          },
                        },
                        state: {
                          'ui:title': 'State',
                        },
                        postalCode: {
                          'ui:title': 'Postal Code',
                          'ui:options': {
                            widgetClassNames: 'usa-input-medium',
                          },
                          'ui:validations': [
                            {
                              validator: validateZIP,
                            },
                          ],
                        },
                      },
                    ),
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
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
                              },
                            },
                            required: ['from', 'to'],
                          },
                          providerFacilityAddress: Object.assign(
                            addressSchema(fullSchema4142, true),
                            {
                              properties: {
                                street: {
                                  minLength: 1,
                                  maxLength: 50,
                                  type: 'string',
                                },
                                street2: {
                                  minLength: 1,
                                  maxLength: 5,
                                  type: 'string',
                                },
                                city: {
                                  minLength: 1,
                                  maxLength: 51,
                                  type: 'string',
                                },
                                postalCode: {
                                  type: 'string',
                                },
                                country: {
                                  type: 'string',
                                  'enum': countries,
                                  'default': 'USA'

                                },
                                state: {
                                  type: 'string',
                                  'enum': states,
                                  enumNames: stateNames,
                                },
                              },
                            },
                          ),
                        },
                        required: [
                          'providerFacilityName',
                          'providerFacilityAddress',
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
            },
          },
        },
        recordUpload: {
          title: 'Upload your private medical records',
          depends: (formData, index) => {
            const hasRecords = _.get(
              `disabilities.${
                index
              }.view:selectableEvidenceTypes.view:privateMedicalRecords`,
              formData,
            );
            const uploadRecords = _.get(
              `disabilities.${index}.view:uploadPrivateRecords`,
              formData,
            ) === 'yes';
            return hasRecords && uploadRecords;
          },
          path: 'supporting-evidence/:index/documents',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                privateRecords: Object.assign(
                  {},
                  fileUploadUI('Upload your private medical records', {
                    itemDescription: 'Adding additional evidence:',
                    fileUploadUrl: `${
                      environment.API_URL
                    }/v0/upload_supporting_evidence`,
                    addAnotherLabel: 'Add Another Document',
                    fileTypes: [
                      'pdf',
                      'jpg',
                      'jpeg',
                      'png',
                      'gif',
                      'bmp',
                      'tif',
                      'tiff',
                      'txt',
                    ],
                    maxSize: FIFTY_MB,
                    createPayload: file => {
                      const payload = new FormData();
                      payload.append(
                        'supporting_evidence_attachment[file_data]',
                        file,
                      );

                      return payload;
                    },
                    parseResponse: (response, file) => {
                      return {
                        name: file.name,
                        confirmationCode: response.data.attributes.guid,
                      };
                    },
                    // this is the uiSchema passed to FileField for the attachmentId schema
                    // FileField requires this name be used
                    attachmentSchema: {
                      'ui:title': 'Document type',
                    },
                    // this is the uiSchema passed to FileField for the name schema
                    // FileField requires this name be used
                    attachmentName: {
                      'ui:title': 'Document name',
                    },
                  }),
                  { 'ui:description': documentDescription },
                ),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['privateRecords'],
                  properties: {
                    privateRecords: uploadSchema,
                  },
                },
              },
            },
          },
        },
        documentUpload: {
          title: 'Lay statements or other evidence',
          depends: (formData, index) => _.get(
            `disabilities.${
              index
            }.view:selectableEvidenceTypes.view:otherEvidence`,
            formData,
          ),
          path: 'supporting-evidence/:index/additionalDocuments',
          showPagePerItem: true,
          itemFilter: item => _.get('view:selected', item),
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                additionalDocuments: Object.assign(
                  {},
                  fileUploadUI('Lay statements or other evidence', {
                    itemDescription: 'Adding additional evidence:',
                    fileUploadUrl: `${
                      environment.API_URL
                    }/v0/upload_supporting_evidence`,
                    addAnotherLabel: 'Add Another Document',
                    fileTypes: [
                      'pdf',
                      'jpg',
                      'jpeg',
                      'png',
                      'gif',
                      'bmp',
                      'tif',
                      'tiff',
                      'txt',
                    ],
                    maxSize: FIFTY_MB,
                    createPayload: file => {
                      const payload = new FormData();
                      payload.append(
                        'supporting_evidence_attachment[file_data]',
                        file,
                      );

                      return payload;
                    },
                    parseResponse: (response, file) => {
                      return {
                        name: file.name,
                        confirmationCode: response.data.attributes.guid,
                      };
                    },
                    // this is the uiSchema passed to FileField for the attachmentId schema
                    // FileField requires this name be used
                    attachmentSchema: {
                      'ui:title': 'Document type',
                    },
                    // this is the uiSchema passed to FileField for the name schema
                    // FileField requires this name be used
                    attachmentName: {
                      'ui:title': 'Document name',
                    },
                  }),
                  { 'ui:description': additionalDocumentDescription },
                ),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['additionalDocuments'],
                  properties: {
                    additionalDocuments: uploadSchema,
                  },
                },
              },
            },
          },
        },
        evidenceSummary: {
          title: (formData) => `${formData.name} evidence summary`,
          path: 'supporting-evidence/:index/evidence-summary',
          showPagePerItem: true,
          itemFilter: (item) => (_.get('view:hasEvidence', item) && _.get('view:selected', item)),
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': 'Summary of evidence',
                'ui:field': evidenceSummaryView
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
        expedited: {
          title: 'Fully developed claim program',
          path: 'additional-information/fdc',
          uiSchema: {
            'ui:description': FDCDescription,
            standardClaim: {
              'ui:title':
                'Do you want to apply using the Fully Developed Claim program?',
              'ui:widget': 'yesNo',
              'ui:options': {
                yesNoReverse: true,
                labels: {
                  Y: 'Yes, I have uploaded all my supporting documents.',
                  N: 'No, I have some extra information that I will submit to VA later.'
                }
              }
            },
            'view:fdcWarning': {
              'ui:description': FDCWarning,
              'ui:options': {
                hideIf: (formData) => _.get('standardClaim', formData)
              }
            },
            'view:noFDCWarning': {
              'ui:description': noFDCWarning,
              'ui:options': {
                hideIf: (formData) => !_.get('standardClaim', formData)
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              standardClaim,
              'view:fdcWarning': {
                type: 'object',
                properties: {},
              },
              'view:noFDCWarning': {
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
