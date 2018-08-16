import _ from 'lodash/fp';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/complaint-tool-schema.json';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';
import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

import FormFooter from '../../../../platform/forms/components/FormFooter';
import fullNameUI from '../../../../platform/forms/definitions/fullName';
import { get, omit, set } from '../../../../platform/utilities/data';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SchoolSelectField from '../../components/SchoolSelectField.jsx';
import GetFormHelp from '../../components/GetFormHelp';

import { transform, submit } from '../helpers';

const {
  address: applicantAddress,
  anonymousEmail,
  applicantEmail,
  educationDetails,
  fullName,
  issue,
  issueDescription,
  issueResolution,
  onBehalfOf,
  phone,
  serviceAffiliation,
  serviceBranch,
  serviceDateRange,
} = fullSchema.properties;

const { assistance, programs, school } = educationDetails;

const { schoolInformation } = school.oneOf[0];

const domesticSchoolAddress = schoolInformation.oneOf[0];
const internationalSchoolAddress = schoolInformation.oneOf[1];
const countries = domesticSchoolAddress.properties.country.enum.concat(internationalSchoolAddress.properties.country.enum); // TODO access via default definition

const configureSchoolAddressSchema = (schema) => {
  let newSchema = omit('required', schema);
  newSchema = set('properties.country.enum', countries, newSchema);
  return set('properties.country.default', 'United States', newSchema);
};

const domesticSchoolAddressSchema = configureSchoolAddressSchema(domesticSchoolAddress);

const internationalSchoolAddressSchema = configureSchoolAddressSchema(internationalSchoolAddress);

const {
  date,
  dateRange,
  usaPhone,
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
  if (!formData.serviceAffiliation || ((formData.serviceAffiliation !== 'Servicemember') && (formData.serviceAffiliation !== 'Veteran'))) {
    return true;
  }
  return false;
}

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/gi_bill_feedbacks',
  submit,
  trackingPrefix: 'gi_bill_feedback',
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
  getHelp: GetFormHelp,
  footerContent: FormFooter,
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
                  [myself]: () => <div className="usa-alert usa-alert-info no-background-image">We’ll only share your name with the school.</div>,
                  [someoneElse]: () => <div className="usa-alert usa-alert-info no-background-image">Your name is shared with the school, not the name of the person you’re submitting feedback for.</div>,
                  [anonymous]: () => <div className="usa-alert usa-alert-info no-background-image">Anonymous feedback is shared with the school. Your personal information, however, isn’t shared with anyone outside of VA.</div>
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
              onBehalfOf: set('enumNames', [myself, someoneElse, anonymousLabel], onBehalfOf),
              fullName,
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
            educationDetails: {
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
            }
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
                        properties: omit('FFA', assistance.properties)
                      },
                      'view:FFA': {
                        type: 'object',
                        properties: {
                          FFA: get('properties.FFA', assistance)
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
                facilityCode: { // Can we unnest this?
                  facilityCode: {
                    'ui:required': formData => !get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData),
                  },
                  'ui:field': SchoolSelectField,
                },
                'view:manualSchoolEntry': {
                  name: {
                    'ui:title': 'School name',
                    'ui:required': formData => get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData),
                  },
                  address: {
                    street: {
                      'ui:title': 'Address line 1',
                      'ui:required': formData => get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData)
                    },
                    street2: {
                      'ui:title': 'Address line 2'
                    },
                    city: {
                      'ui:title': 'City',
                      'ui:required': formData => get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData)
                    },
                    state: {
                      'ui:title': 'State',
                      'ui:required': formData => get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData) &&  (get('educationDetails.school["view:manualSchoolEntry"].address.country', formData) === 'United States')
                    },
                    country: {
                      'ui:title': 'Country',
                      'ui:required': formData => get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData)
                    },
                    postalCode: {
                      'ui:title': 'Postal code',
                      'ui:required': formData => get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData),
                      'ui:errorMessages': {
                        pattern: 'Please enter a valid 5 digit postal code'
                      },
                      'ui:options': {
                        widgetClassNames: 'va-input-medium-large'
                      }
                    },
                    'ui:options': {
                      updateSchema: (formData) => {
                        const schoolCountry = get('educationDetails.school.view:manualSchoolEntry.address.country', formData);
                        if (schoolCountry !== 'United States') {
                          return internationalSchoolAddressSchema;
                        }
                        return domesticSchoolAddressSchema;
                      }
                    }
                  },
                  'ui:options': {
                    hideIf: formData => !get('educationDetails.school.facilityCode.view:manualSchoolEntryChecked', formData),
                  }
                }
              }
            }
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
                      facilityCode: { // TODO: determine whether to store facility ID
                        type: 'object',
                        properties: {
                          facilityCode: {
                            type: 'string'
                          }
                        }
                      },
                      'view:manualSchoolEntry': {
                        type: 'object',
                        properties: {
                          name: schoolInformation.properties.name,
                          address: domesticSchoolAddress
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
