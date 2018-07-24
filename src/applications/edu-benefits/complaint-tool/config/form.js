import _ from 'lodash/fp';
import React from 'react';
// import fullSchema from 'vets-json-schema/dist/686-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const myself = 'Myself';
const someoneElse = 'Someone else';
const anonymous = 'I want to submit my feedback anonymously';

function isNotAnonymous(formData) {
  if (!!formData && formData !== anonymous) {
    return true;
  }
  return false;
}


const suffixes = [
  'Jr.',
  'Sr.',
  'II',
  'III',
  'IV'
];

const date = {
  pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
  type: 'string'
};

const dateRange = {
  type: 'object',
  properties: {
    from: date,
    to: date
  }
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'complaint-tool',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '686',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'GI Bill® School Feedback Tool',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: {
            onBehalfOf: {
              'ui:widget': 'radio',
              'ui:title': 'I’m submitting feedback on behalf of...',
              'ui:options': {
                nestedContent: {
                  // these descriptions will not work using a const, must use a string

                  // 'Myself' will give a lint error, but this works
                  Myself: () => <div className="usa-alert-info no-background-image"><i>(We’ll only share your name with the school.)</i></div>,
                  'Someone else': () => <div className="usa-alert-info no-background-image"><i>(We’ll only share your name with the school.)</i></div>,
                  'I want to submit my feedback anonymously': () => <div className="usa-alert-info no-background-image"><i>(Your personal information won’t be shared with anyone outside of VA.)</i></div>
                },
                expandUnderClassNames: 'schemaform-expandUnder',
              }
            },
            fullName: _.merge(fullNameUI, {
              prefix: {
                'ui:title': 'Prefix',
                'ui:options': {
                  widgetClassNames: 'form-select-medium'
                }
              },
              first: {
                'ui:title': 'Your first name',
                'ui:required': (formData) => !!formData && (formData.onBehalfOf !== anonymous)
              },
              last: {
                'ui:title': 'Your last name',
                'ui:required': (formData) => !!formData && (formData.onBehalfOf !== anonymous)
              },
              middle: {
                'ui:title': 'Your middle name'
              },
              suffix: {
                'ui:title': 'Your suffix'
              },
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: isNotAnonymous
              }
            }),
            dob: {
              'ui:title': 'Date of birth',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: isNotAnonymous
              }
            },
            serviceAffiliation: { // could wrap service info in an object
              'ui:title': 'Service affiliation',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              },
              'ui:required': (formData) => !!formData && (formData.onBehalfOf === myself)
            },
            serviceBranch: {
              'ui:title': 'Branch',
              'ui:options': {
                hideIf: (formData) => {
                  if (!formData.serviceAffiliation || formData.serviceAffiliation !== 'Veteran') {
                    return true;
                  }
                  return false;
                },
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              }
            },
            serviceDateRange: _.merge(dateRangeUI(
              'Service start date',
              'Service end date',
              'End of service must be after start of service'
            ),
            {
              'ui:options': {
                hideIf: (formData) => {
                  if (!formData.serviceAffiliation || formData.serviceAffiliation !== 'Veteran') {
                    return true;
                  }
                  return false;
                },
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              }
            }),
            email: {
              'ui:title': 'Email',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: anonymous
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'onBehalfOf',
            ],
            properties: {
              onBehalfOf: {
                type: 'string',
                'enum': [
                  myself,
                  someoneElse,
                  anonymous
                ]
              },
              fullName: {
                type: 'object',
                properties: {
                  prefix: {
                    type: 'string',
                    'enum': [
                      'Mr.',
                      'Mrs.',
                      'Ms.',
                      'Dr.',
                      'Other'
                    ]
                  },
                  first: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100
                  },
                  middle: {
                    type: 'string'
                  },
                  last: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100
                  },
                  suffix: {
                    type: 'string',
                    'enum': suffixes
                  }
                },
                required: [
                  'first',
                  'last'
                ]
              },
              dob: {
                type: 'string',
                format: 'date'
              },
              serviceAffiliation: { // design may change
                type: 'string',
                'enum': [
                  'Service Member',
                  'Spouse or Family Member',
                  'Veteran',
                  'Other'
                ]
              },
              serviceBranch: {
                type: 'string',
                'enum': [
                  'Army',
                  'Navy',
                  'Marines',
                  'Air Force',
                  'Coast Guard',
                  'NOAA/PHS'
                ]
              },
              serviceDateRange: dateRange,
              email: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    issueInformation: {
      title: 'Feeback Information',
      pages: {
        issueInformation: {
          path: 'feedback-information',
          title: 'Feedback Information',
          uiSchema: {
            'view:issueType': {
              'ui:title': 'Which describes the issue?',
              'ui:validations': [
                validateBooleanGroup
              ],
              'ui:options': {
                showFieldLabel: true
              },
              'ui:errorMessages': {
                atLeastOne: 'Please select at least one'
              },
            },
            complaint: {
              'ui:title': 'Please give us your feedback and any details about your issue.',
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 5
              }
            },
            resolution: {
              'ui:title': 'What do you think would be a fair way to resolve your issue?',
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 5
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'view:issueType',
              'complaint',
              'resolution'
            ],
            properties: {
              'view:issueType': {
                type: 'object',
                properties: {
                  'Recruiting or marketing practices': {
                    type: 'boolean',
                  },
                  Accreditation: {
                    type: 'boolean'
                  },
                  'Financial concern (for example, tuition or fee changes)': {
                    type: 'boolean'
                  },
                  'Student loan': {
                    type: 'boolean'
                  },
                  'Post-graduation job opportunity': {
                    type: 'boolean'
                  },
                  'Change in degree plan or requirements': {
                    type: 'boolean'
                  },
                  'Quality of education': {
                    type: 'boolean'
                  },
                  'Grade policy': {
                    type: 'boolean'
                  },
                  'Release of transcripts': {
                    type: 'boolean'
                  },
                }
              },
              complaint: {
                type: 'string'
              },
              resolution: {
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
