import _ from 'lodash/fp';

// Note: This is still the 1995 schema
import fullSchema5490 from 'vets-json-schema/dist/change-of-program-schema.json';

import { validateMatch } from '../../../common/schemaform/validation';
import {
  benefitsLabels,
  bankAccountChangeLabels,
  preferredContactMethodLabels,
  transform,
  directDepositWarning
} from '../helpers';

import * as bankAccount from '../../../common/schemaform/definitions/bankAccount';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as ssn from '../../../common/schemaform/definitions/ssn';
import * as date from '../../../common/schemaform/definitions/date';
import * as dateRange from '../../../common/schemaform/definitions/dateRange';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as address from '../../../common/schemaform/definitions/address';

import * as educationType from '../../definitions/educationType';
import * as serviceBefore1977 from '../../definitions/serviceBefore1977';

import { enumToNames, showSchoolAddress } from '../../utils/helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ServicePeriodView from '../components/ServicePeriodView';

const {
  vaFileNumber,
  benefit,
  toursOfDuty,
  civilianBenefitsAssistance,
  educationObjective,
  nonVaAssistance,
  // reasonForChange,
  email,
  bankAccountChange
} = fullSchema5490.properties;

const {
  preferredContactMethod,
  // school
} = fullSchema5490.definitions;

const formConfig = {
  urlPrefix: '/5490/',
  submitUrl: '/v0/education_benefits_claims/5490',
  trackingPrefix: 'edu-5490-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    educationType,
    preferredContactMethod,
    serviceBefore1977,
    date: date.schema,
    dateRange: dateRange.schema
  },
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-5490',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-inforamtion',
          title: 'Applicant Information',
          initialData: {},
          uiSchema: {
            applicantFullName: fullName.uiSchema,
            // dob: {},
            // gender: {},
            applicantSSN: ssn.uiSchema,
            // Placeholder name
            applicantFileNumber: {
              'ui:title': 'File number',
              'ui:errorMessages': {
                pattern: 'File number must be 8 digits'
              }
            },
            // relationshipToVeteran: {}
          },
          schema: {
            type: 'object',
            required: ['applicantFullName'],
            properties: {
              applicantFullName: fullName.schema,
              // dob: {},
              // gender: {},
              applicantSSN: ssn.schema,
              // placeholder name
              applicantFileNumber: vaFileNumber
              // applicantVaFileLocation: {}, // Needed??
              // relationshipToVeteran: {}
            }
          }
        }
      }
    },
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: {
            veteranFullName: fullName.uiSchema,
            veteranSocialSecurityNumber: _.assign(ssn.uiSchema, {
              'ui:required': (form) => !form['view:noSSN']
            }),
            'view:noSSN': {
              'ui:title': 'I don’t have a Social Security number',
              'ui:options': {
                hideOnReview: true
              }
            },
            vaFileNumber: {
              'ui:required': (form) => !!form['view:noSSN'],
              'ui:title': 'File number',
              'ui:errorMessages': {
                pattern: 'File number must be 8 digits'
              },
              'ui:options': {
                expandUnder: 'view:noSSN'
              }
            }
          },
          schema: {
            type: 'object',
            required: ['veteranFullName'],
            properties: {
              veteranFullName: fullName.schema,
              veteranSocialSecurityNumber: ssn.schema,
              'view:noSSN': {
                type: 'boolean'
              },
              // Needed?
              vaFileNumber
              // dob: {},
              // miaPow: {},
              // miaPowDate: {},
              // deathDate: {},
              // veteranVaFileLocation: {}, // Needed??
              // criminalRecord: {}, // Better name / location?
              // veteranActiveDuty: {}
            }
          }
        }
      }
    },
    benefitSelection: {
      title: 'Education Benefit',
      pages: {
        benefitSelection: {
          title: 'Education benefit',
          path: 'benefits-eligibility/education-benefit',
          initialData: {},
          uiSchema: {
            benefit: {
              // Change to checkbox?
              'ui:widget': 'radio',
              'ui:title': 'Which benefit(s) would you like to use?'
            }
          },
          schema: {
            type: 'object',
            properties: {
              benefit: _.assign(benefit, {
                enumNames: enumToNames(benefit.enum, benefitsLabels)
              })
            }
          }
        }
      }
    },
    militaryService: {
      title: 'Military History',
      pages: {
        // This seems to be asking for military service of the applicant, not veteran
        // If so, we'll probably need to add in the branch of service field to the
        //  veteranInformation chapter above.
        servicePeriods: {
          path: 'military-history/service-periods',
          title: 'Service periods',
          initialData: {
          },
          uiSchema: {
            'view:newService': {
              'ui:title': 'Do you have any new periods of service to record since you last applied for education benefits?',
              'ui:widget': 'yesNo'
            },
            toursOfDuty: {
              'ui:title': 'Service periods',
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView,
                hideTitle: true,
                expandUnder: 'view:newService'
              },
              items: {
                serviceBranch: {
                  'ui:title': 'Branch of service'
                },
                dateRange: dateRange.uiSchema(
                  'Start of service period',
                  'End of service period',
                  'End of service must be after start of service'
                )
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:newService': {
                type: 'boolean'
              },
              toursOfDuty
            }
          }
        },
        militaryHistory: {
          title: 'Military history',
          path: 'military-history/military-service',
          initialData: {},
          uiSchema: {
            'view:hasServiceBefore1978': {
              'ui:title': 'Do you have any periods of service that began before 1978?',
              'ui:widget': 'yesNo'
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:hasServiceBefore1978': {
                type: 'boolean'
              }
            }
          }
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
        educationHistory: {
          path: 'education-history',
          title: 'Education History',
          uiSchema: {},
          schema: {}
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        newSchool: {
          path: 'school-selection/new-school',
          title: 'School, university, program, or training facility you want to attend',
          initialData: {
            newSchoolAddress: {}
          },
          uiSchema: {
            'ui:title': 'School, university, program, or training facility you want to attend',
            // Broken up because we need to fit educationType between name and address
            // Put back together again in transform()
            newSchoolName: {
              'ui:title': 'Name of school, university, or training facility'
            },
            educationType: educationType.uiSchema,
            newSchoolAddress: _.merge(address.uiSchema(), {
              'ui:options': {
                hideIf: (form) => !showSchoolAddress(form.educationType)
              }
            }),
            educationObjective: {
              'ui:title': 'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
              'ui:widget': 'textarea'
            },
            nonVaAssistance: {
              'ui:title': 'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
              'ui:widget': 'yesNo'
            },
            civilianBenefitsAssistance: {
              'ui:title': 'Are you getting benefits from the U.S. Government as a civilian employee during the same time as you’re seeking benefits from VA?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            required: ['educationType', 'newSchoolName'],
            properties: {
              newSchoolName: {
                type: 'string'
              },
              educationType: educationType.schema,
              newSchoolAddress: address.schema(),
              educationObjective,
              nonVaAssistance,
              civilianBenefitsAssistance
            }
          }
        }
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: {
          title: 'Contact information',
          path: 'personal-information/contact-information',
          initialData: {},
          uiSchema: {
            preferredContactMethod: {
              'ui:title': 'How would you like to be contacted if we have questions about your application?',
              'ui:widget': 'radio'
            },
            veteranAddress: address.uiSchema(),
            'view:otherContactInfo': {
              'ui:title': 'Other contact information',
              'ui:description': 'Please enter as much contact information as possible so we can get in touch with you, if necessary.',
              'ui:validations': [
                validateMatch('email', 'view:confirmEmail')
              ],
              email: {
                'ui:title': 'Email address'
              },
              'view:confirmEmail': {
                'ui:title': 'Re-enter email address',
                'ui:options': {
                  hideOnReview: true
                }
              },
              homePhone: _.assign(phone.uiSchema('Primary telephone number'), {
                'ui:required': (form) => form.preferredContactMethod === 'phone'
              }),
              mobilePhone: phone.uiSchema('Mobile telephone number')
            }
          },
          schema: {
            type: 'object',
            properties: {
              preferredContactMethod: _.assign(preferredContactMethod, {
                enumNames: enumToNames(preferredContactMethod.enum, preferredContactMethodLabels)
              }),
              veteranAddress: address.schema(true),
              'view:otherContactInfo': {
                type: 'object',
                required: ['email', 'view:confirmEmail'],
                properties: {
                  email,
                  'view:confirmEmail': email,
                  homePhone: phone.schema,
                  mobilePhone: phone.schema
                }
              }
            }
          }
        },
        dependents: {
          title: 'Dependents',
          path: 'personal-information/depedents',
          initialData: {},
          depends: {
            militaryHistory: {
              data: {
                'view:hasServiceBefore1978': true
              }
            }
          },
          uiSchema: {
            serviceBefore1977: serviceBefore1977.uiSchema
          },
          schema: {
            type: 'object',
            properties: {
              serviceBefore1977: serviceBefore1977.schema
            }
          }
        },
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          initialData: {},
          uiSchema: {
            bankAccountChange: {
              'ui:title': 'Benefit payment method:',
              'ui:widget': 'radio'
            },
            bankAccount: _.assign(bankAccount.uiSchema, {
              'ui:options': {
                hideIf: (form) => form.bankAccountChange !== 'startUpdate'
              }
            }),
            'view:stopWarning': {
              'ui:description': directDepositWarning,
              'ui:options': {
                hideIf: (form) => form.bankAccountChange !== 'stop'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              bankAccountChange: _.assign(bankAccountChange, {
                enumNames: enumToNames(bankAccountChange.enum, bankAccountChangeLabels)
              }),
              bankAccount: bankAccount.schema,
              'view:stopWarning': {
                type: 'object',
                properties: {}
              }
            }
          }
        }
      }
    }
  }
};


export default formConfig;
