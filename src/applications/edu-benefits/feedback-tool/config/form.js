import merge from 'lodash/merge';
import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';

import FormFooter from 'platform/forms/components/FormFooter';
import fullNameUI from 'platform/forms/definitions/fullName';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import dataUtils from 'platform/utilities/data/index';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

const { get, omit, set } = dataUtils;

import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SchoolSelectField from '../components/SchoolSelectField.jsx';

import {
  conditionallyShowPrefillMessage,
  PREFILL_FLAGS,
  prefillTransformer,
  submit,
  trackingPrefix,
  transform,
  validateMatch,
} from '../helpers';
import { applicantRelationship } from '../pages/index';

import migrations from './migrations';

import manifest from '../manifest.json';
import NeedHelp from '../components/NeedHelp';
import { maxCharAllowed } from '../constants';

const {
  address: applicantAddress,
  applicantEmail,
  educationDetails,
  fullName,
  issue,
  issueDescription,
  issueResolution,
  issueUIDescription,
  phone,
  serviceAffiliation,
  serviceBranch,
} = fullSchema.properties;

const { school, programs, assistance } = educationDetails.properties;

const {
  address: schoolAddress,
  name: schoolName,
  facilityCode,
} = school.properties;
const domesticSchoolAddress = schoolAddress.anyOf[0];
const internationalSchoolAddress = schoolAddress.anyOf[1];
const countries = domesticSchoolAddress.properties.country.enum.concat(
  internationalSchoolAddress.properties.country.enum,
); // TODO access via default definition

function configureSchoolAddressSchema(schema) {
  let newSchema = omit('required', schema);
  newSchema = set('type', 'object', newSchema);
  newSchema = set('properties.country.enum', countries, newSchema);
  return set('properties.country.default', 'United States', newSchema);
}

const domesticSchoolAddressSchema = configureSchoolAddressSchema(
  domesticSchoolAddress,
);
const internationalSchoolAddressSchema = configureSchoolAddressSchema(
  internationalSchoolAddress,
);

const { date, dateRange, usaPhone, ssnLastFour } = fullSchema.definitions;

const myself = 'Myself';
const someoneElse = 'Someone else';
const anonymous = 'Anonymous';

function isNotAnonymous(formData) {
  return formData.onBehalfOf !== anonymous;
}

function isMyself(formData) {
  return formData.onBehalfOf === myself;
}

function isNotMyself(formData) {
  return (
    formData.onBehalfOf === someoneElse || formData.onBehalfOf === anonymous
  );
}

function isVeteranOrServiceMember(formData) {
  const nonServiceMemberOrVeteranAffiliations = ['Spouse', 'Child', 'Other'];
  return (
    !isNotMyself(formData) &&
    !nonServiceMemberOrVeteranAffiliations.includes(formData.serviceAffiliation)
  ); // We are defining this in the negative to prevent prefilled data from being hidden, and therefore deleted by default
}

function manualSchoolEntryIsChecked(formData) {
  return get(
    'educationDetails.school.view:searchSchoolSelect.view:manualSchoolEntryChecked',
    formData,
  );
}

function manualSchoolEntryIsNotChecked(formData) {
  return !manualSchoolEntryIsChecked(formData);
}

function isUS(formData) {
  return (
    get(
      'educationDetails.school.view:manualSchoolEntry.address.country',
      formData,
    ) === 'United States'
  );
}

function manualSchoolEntryIsCheckedAndIsUS(formData) {
  return manualSchoolEntryIsChecked(formData) && isUS(formData);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/gi_bill_feedbacks',
  submit,
  trackingPrefix,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FEEDBACK_TOOL,
  saveInProgress: {
    messages: {
      inProgress: 'Your feedback application (FEEDBACK-TOOL) is in progress.',
      expired:
        'Your saved feedback application (FEEDBACK-TOOL) has expired. If you want to apply for feedback, please start a new application.',
      saved: 'Your feedback application has been saved.',
    },
  },
  version: 1,
  migrations,
  prefillEnabled: true,
  prefillTransformer,
  defaultDefinitions: {
    date,
    dateRange,
    usaPhone,
    ssnLastFour,
  },
  savedFormMessages: {
    notFound:
      'Please start over to apply for declaration of status of dependents.',
    noAuth:
      'Please sign in again to continue your application for declaration of status of dependents.',
  },
  title: 'GI Bill® School Feedback Tool',
  preSubmitInfo,
  // getHelp: GetFormHelp,
  getHelp: NeedHelp,
  footerContent: FormFooter,
  transformForSubmit: transform,
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantRelationship: {
          path: 'applicant-relationship',
          title: 'Applicant Relationship',
          uiSchema: applicantRelationship.default.uiSchema,
          schema: applicantRelationship.default.schema,
        },
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant Information',
          depends: isNotAnonymous,
          uiSchema: {
            'ui:description': data =>
              conditionallyShowPrefillMessage(
                PREFILL_FLAGS.APPLICANT_INFORMATION,
                data,
                PrefillMessage,
              ),
            fullName: merge({}, fullNameUI, {
              prefix: {
                'ui:title': 'Prefix',
                'ui:options': {
                  widgetClassNames: 'form-select-medium',
                },
              },
              first: {
                'ui:title': 'Your first name',
              },
              last: {
                'ui:title': 'Your last name',
              },
              middle: {
                'ui:title': 'Your middle name',
              },
              suffix: {
                'ui:title': 'Your suffix',
              },
              'ui:order': ['prefix', 'first', 'middle', 'last', 'suffix'],
            }),
            serviceAffiliation: {
              'ui:title': 'Service affiliation',
              'ui:required': isMyself,
              'ui:options': {
                hideIf: isNotMyself,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              fullName: set('required', ['first', 'last'], fullName),
              serviceAffiliation,
            },
          },
        },
        serviceInformation: {
          path: 'service-information',
          title: 'Service Information',
          depends: isVeteranOrServiceMember,
          uiSchema: {
            'ui:description': data =>
              conditionallyShowPrefillMessage(
                PREFILL_FLAGS.SERVICE_INFORMATION,
                data,
                PrefillMessage,
              ),
            serviceBranch: {
              'ui:title': 'Branch of service',
            },
            serviceDateRange: currentOrPastDateRangeUI(
              'Service start date',
              'Service end date',
              'End of service must be after start of service',
            ),
          },
          schema: {
            type: 'object',
            properties: {
              serviceBranch,
              serviceDateRange: currentOrPastDateRangeSchema,
            },
            required: ['serviceDateRange'],
          },
        },
        contactInformation: {
          path: 'contact-information',
          title: 'Contact Information',
          depends: formData => formData.onBehalfOf !== anonymous,
          uiSchema: {
            'ui:description': data =>
              conditionallyShowPrefillMessage(
                PREFILL_FLAGS.CONTACT_INFORMATION,
                data,
                PrefillMessage,
              ),
            address: {
              street: {
                'ui:title': 'Address line 1',
              },
              street2: {
                'ui:title': 'Address line 2',
              },
              city: {
                'ui:title': 'City',
                'ui:errorMessages': {
                  required: 'Please fill in a valid city',
                },
              },
              state: {
                'ui:title': 'State',
                'ui:errorMessages': {
                  required: 'Please fill in a valid state',
                },
              },
              country: {
                'ui:title': 'Country',
                'ui:errorMessages': {
                  required: 'Please fill in a valid country',
                },
              },
              postalCode: {
                'ui:title': 'Postal code',
                'ui:errorMessages': {
                  pattern: 'Please fill in a valid 5-digit postal code',
                  required: 'Please fill in a valid 5-digit postal code',
                },
                'ui:options': {
                  widgetClassNames: 'va-input-medium-large',
                },
              },
            },
            'ui:validations': [
              validateMatch(
                'applicantEmail',
                'view:applicantEmailConfirmation',
                'email',
              ),
            ],
            applicantEmail: emailUI(),
            'view:applicantEmailConfirmation': emailUI(
              'Re-enter email address',
            ),
            phone: phoneUI('Phone number'),
          },
          schema: {
            type: 'object',
            required: [
              'address',
              'applicantEmail',
              'view:applicantEmailConfirmation',
            ],
            properties: {
              address: applicantAddress,
              applicantEmail,
              'view:applicantEmailConfirmation': applicantEmail,
              phone,
            },
          },
        },
      },
    },
    benefitsInformation: {
      title: 'Education Benefits',
      pages: {
        benefitsInformation: {
          path: 'benefits-information',
          title: 'Benefits Information',
          uiSchema: {
            educationDetails: {
              programs: {
                'ui:title':
                  'Which education benefits have you used? (Select all that apply)',
                'ui:validations': [validateBooleanGroup],
                'ui:options': {
                  showFieldLabel: true,
                },
                'ui:errorMessages': {
                  atLeastOne: 'Please select at least one',
                },
              },
              assistance: {
                'view:assistance': {
                  'ui:title':
                    'Which military tuition assistance benefits have you used? (Select all that apply)',
                  'ui:options': {
                    showFieldLabel: true,
                  },
                },
                'view:ffa': {
                  'ui:title': 'Have you used any of these other benefits?',
                  'ui:options': {
                    showFieldLabel: true,
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              educationDetails: {
                type: 'object',
                required: ['programs'],
                properties: {
                  programs,
                  assistance: {
                    type: 'object',
                    properties: {
                      'view:assistance': {
                        type: 'object',
                        properties: omit('ffa', assistance.properties),
                      },
                      'view:ffa': {
                        type: 'object',
                        properties: {
                          ffa: get('properties.ffa', assistance),
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    schoolInformation: {
      title: 'School Information',
      pages: {
        schoolInformation: {
          path: 'school-information',
          title: 'School Information',
          uiSchema: {
            educationDetails: {
              school: {
                'view:searchSchoolSelect': {
                  facilityCode: {
                    'ui:required': manualSchoolEntryIsNotChecked,
                  },
                  'ui:field': SchoolSelectField,
                },
                'view:manualSchoolEntry': {
                  name: {
                    'ui:title': 'School name',
                    'ui:required': manualSchoolEntryIsChecked,
                  },
                  address: {
                    street: {
                      'ui:title': 'Address line 1',
                      'ui:required': manualSchoolEntryIsChecked,
                    },
                    street2: {
                      'ui:title': 'Address line 2',
                    },
                    street3: {
                      'ui:title': 'Address line 3',
                    },
                    city: {
                      'ui:title': 'City',
                      'ui:required': manualSchoolEntryIsChecked,
                    },
                    state: {
                      'ui:title': 'State',
                      'ui:required': manualSchoolEntryIsCheckedAndIsUS,
                    },
                    country: {
                      'ui:title': 'Country',
                      'ui:required': manualSchoolEntryIsChecked,
                    },
                    postalCode: {
                      'ui:title': 'Postal code',
                      'ui:required': manualSchoolEntryIsCheckedAndIsUS,
                      'ui:errorMessages': {
                        pattern: 'Please enter a valid 5 digit postal code',
                      },
                      'ui:options': {
                        widgetClassNames: 'va-input-medium-large',
                      },
                    },
                    'ui:options': {
                      updateSchema: formData => {
                        if (isUS(formData)) {
                          return domesticSchoolAddressSchema;
                        }
                        return internationalSchoolAddressSchema;
                      },
                    },
                  },
                  'ui:options': {
                    hideIf: manualSchoolEntryIsNotChecked,
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              educationDetails: {
                type: 'object',
                properties: {
                  school: {
                    type: 'object',
                    properties: {
                      'view:searchSchoolSelect': {
                        type: 'object',
                        properties: {
                          facilityCode,
                        },
                      },
                      'view:manualSchoolEntry': {
                        type: 'object',
                        properties: {
                          name: schoolName,
                          address: domesticSchoolAddressSchema,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    issueInformation: {
      title: 'Feedback Information',
      pages: {
        issueInformation: {
          path: 'feedback-information',
          title: 'Feedback Information',
          uiSchema: {
            issue: {
              'ui:title':
                'Which topic best describes your feedback? (Select all that apply)',
              'ui:description': issueUIDescription,
              'ui:validations': [validateBooleanGroup],
              'ui:webComponentField': VaCheckboxGroupField,
              'ui:options': {
                showFieldLabel: true,
                tile: true,
              },
              'ui:errorMessages': {
                atLeastOne: 'Please select at least one',
              },
              'ui:order': [
                'recruiting',
                'accreditation',
                'financialIssues',
                'studentLoans',
                'jobOpportunities',
                'changeInDegree',
                'quality',
                'gradePolicy',
                'transcriptRelease',
                'creditTransfer',
                'refundIssues',
                'other',
              ],
              recruiting: {
                'ui:title': 'Recruiting or marketing practices',
                'ui:description':
                  'The school made inaccurate claims about the quality of its education or its school requirements.',
              },
              studentLoans: {
                'ui:title': 'Student loan',
                'ui:description':
                  'The school didn’t provide you a total cost of your school loan.',
              },
              quality: {
                'ui:title': 'Quality of education',
                'ui:description': 'The school doesn’t have qualified teachers.',
              },
              creditTransfer: {
                'ui:title': 'Transfer of credits',
                'ui:description':
                  'The school isn’t accredited for transfer of credits.',
              },
              accreditation: {
                'ui:title': 'Accreditation',
                'ui:description':
                  'The school is unable to get or keep accreditation.',
              },
              jobOpportunities: {
                'ui:title': 'Post-graduation job opportunity',
                'ui:description':
                  'The school made promises to you about job placement or salary after graduation.',
              },
              gradePolicy: {
                'ui:title': 'Grade policy',
                'ui:description':
                  'The school didn’t give you a copy of its grade policy or it changed its grade policy in the middle of the year.',
              },
              refundIssues: {
                'ui:title': 'Refund issues',
                'ui:description':
                  'The school won’t refund your GI Bill payment.',
              },
              financialIssues: {
                'ui:title': 'Financial concern',
                'ui:description':
                  'The school is charging you a higher tuition or extra fees.',
              },
              changeInDegree: {
                'ui:title': 'Change in degree plan or requirements',
                'ui:description':
                  'The school added new hour or course requirements after you enrolled.',
              },
              transcriptRelease: {
                'ui:title': 'Release of transcripts',
                'ui:description': 'The school won’t release your transcripts.',
              },
              other: {
                'ui:title': 'Other',
              },
            },
            issueDescription: {
              'ui:title':
                'Please write your feedback and any details about your issue in the space below.',
              'ui:widget': 'textarea',
              'ui:description': maxCharAllowed('32,000'),
              'ui:options': {
                rows: 5,
                maxLength: 32000,
              },
            },
            issueResolution: {
              'ui:title':
                'What do you think would be a fair way to resolve your issue?',
              'ui:description': maxCharAllowed('1,000'),
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 5,
                maxLength: 1000,
              },
            },
          },
          schema: {
            type: 'object',
            required: ['issue', 'issueDescription', 'issueResolution'],
            properties: {
              issue,
              issueDescription,
              issueResolution,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
