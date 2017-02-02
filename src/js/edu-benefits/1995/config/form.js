import _ from 'lodash/fp';

import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';
import { address, phone } from '../../../common/schemaform/definitions';
import { uiFullName, uiSSN, uiDateRange, uiDate, uiPhone } from '../../../common/schemaform/uiDefinitions';
import { validateEmailsMatch } from '../../../common/schemaform/validation';

import { benefitsLabels, educationTypeLabels, transformForSubmit, enumToNames } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ServicePeriodView from '../components/ServicePeriodView';

const {
  veteranFullName,
  veteranSocialSecurityNumber,
  vaFileNumber,
  benefit,
  toursOfDuty,
  civilianBenefitsAssistance,
  newSchool,
  educationObjective,
  nonVaAssistance,
  oldSchool,
  trainingEndDate,
  reasonForChange
} = fullSchema1995.properties;

const {
  educationType
} = fullSchema1995.definitions;

const formConfig = {
  urlPrefix: '/1995/',
  submitUrl: '/v0/education_benefits_claims/1995',
  trackingPrefix: 'edu-1995-',
  transformForSubmit,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: fullSchema1995.definitions,
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-1995',
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          initialData: {},
          uiSchema: {
            veteranFullName: uiFullName,
            veteranSocialSecurityNumber: _.assign(uiSSN, {
              'ui:required': (form) => !form['view:noSSN']
            }),
            'view:noSSN': {
              'ui:title': 'I don\'t have a Social Security number',
              'ui:options': {
                hideOnReviewIfFalse: true
              }
            },
            vaFileNumber: {
              'ui:required': (form) => !!form['view:noSSN'],
              'ui:title': 'File number',
              'ui:errorMessages': {
                pattern: 'File number must be 8 digits and (optionally) start with C'
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
              veteranFullName,
              veteranSocialSecurityNumber,
              'view:noSSN': {
                type: 'boolean'
              },
              vaFileNumber
            }
          }
        },
      }
    },
    benefitSelection: {
      title: 'Benefit Selection',
      pages: {
        benefitSelection: {
          title: 'Benefit selection',
          path: 'benefits-eligibility/benefit-selection',
          initialData: {},
          uiSchema: {
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you:'
            }
          },
          schema: {
            type: 'object',
            required: ['benefit'],
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
        servicePeriods: {
          path: 'military-history/service-periods',
          title: 'Service periods',
          initialData: {
            toursOfDuty: [{
              dateRange: {}
            }]
          },
          uiSchema: {
            toursOfDuty: {
              'ui:title': 'Service periods',
              'ui:description': 'Please record all your periods of service',
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView,
                hideTitle: true
              },
              items: {
                serviceBranch: {
                  'ui:title': 'Branch of service'
                },
                dateRange: uiDateRange('Start of service period', 'End of service period')
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty
            }
          }
        },
        militaryHistory: {
          title: 'Military history',
          path: 'military-history/military-service',
          initialData: {},
          uiSchema: {
            hasServiceBefore1978: {
              'ui:title': 'Do you have any periods of service that began before 1978?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              hasServiceBefore1978: {
                type: 'boolean'
              }
            }
          }
        },
        contributions: {
          title: 'Contributions',
          path: 'military-history/contributions',
          initialData: {},
          uiSchema: {
            civilianBenefitsAssistance: {
              'ui:title': 'I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA'
            }
          },
          schema: {
            type: 'object',
            properties: {
              civilianBenefitsAssistance
            }
          }
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        newSchool: {
          path: 'school-selection/new-school',
          title: 'New school, university, or training facility',
          initialData: {
            newSchool: {
              address: {}
            }
          },
          uiSchema: {
            'ui:title': 'New school, university, or training facility',
            educationType: {
              'ui:title': 'Type of education or training'
            },
            newSchool: {
              name: {
                'ui:title': 'Name of school, university, or training facility'
              },
              address: {
                'ui:title': 'Address'
              }
            },
            educationObjective: {
              'ui:title': 'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
              'ui:widget': 'textarea'
            },
            nonVaAssistance: {
              'ui:title': 'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              educationType: _.assign(educationType, {
                enumNames: enumToNames(educationType.enum, educationTypeLabels)
              }),
              newSchool,
              educationObjective,
              nonVaAssistance
            }
          }
        },
        oldSchool: {
          path: 'school-selection/old-school',
          title: 'Old school, university, or training facility',
          initialData: {
            oldSchool: {
              address: {}
            }
          },
          uiSchema: {
            'ui:title': 'Old school, university, or training facility',
            oldSchool: {
              name: {
                'ui:title': 'Name of school, university, or training facility'
              },
              address: {
                'ui:title': 'Address'
              }
            },
            trainingEndDate: _.merge(uiDate, { 'ui:title': 'When did you stop training?' }),
            reasonForChange: {
              'ui:title': 'Why did you stop training?'
            }
          },
          schema: {
            type: 'object',
            properties: {
              oldSchool,
              trainingEndDate,
              reasonForChange
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
              'ui:title': 'How would you prefer to be contacted if VA has questions about your application?',
              'ui:widget': 'radio'
            },
            otherContactInfo: {
              'ui:title': 'Other contact information',
              'ui:description': 'Please enter as much contact information as possible so VA can get in touch with you, if necessary.',
              email: {
                'ui:validations': [
                  validateEmailsMatch
                ],
                email: {
                  'ui:title': 'Email address'
                },
                confirmEmail: {
                  'ui:title': 'Re-enter email address',
                  'ui:options': {
                    hideOnReview: true
                  }
                }
              },
              homePhone: _.assign(uiPhone, {
                'ui:title': 'Primary telephone number'
              }),
              mobilePhone: _.assign(uiPhone, {
                'ui:title': 'Mobile telephone number'
              })
            }
          },
          schema: {
            type: 'object',
            definitions: {
              phone
            },
            properties: {
              preferredContactMethod: {
                type: 'string',
                'enum': ['email', 'phone', 'mail'],
                enumNames: ['Email', 'Phone', 'Mail']
              },
              address,
              otherContactInfo: {
                type: 'object',
                properties: {
                  email: {
                    type: 'object',
                    required: ['email', 'confirmEmail'],
                    properties: {
                      email: {
                        type: 'string',
                        format: 'email'
                      },
                      confirmEmail: {
                        type: 'string',
                        format: 'email'
                      }
                    }
                  },
                  homePhone: {
                    $ref: '#/definitions/phone'
                  },
                  mobilePhone: {
                    $ref: '#/definitions/phone'
                  }
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
                hasServiceBefore1978: true
              }
            }
          },
          uiSchema: {
            serviceBefore1977: {
              married: {
                'ui:title': 'Are you currently married?',
                'ui:widget': 'yesNo'
              },
              haveDependents: {
                'ui:title': 'Do you have any children who are under age 18? Or do you have any children who are over age 18 but under 23, not married, and attending school? Or do you have any children of any age who are permanently disabled for mental or physical reasons?',
                'ui:widget': 'yesNo'
              },
              parentDependent: {
                'ui:title': 'Do you have a parent who is dependent on your financial support?',
                'ui:widget': 'yesNo'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              serviceBefore1977: {
                type: 'object',
                properties: {
                  married: {
                    type: 'boolean'
                  },
                  haveDependents: {
                    type: 'boolean'
                  },
                  parentDependent: {
                    type: 'boolean'
                  }
                },
                required: ['married', 'haveDependents', 'parentDependent']
              }
            }
          }
        },
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          initialData: {},
          uiSchema: {
            changeDirectDeposit: {
              'ui:title': 'Do you want to start, stop or continue using direct deposit?',
              'ui:widget': 'radio'
            },
            accountType: {
              'ui:title': 'Account type',
              'ui:widget': 'radio'
            },
            accountNumber: {
              'ui:title': 'Account number'
            },
            routingNumber: {
              'ui:title': 'Routing number'
            }
          },
          schema: {
            type: 'object',
            properties: {
              changeDirectDeposit: {
                type: 'string',
                'enum': ['start', 'stop', 'continue'],
                enumNames: ['Start', 'Stop', 'Continue']
              },
              accountType: {
                type: 'string',
                'enum': ['checking', 'savings'],
                enumNames: ['Checking', 'Savings']
              },
              accountNumber: {
                type: 'string'
              },
              routingNumber: {
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
