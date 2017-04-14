import _ from 'lodash/fp';

import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

import {
  bankAccountChangeLabels,
  transform,
  directDepositWarning
} from '../helpers';

import * as bankAccount from '../../../common/schemaform/definitions/bankAccount';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as date from '../../../common/schemaform/definitions/date';
import * as dateRange from '../../../common/schemaform/definitions/dateRange';
import * as address from '../../../common/schemaform/definitions/address';

import educationTypeUISchema from '../../definitions/educationType';
import * as serviceBefore1977 from '../../definitions/serviceBefore1977';
import { uiSchema as toursOfDutyUI } from '../../definitions/toursOfDuty';
import * as veteranId from '../../definitions/veteranId';

import createContactInformationPage from '../../pages/contactInformation';
import createOldSchoolPage from '../../pages/oldSchool';

import { showSchoolAddress, benefitsLabels } from '../../utils/helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  toursOfDuty,
  civilianBenefitsAssistance,
  educationObjective,
  nonVaAssistance
} = fullSchema1995.properties;

const {
  preferredContactMethod,
  educationType,
  bankAccountChange
} = fullSchema1995.definitions;

const formConfig = {
  urlPrefix: '/1995/',
  submitUrl: '/v0/education_benefits_claims/1995',
  trackingPrefix: 'edu-1995-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    preferredContactMethod,
    serviceBefore1977,
    date: date.schema,
    dateRange: dateRange.schema
  },
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-1995',
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran/information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: {
            veteranFullName: fullName.uiSchema,
            'view:veteranId': veteranId.uiSchema
          },
          schema: {
            type: 'object',
            required: ['veteranFullName'],
            properties: {
              veteranFullName: fullName.schema,
              'view:veteranId': veteranId.schema
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
          path: 'benefits/eligibility',
          initialData: {},
          uiSchema: {
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Which benefit are you currently using?',
              'ui:options': {
                labels: benefitsLabels
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              benefit
            }
          }
        }
      }
    },
    militaryService: {
      title: 'Military History',
      pages: {
        servicePeriods: {
          path: 'military/service',
          title: 'Service periods',
          initialData: {
          },
          uiSchema: {
            'view:newService': {
              'ui:title': 'Do you have any new periods of service to record since you last applied for education benefits?',
              'ui:widget': 'yesNo'
            },
            toursOfDuty: _.merge(toursOfDutyUI, {
              'ui:options': { expandUnder: 'view:newService' }
            })
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
          path: 'military/history',
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
            educationType: educationTypeUISchema,
            newSchoolAddress: _.merge(address.uiSchema(), {
              'ui:options': {
                hideIf: (formData) => !showSchoolAddress(formData.educationType)
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
              educationType,
              newSchoolAddress: address.schema(),
              educationObjective,
              nonVaAssistance,
              civilianBenefitsAssistance
            }
          }
        },
        oldSchool: createOldSchoolPage(fullSchema1995)
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: createContactInformationPage(),
        dependents: {
          title: 'Dependents',
          path: 'personal-information/dependents',
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
              'ui:widget': 'radio',
              'ui:options': {
                labels: bankAccountChangeLabels
              }
            },
            bankAccount: _.assign(bankAccount.uiSchema, {
              'ui:options': {
                hideIf: (formData) => formData.bankAccountChange !== 'startUpdate'
              }
            }),
            'view:stopWarning': {
              'ui:description': directDepositWarning,
              'ui:options': {
                hideIf: (formData) => formData.bankAccountChange !== 'stop'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              bankAccountChange,
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
