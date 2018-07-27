import _ from 'lodash/fp';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/complaint-tool-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';

import { transform } from '../helpers';

import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

const { issue, issueDescription, issueResolution } = fullSchema.properties;

const {
  address,
  email,
  phone
} = fullSchema.properties;

// TODO: update with new BE schema
const {
  street: applicantAddress,
  street2: applicantAddress2,
  city: applicantCity,
  state: applicantState,
  country: applicantCountry,
  postalCode: applicantPostalCode
} = address.properties;

const {
  usaPhone,
} = fullSchema.definitions;

const myself = 'Myself';
const someoneElse = 'Someone else';
const anonymous = 'anonymous';

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
  defaultDefinitions: {
    usaPhone
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'GI Bill® School Feedback Tool',
  transformForSubmit: transform,
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
                  [myself]: () => <div className="usa-alert-info no-background-image"><i>(We’ll only share your name with the school.)</i></div>,
                  [someoneElse]: () => <div className="usa-alert-info no-background-image"><i>(We’ll only share your name with the school.)</i></div>,
                  [anonymous]: () => <div className="usa-alert-info no-background-image"><i>(Your personal information won’t be shared with anyone outside of VA.)</i></div>
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
                ],
                enumNames: ['Myself', 'Someone else', 'I want to submit my feedback anonymously']
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
        },
        contactInformation: {
          path: 'contact-information',
          title: 'Contact Information',
          depends: (formData) => formData.onBehalfOf !== anonymous,
          uiSchema: {
            address: {
              'ui:title': 'Address line 1'
            },
            address2: {
              'ui:title': 'Address line 2'
            },
            city: {
              'ui:title': 'City'
            },
            state: {
              'ui:title': 'State'
            },
            country: {
              'ui:title': 'Country'
            },
            postalCode: {
              'ui:title': 'Postal code'
            },
            email: {
              'ui:title': 'Email address',
              'ui:errorMessages': {
                pattern: 'Please put your email in this format x@x.xxx'
              }
            },
            'view:emailConfirmation': {
              'ui:title': 'Re-enter email address',
              'ui:errorMessages': {
                pattern: 'Please enter a valid email address'
              }
            },
            phone: phoneUI('Phone number')
          },
          schema: {
            type: 'object',
            required: [
              'address',
              'city',
              'state',
              'country',
              'postalCode',
              'email',
              'view:emailConfirmation'
            ],
            properties: {
              address: applicantAddress,
              address2: applicantAddress2,
              city: applicantCity,
              state: applicantState,
              country: applicantCountry,
              postalCode: applicantPostalCode,
              email,
              'view:emailConfirmation': email,
              phone
            }
          }
        }
      }
    },
    issueInformation: {
      title: 'Feedback Information',
      pages: {
        issueInformation: {
          path: 'feedback-information',
          title: 'Feedback Information',
          uiSchema: {
            issue: {
              'ui:title': 'Which describes your feedback? (Select all that apply)',
              'ui:validations': [
                validateBooleanGroup
              ],
              'ui:options': {
                showFieldLabel: true
              },
              'ui:errorMessages': {
                atLeastOne: 'Please select at least one'
              },
              'ui:order': [
                'Recruiting/Marketing Practices',
                'Accreditation',
                'Financial Issues (e.g. Tuition/Fee charges)',
                'Student Loans',
                'Post-graduation Job Opportunities',
                'Change in degree plan/requirements',
                'Quality of Education',
                'Grade Policy',
                'Release of Transcripts',
                'Transfer of Credits',
                'Refund Issues'
              ],
              'Recruiting/Marketing Practices': {
                'ui:title': 'Recruiting or marketing practices'
              },
              'Student Loans': {
                'ui:title': 'Student loan'
              },
              'Quality of Education': {
                'ui:title': 'Quality of education'
              },
              'Transfer of Credits': {
                'ui:title': 'Transfer of credits'
              },
              Accreditation: {
                'ui:title': 'Accreditation'
              },
              'Post-graduation Job Opportunities': {
                'ui:title': 'Post-graduation job opportunity'
              },
              'Grade Policy': {
                'ui:title': 'Grade policy'
              },
              'Refund Issues': {
                'ui:title': 'Refund issues'
              },
              'Financial Issues (e.g. Tuition/Fee charges)': {
                'ui:title': 'Financial concern (for example, tuition or fee changes)'
              },
              'Change in degree plan/requirements': {
                'ui:title': 'Change in degree plan or requirements'
              },
              'Release of Transcripts': {
                'ui:title': 'Release of transcripts'
              }
            },
            issueDescription: {
              'ui:title': 'Please give us your feedback and any details about your issue. (1,000 characters maximum)',
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 5,
                maxLength: 1000
              },
            },
            issueResolution: {
              'ui:title': 'What do you think would be a fair way to resolve your issue? (1,000 characters maximum)',
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 5,
                maxLength: 1000
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'issue',
              'issueDescription',
              'issueResolution'
            ],
            properties: {
              issue,
              issueDescription,
              issueResolution
            }
          }
        }
      }
    }
  }
};

export default formConfig;
