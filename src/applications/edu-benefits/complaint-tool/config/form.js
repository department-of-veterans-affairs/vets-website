import _ from 'lodash/fp';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/complaint-tool-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
import dateUI from 'us-forms-system/lib/js/definitions/date';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import { transform } from '../helpers';

import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

const {
  onBehalfOf,
  fullName,
  dob,
  serviceAffiliation,
  serviceBranch,
  serviceDateRange,
  email
} = fullSchema.properties;

const {
  date,
  dateRange
} = fullSchema.definitions;

const myself = 'Myself';
const someoneElse = 'Someone else';
const anonymous = 'Anonymous';
const anonymousLabel = 'I want to submit my feedback anonymously'; // Only anonymous has a label that differs form its value

function isNotAnonymous(formData) {
  if (!!formData && formData !== anonymous) {
    return true;
  }
  return false;
}

function hasNotAnonymous(formData) {
  return !!formData && (formData.onBehalfOf !== anonymous);
}

function hasMyself(formData) {
  return !!formData && (formData.onBehalfOf === myself);
}

function isNotVeteranOrServiceMember(formData) {
  if (!formData.serviceAffiliation || ((formData.serviceAffiliation !== 'Veteran') && (formData.serviceAffiliation !== 'Service Member'))) {
    return true;
  }
  return false;
}

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'complaint-tool',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'complaint-tool',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'GI Bill® School Feedback Tool',
  transformForSubmit: transform,
  defaultDefinitions: {
    date,
    dateRange
  },
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
                'ui:required': hasNotAnonymous
              },
              last: {
                'ui:title': 'Your last name',
                'ui:required': hasNotAnonymous
              },
              middle: {
                'ui:title': 'Your middle name'
              },
              suffix: {
                'ui:title': 'Your suffix'
              },
              'ui:order': ['prefix', 'first', 'middle', 'last', 'suffix'],
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: isNotAnonymous
              }
            }),
            dob: _.merge(dateUI('Date of birth'), {
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: isNotAnonymous
              }
            }),
            serviceAffiliation: { // could wrap service info in an object
              'ui:title': 'Service affiliation',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              },
              'ui:required': hasMyself,
            },
            serviceBranch: {
              'ui:title': 'Branch of service',
              'ui:options': {
                hideIf: isNotVeteranOrServiceMember,
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
                hideIf: isNotVeteranOrServiceMember,
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
              onBehalfOf: _.set('enumNames', [myself, someoneElse, anonymousLabel], onBehalfOf),
              fullName,
              dob,
              serviceAffiliation,
              serviceBranch,
              serviceDateRange,
              email
            }
          }
        }
      }
    },
    benefitsInformation: {
      title: 'Education Benefits',
      pages: {
        benefitsInformation: {
          path: 'benefits-information',
          title: 'Benefits Information',
          uiSchema: {
            programs: {
              'ui:title': 'Which education benefits have you used? (Select all that apply)',
              'ui:validations': [
                validateBooleanGroup
              ],
              'ui:options': {
                showFieldLabel: true
              },
              'ui:errorMessages': {
                atLeastOne: 'Please select at least one'
              }
            },
            assistance: {
              'view:assistance': {
                'ui:title': 'Which military tuition assistance benefits have you used? (Select all that apply)',
                'ui:options': {
                  showFieldLabel: true
                }
              },
              'view:FFA': {
                'ui:title': 'Have you used any of these other benefits?',
                'ui:options': {
                  showFieldLabel: true
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: ['programs'],
            properties: {
              programs: {
                type: 'object',
                properties: {
                  'Post-9/11 Ch 33': {
                    type: 'boolean',
                    title: 'Post-9/11 GI Bill (Chapter 33)'
                  },
                  'MGIB-AD Ch 30': {
                    type: 'boolean',
                    title: 'Montgomery GI Bill - Active Duty (MGIB-AD, Chapter 30)'
                  },
                  'MGIB-SR Ch 1606': {
                    type: 'boolean',
                    title: 'Montgomery GI Bill - Selected Reserve (MGIB-SR, Chapter 1606)'
                  },
                  TATU: {
                    type: 'boolean',
                    title: 'Tuition Assistance Top-Up'
                  },
                  'DEA Ch 35': {
                    type: 'boolean',
                    title: 'Survivors’ and Dependents’ Assistance (DEA) (Chapter 35)'
                  },
                  'VRE Ch 31': {
                    type: 'boolean',
                    title: 'Vocational Rehabilitation and Employment (VR&E) (Chapter 31)'
                  }
                }
              },
              assistance: {
                type: 'object',
                properties: {
                  'view:assistance': {
                    type: 'object',
                    properties: {
                      TA: {
                        type: 'boolean',
                        title: 'Federal Tuition Assistance (TA)'
                      },
                      'TA-AGR': {
                        type: 'boolean',
                        title: 'State-funded Tuition Assistance (TA) for Servicemembers on Active Guard and Reserve (AGR) duties'
                      },
                      MyCAA: {
                        type: 'boolean',
                        title: 'Military Spouse Career Advancement Accounts (MyCAA)'
                      }
                    }
                  },
                  'view:FFA': {
                    type: 'object',
                    properties: {
                      FFA: {
                        type: 'boolean',
                        title: 'Federal financial aid'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
