import _ from 'lodash/fp';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/complaint-tool-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SchoolSelectField from '../../components/SchoolSelectField.jsx';

const { educationDetails } = fullSchema.properties;

const { school } = educationDetails;
import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
import dateUI from 'us-forms-system/lib/js/definitions/date';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';

import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

import { transform } from '../helpers';

const {
  name: schoolName,
  address: schoolAddress
} = school.oneOf[0].schoolInformation.properties;

const {
  street: schoolStreet,
  street2: schoolStreet2,
  city: schoolCity,
  state: schoolState,
  country: schoolCountry,
  postalCode: schoolPostalCode
} = schoolAddress.properties;

const {
  onBehalfOf,
  fullName,
  dob,
  serviceAffiliation,
  serviceBranch,
  serviceDateRange,
  anonymousEmail,
  applicantEmail,
  address: applicantAddress,
  phone,
  issue,
  issueDescription,
  issueResolution
} = fullSchema.properties;

const {
  usaPhone,
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
  defaultDefinitions: {
    date,
    dateRange,
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
            ), {
              'ui:options':
              {
                hideIf: isNotVeteranOrServiceMember,
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              }
            }),
            anonymousEmail: {
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
              anonymousEmail
            }
          }
        },
        contactInformation: {
          path: 'contact-information',
          title: 'Contact Information',
          depends: (formData) => formData.onBehalfOf !== anonymous,
          uiSchema: {
            address: {
              street: {
                'ui:title': 'Address line 1'
              },
              street2: {
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
                'ui:title': 'Postal code',
                'ui:errorMessages': {
                  pattern: 'Please enter a valid 5 digit postal code'
                },
                'ui:options': {
                  widgetClassNames: 'va-input-medium-large',
                }
              }
            },
            applicantEmail: {
              'ui:title': 'Email address',
              'ui:errorMessages': {
                pattern: 'Please put your email in this format x@x.xxx'
              }
            },
            'view:applicantEmailConfirmation': {
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
              'applicantEmail',
              'view:applicantEmailConfirmation'
            ],
            properties: {
              address: applicantAddress,
              applicantEmail,
              'view:applicantEmailConfirmation': applicantEmail,
              phone
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
    },
    schoolInformation: {
      title: 'School Information',
      pages: {
        schoolInformation: {
          path: 'school-information',
          title: 'School Information',
          uiSchema: {
            school: {
              facilityCode: {
                'ui:title': 'Please click on the button to search for your school.',
                'ui:field': SchoolSelectField,
                'ui:required': formData => !_.get('school.view:cannotFindSchool', formData),
                'ui:options': {
                  hideIf: formData => formData.school['view:cannotFindSchool']
                }
              },
              'view:manualSchoolEntry': {
                name: {
                  'ui:title': 'Name',
                  'ui:required': formData => _.get('school.view:cannotFindSchool', formData)
                },
                street: {
                  'ui:title': 'Address line 1',
                  'ui:required': formData => _.get('school.view:cannotFindSchool', formData)
                },
                street2: {
                  'ui:title': 'Address line 2'
                },
                city: {
                  'ui:title': 'City',
                  'ui:required': formData => _.get('school.view:cannotFindSchool', formData)
                },
                state: {
                  'ui:title': 'State',
                  'ui:required': formData => _.get('school.view:cannotFindSchool', formData)
                },
                country: {
                  'ui:title': 'Country',
                  'ui:required': formData => _.get('school.view:cannotFindSchool', formData)
                },
                postalCode: {
                  'ui:title': 'Postal Code',
                  'ui:required': formData => _.get('school.view:cannotFindSchool', formData),
                  'ui:errorMessages': {
                    pattern: 'Please enter a valid 5 digit postal code'
                  },
                  'ui:options': {
                    widgetClassNames: 'va-input-medium-large'
                  }
                },
                'ui:options': {
                  hideIf: formData => !formData.school['view:cannotFindSchool']
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              school: {
                type: 'object',
                properties: {
                  facilityCode: { // TODO: determine whether to store facility ID
                    type: 'string'
                  },
                  'view:cannotFindSchool': {
                    title: 'I can’t find my school',
                    type: 'boolean'
                  },
                  'view:manualSchoolEntry': {
                    type: 'object',
                    properties: {
                      name: schoolName,
                      street: schoolStreet,
                      street2: schoolStreet2,
                      city: schoolCity,
                      state: schoolState,
                      country: schoolCountry,
                      postalCode: schoolPostalCode
                    }
                  }
                }
              }
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
              'ui:title': 'Which topic best describes your feedback? (Select all that apply)',
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
                'other'
              ],
              recruiting: {
                'ui:title': 'Recruiting or marketing practices'
              },
              studentLoans: {
                'ui:title': 'Student loan'
              },
              quality: {
                'ui:title': 'Quality of education'
              },
              creditTransfer: {
                'ui:title': 'Transfer of credits'
              },
              accreditation: {
                'ui:title': 'Accreditation'
              },
              jobOpportunities: {
                'ui:title': 'Post-graduation job opportunity'
              },
              gradePolicy: {
                'ui:title': 'Grade policy'
              },
              refundIssues: {
                'ui:title': 'Refund issues'
              },
              financialIssues: {
                'ui:title': 'Financial concern (for example, tuition or fee changes)'
              },
              changeInDegree: {
                'ui:title': 'Change in degree plan or requirements'
              },
              transcriptRelease: {
                'ui:title': 'Release of transcripts'
              },
              other: {
                'ui:title': 'Other'
              }
            },
            issueDescription: {
              'ui:title': 'Please write your feedback and any details about your issue in the space below. (32,000 characters maximum)',
              'ui:widget': 'textarea',
              'ui:options': {
                rows: 5,
                maxLength: 32000
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
