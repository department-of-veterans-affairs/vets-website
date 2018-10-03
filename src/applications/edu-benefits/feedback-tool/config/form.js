import _ from 'lodash/fp';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';
import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

import FormFooter from '../../../../platform/forms/components/FormFooter';
import fullNameUI from '../../../../platform/forms/definitions/fullName';
import PrefillMessage from '../../../../platform/forms/save-in-progress/PrefillMessage';
import dataUtils from '../../../../platform/utilities/data/index';
import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';

const { get, omit, set } = dataUtils;

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SchoolSelectField from '../components/SchoolSelectField.jsx';
import GetFormHelp from '../../components/GetFormHelp';

import {
  accreditationLabel,
  changeInDegreeLabel,
  conditionallyShowPrefillMessage,
  creditTransferLabel,
  financialIssuesLabel,
  gradePolicyLabel,
  jobOpportunitiesLabel,
  PREFILL_FLAGS,
  prefillTransformer,
  qualityLabel,
  recordApplicantRelationship,
  recruitingLabel,
  refundIssuesLabel,
  studentLoansLabel,
  submit,
  trackingPrefix,
  transcriptReleaseLabel,
  transform,
  validateMatch,
} from '../helpers';

const {
  address: applicantAddress,
  anonymousEmail,
  applicantEmail,
  educationDetails,
  fullName,
  issue,
  issueDescription,
  issueResolution,
  issueUIDescription,
  onBehalfOf,
  phone,
  serviceAffiliation,
  serviceBranch,
  serviceDateRange,
  socialSecurityNumberLastFour,
} = fullSchema.properties;

const { assistance, programs, school } = educationDetails.properties;
const { address: schoolAddress, name: schoolName } = school.properties;
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
  urlPrefix: '/',
  submitUrl: '/v0/gi_bill_feedbacks',
  submit,
  trackingPrefix,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FEEDBACK-TOOL',
  version: 0,
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
  getHelp: GetFormHelp,
  footerContent: FormFooter,
  transformForSubmit: transform,
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantRelationship: {
          path: 'applicant-relationship',
          title: 'Applicant Relationship',
          uiSchema: {
            'ui:description': recordApplicantRelationship,
            onBehalfOf: {
              'ui:widget': 'radio',
              'ui:title': 'I’m submitting feedback on behalf of...',
              'ui:options': {
                nestedContent: {
                  [myself]: () => (
                    <div className="usa-alert usa-alert-info no-background-image">
                      We’ll only share your name with the school.
                    </div>
                  ),
                  [someoneElse]: () => (
                    <div className="usa-alert usa-alert-info no-background-image">
                      Your name is shared with the school, not the name of the
                      person you’re submitting feedback for.
                    </div>
                  ),
                  [anonymous]: () => (
                    <div className="usa-alert usa-alert-info no-background-image">
                      Anonymous feedback is shared with the school. Your
                      personal information, however, isn’t shared with anyone
                      outside of VA.
                    </div>
                  ),
                },
                expandUnderClassNames: 'schemaform-expandUnder',
              },
            },
            anonymousEmail: {
              'ui:title': 'Email',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: anonymous,
              },
            },
          },
          schema: {
            type: 'object',
            required: ['onBehalfOf'],
            properties: {
              onBehalfOf,
              anonymousEmail,
            },
          },
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
            fullName: _.merge(fullNameUI, {
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
            socialSecurityNumberLastFour: {
              'ui:title':
                'Please provide the last 4 digits of your Social Security number',
              'ui:required': isNotAnonymous,
              'ui:options': {
                widgetClassNames: 'usa-input-medium',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid last 4 digits',
              },
            },
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
              socialSecurityNumberLastFour,
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
            serviceDateRange: dateRangeUI(
              'Service start date',
              'Service end date',
              'End of service must be after start of service',
            ),
          },
          schema: {
            type: 'object',
            properties: {
              serviceBranch,
              serviceDateRange,
            },
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
            applicantEmail: {
              'ui:title': 'Email address',
              'ui:errorMessages': {
                pattern: 'Please put your email in this format x@x.xxx',
                required: 'Please put your email in this format x@x.xxx',
              },
            },
            'view:applicantEmailConfirmation': {
              'ui:title': 'Re-enter email address',
              'ui:errorMessages': {
                pattern: 'Please put your email in this format x@x.xxx',
                required: 'Please put your email in this format x@x.xxx',
              },
            },
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
                'view:FFA': {
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
                        properties: omit('FFA', assistance.properties),
                      },
                      'view:FFA': {
                        type: 'object',
                        properties: {
                          FFA: get('properties.FFA', assistance),
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
                  'view:facilityCode': {
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
                          'view:facilityCode': {
                            type: 'string',
                          },
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
              'ui:options': {
                showFieldLabel: true,
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
                'ui:title': recruitingLabel,
              },
              studentLoans: {
                'ui:title': studentLoansLabel,
              },
              quality: {
                'ui:title': qualityLabel,
              },
              creditTransfer: {
                'ui:title': creditTransferLabel,
              },
              accreditation: {
                'ui:title': accreditationLabel,
              },
              jobOpportunities: {
                'ui:title': jobOpportunitiesLabel,
              },
              gradePolicy: {
                'ui:title': gradePolicyLabel,
              },
              refundIssues: {
                'ui:title': refundIssuesLabel,
              },
              financialIssues: {
                'ui:title': financialIssuesLabel,
              },
              changeInDegree: {
                'ui:title': changeInDegreeLabel,
              },
              transcriptRelease: {
                'ui:title': transcriptReleaseLabel,
              },
              other: {
                'ui:title': 'Other',
              },
            },
            issueDescription: {
              'ui:title':
                'Please write your feedback and any details about your issue in the space below. (32,000 characters maximum)',
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 5,
                maxLength: 32000,
              },
            },
            issueResolution: {
              'ui:title':
                'What do you think would be a fair way to resolve your issue? (1,000 characters maximum)',
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
