import React from 'react';
import _ from 'lodash/fp';
import { fullName, ssn, dateRange, date, address, phone } from '../../../common/schemaform/definitions';
import { uiFullName, uiSSN, uiDateRange, uiDate, uiPhone } from '../../../common/schemaform/uiDefinitions';
import { validateGroup, validateEmailsMatch } from '../../../common/schemaform/validation';
import IntroductionPage from '../components/IntroductionPage';

const formConfig = {
  urlPrefix: '/1995/',
  submitUrl: '/v0/education_benefits_claims/1995',
  introduction: IntroductionPage,
  confirmation: null,
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          initialData: {},
          uiSchema: {
            'ui:title': 'Veteran information',
            veteranFullName: uiFullName,
            veteranSocialSecurityNumber: _.assign(uiSSN, {
              'ui:requiredIf': (form) => !form.noSSN
            }),
            noSSN: {
              'ui:title': 'I don\'t have a Social Security Number',
              'ui:options': {
                hideOnReviewIfFalse: true
              }
            },
            fileNumber: {
              'ui:requiredIf': (form) => form.noSSN,
              'ui:title': 'File number',
              'ui:errorMessages': {
                pattern: 'File number must be 8 digits and (optionally) start with C'
              }
            }
          },
          schema: {
            type: 'object',
            definitions: {
              fullName,
              ssn
            },
            required: ['veteranFullName'],
            properties: {
              veteranFullName: {
                $ref: '#/definitions/fullName'
              },
              veteranSocialSecurityNumber: {
                $ref: '#/definitions/ssn'
              },
              noSSN: {
                type: 'boolean'
              },
              fileNumber: {
                type: 'string',
                pattern: '[cC]{0,1}\\d{8}'
              }
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
          path: 'benefits-eligibility/benefits-selection',
          initialData: {},
          uiSchema: {
            'ui:title': 'Benefit selection',
            benefitsSelected: {
              'ui:title': 'Select the benefit that is the best match for you:',
              'ui:options': {
                showFieldLabel: true,
                classNames: 'form-errorable-group'
              },
              'ui:validations': [
                validateGroup('Please select at least one benefit')
              ],
              chapter33: {
                'ui:title': <p>Post-9/11 GI Bill (Chapter 33)<br/><a href="/education/gi-bill/post-9-11/" target="_blank">Learn more</a></p>,
              },
              chapter30: {
                'ui:title': <p>Montgomery GI Bill (MGIB-AD, Chapter 30)<br/><a href="/education/gi-bill/montgomery-active-duty/" target="_blank">Learn more</a></p>
              },
              chapter1606: {
                'ui:title': <p>Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)<br/><a href="/education/gi-bill/montgomery-selected-reserve/" target="_blank">Learn more</a></p>
              },
              chapter32: {
                'ui:title': <p>Post-Vietnam Era Veterans' Educational Assistance Program<br/>(VEAP, Chapter 32)<br/><a href="/education/other-educational-assistance-programs/veap/" target="_blank">Learn more</a></p>
              },
              chapter1607: {
                'ui:title': 'Reserve Educational Assistance Program (REAP, Chapter 1607)'
              },
              transferOfEntitlement: {
                'ui:title': 'Transfer of Entitlement Program'
              }
            }
          },
          schema: {
            type: 'object',
            required: ['benefitsSelected'],
            properties: {
              benefitsSelected: {
                type: 'object',
                properties: {
                  chapter33: {
                    type: 'boolean'
                  },
                  chapter30: {
                    type: 'boolean'
                  },
                  chapter1606: {
                    type: 'boolean'
                  },
                  chapter32: {
                    type: 'boolean'
                  },
                  chapter1607: {
                    type: 'boolean'
                  },
                  transferOfEntitlement: {
                    type: 'boolean'
                  }
                }
              }
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
            'ui:title': 'Service periods',
            toursOfDuty: {
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
              toursOfDuty: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    serviceBranch: {
                      type: 'string'
                    },
                    dateRange: _.merge(dateRange, {
                      required: ['from']
                    })
                  },
                  required: [
                    'dateRange',
                    'serviceBranch'
                  ]
                }
              }
            }
          }
        },
        militaryHistory: {
          title: 'Military history',
          path: 'military-history/military-service',
          initialData: {},
          uiSchema: {
            'ui:title': 'Military history',
            hasServiceBefore1978: {
              'ui:title': 'Do you have any periods of service that began before 1978?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            required: ['hasServiceBefore1978'],
            properties: {
              hasServiceBefore1978: {
                type: 'boolean'
              }
            }
          }
        },
        contributions: {
          title: 'Military history',
          path: 'military-history/contributions',
          initialData: {},
          uiSchema: {
            'ui:title': 'Contributions',
            civilianBenefitsAssistance: {
              'ui:title': 'I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA'
            }
          },
          schema: {
            type: 'object',
            properties: {
              civilianBenefitsAssistance: {
                type: 'boolean'
              }
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
            school: {
              address: {}
            }
          },
          uiSchema: {
            'ui:title': 'New school, university, or training facility',
            educationType: {
              'ui:title': 'Type of education or training'
            },
            school: {
              name: {
                'ui:title': 'Name of school, university, or training facility'
              }
            },
            educationObjective: {
              'ui:title': 'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
              'ui:widget': 'textarea'
            },
            additionalContributions: {
              'ui:title': 'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              educationType: {
                type: 'string',
                'enum': ['college', 'correspondence', 'apprenticeship', 'flightTraining', 'testReimbursement', 'licensingReimbursement', 'tuitionTopUp']
              },
              school: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  address: _.omit('required', address)
                }
              },
              educationObjective: {
                type: 'string'
              },
              additionalContributions: {
                type: 'boolean'
              }
            }
          }
        },
        oldSchool: {
          path: 'school-selection/old-school',
          title: 'Old school, university, or training facility',
          initialData: {
            school: {
              address: {}
            }
          },
          uiSchema: {
            'ui:title': 'Old school, university, or training facility',
            school: {
              name: {
                'ui:title': 'Name of school, university, or training facility'
              }
            },
            stopTrainingDate: _.merge(uiDate, { 'ui:title': 'When did you stop training?' }),
            stopTrainingReason: {
              'ui:title': 'Why did you stop training?'
            }
          },
          schema: {
            type: 'object',
            properties: {
              school: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  address: _.omit('required', address)
                }
              },
              stopTrainingDate: date,
              stopTrainingReason: {
                type: 'string'
              }
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
            'ui:title': 'Contact information',
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
              hasServiceBefore1978: true
            }
          },
          uiSchema: {
            'ui:title': 'Dependents',
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
            required: ['serviceBefore1977'],
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
            'ui:title': 'Direct deposit',
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
