import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import {
  benefitsLabels,
  relationshipLabels,
  transform
} from '../helpers';
import { states } from '../../../common/utils/options-for-select';

import * as address from '../../../common/schemaform/definitions/address';
import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as date from '../../../common/schemaform/definitions/date';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as ssn from '../../../common/schemaform/definitions/ssn';
import * as toursOfDuty from '../../definitions/toursOfDuty';
import * as educationProgram from '../../definitions/educationProgram';

import contactInformation from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';

import IntroductionPage from '../components/IntroductionPage';
import EmploymentPeriodView from '../components/EmploymentPeriodView';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  civilianBenefitsAssistance,
  civilianBenefitsSource,
  currentlyActiveDuty,
  educationObjective,
  educationStartDate,
  educationalCounseling,
  outstandingFelony,
  restorativeTraining,
  serviceBranch,
  spouseInfo,
  trainingState,
  veteranDateOfBirth,
  veteranDateOfDeath,
  vocationalTraining
} = fullSchema5490.properties;

const {
  nonMilitaryJobs,
  relationship,
  secondaryContact,
  educationType
} = fullSchema5490.definitions;

const stateLabels = states.USA.reduce((current, { label, value }) => {
  return _.merge(current, { [value]: label });
}, {});

const formConfig = {
  urlPrefix: '/5490/',
  submitUrl: '/v0/education_benefits_claims/5490',
  trackingPrefix: 'edu-5490-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-5490',
  defaultDefinitions: {
    educationType,
    date: date.schema
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {}
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
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you:',
              'ui:options': {
                labels: benefitsLabels
              }
            },
            benefitsRelinquishedDate: date.uiSchema('Effective date')
          },
          schema: {
            type: 'object',
            properties: {
              benefit,
              benefitsRelinquishedDate: date.schema
            }
          }
        }
      }
    },
    militaryService: {
      title: 'Military History',
      pages: {
        sponsorVeteran: {
          title: 'Sponsor Veteran',
          path: 'military-service/sponsor-veteran',
          uiSchema: {
            relationship: {
              'ui:title': 'What is your relationship to the Servicemember whose benefit we\'re transferring to you?',
              'ui:widget': 'radio',
              'ui:options': { labels: relationshipLabels }
            },
            spouseInfo: {
              divorcePending: {
                'ui:title': 'Is there a divorce or annulment pending with your sponsor?',
                'ui:widget': 'yesNo'
              },
              remarried: {
                'ui:title': 'If you\'re the surviving spouse, did you get remarried?',
                'ui:widget': 'yesNo'
              },
              remarriageDate: _.assign(date.uiSchema('Date you got remarried'), {
                'ui:options': {
                  hideIf: (fieldData) => !_.get('spouseInfo.remarried', fieldData)
                }
              }),
              'ui:options': {
                hideIf: (fieldData) => fieldData.relationship !== 'spouse'
              }
            },
            relativeFullName: _.assign(fullName.uiSchema, {
              'ui:title': 'Name of Sponsor'
            }),
            veteranSocialSecurityNumber: ssn.uiSchema,
            veteranDateOfBirth: currentOrPastDate.uiSchema('Date of Birth'),
            veteranDateOfDeath: currentOrPastDate.uiSchema('Date of death or date listed as MIA or POW'),
          },
          schema: {
            type: 'object',
            definitions: {
              date: date.schema // For spouseInfo
            },
            required: ['veteranSocialSecurityNumber'],
            properties: {
              relationship,
              spouseInfo,
              relativeFullName: fullName.schema,
              veteranSocialSecurityNumber: ssn.schema,
              veteranDateOfBirth,
              veteranDateOfDeath
            }
          }
        },
        sponsorService: {
          title: 'Sponsor Service',
          path: 'military-service/sponsor-service',
          uiSchema: {
            serviceBranch: {
              'ui:title': 'Branch of service'
            },
            currentlyActiveDuty: {
              'ui:title': 'Is the qualifying individual on active duty?',
              'ui:widget': 'yesNo'
            },
            outstandingFelony: {
              'ui:title': 'Do you, or the qualifying individual on whose account you\'re claiming benefits, have an outstanding felony and/or warrant?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              serviceBranch,
              currentlyActiveDuty,
              outstandingFelony
            }
          }
        },
        applicantService: {
          title: 'Applicant Service',
          path: 'military-service/applicant-service',
          initialData: {
            // I'd like to default the checkbox to true...
            // applyPeriodToSelected: true
          },
          uiSchema: {
            'view:applicantServed': {
              'ui:title': 'Have you ever served on active duty in the armed services?',
              'ui:widget': 'yesNo'
            },
            toursOfDuty: _.merge(toursOfDuty.uiSchema, {
              'ui:options': {
                expandUnder: 'view:applicantServed'
              },
              items: {
                serviceStatus: { 'ui:title': 'Type of separation or discharge' }
              }
            })
          },
          schema: {
            type: 'object',
            properties: {
              'view:applicantServed': {
                type: 'boolean'
              },
              toursOfDuty: toursOfDuty.schema([
                'serviceBranch',
                'dateRange',
                'serviceStatus',
                // 'applyPeriodToSelected'
              ])
            }
          }
        },
        contributions: {
          title: 'Contributions',
          path: 'military-service/contributions',
          uiSchema: {
            civilianBenefitsAssistance: {
              'ui:title': 'Are you getting benefits from the U.S. Government as a civilian employee during the same time as you are seeking benefits from VA?',
              'ui:widget': 'yesNo'
            },
            civilianBenefitsSource: {
              'ui:title': 'What is the source of these funds?',
              'ui:options': {
                expandUnder: 'civilianBenefitsAssistance'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              civilianBenefitsAssistance,
              civilianBenefitsSource
            }
          }
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {}
    },
    employmentHistory: {
      title: 'Employment History',
      pages: {
        employmentHistory: {
          title: 'Employment history',
          path: 'employment-history',
          uiSchema: {
            nonMilitaryJobs: {
              items: {
                name: {
                  'ui:title': 'Main job'
                },
                months: {
                  'ui:title': 'Number of months worked'
                },
                licenseOrRating: {
                  'ui:title': 'Licenses or rating'
                }
              },
              'ui:options': {
                itemName: 'Employment Period',
                viewField: EmploymentPeriodView,
                hideTitle: true
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              nonMilitaryJobs: _.unset('items.properties.postMilitaryJob', nonMilitaryJobs)
            }
          }
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        schoolSelection: {
          title: 'School selection',
          path: 'school-selection',
          uiSchema: {
            educationProgram: educationProgram.uiSchema,
            educationObjective: {
              'ui:title': 'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
              'ui:widget': 'textarea'
            },
            educationStartDate: date.uiSchema('The date your training began or will begin'),
            restorativeTraining: {
              'ui:title': 'Are you seeking special restorative training?',
              'ui:widget': 'yesNo'
            },
            vocationalTraining: {
              'ui:title': 'Are you seeking special vocational training?',
              'ui:widget': 'yesNo'
            },
            trainingState: {
              'ui:title': 'In what state do you plan on living while participating in this training?',
              'ui:options': {
                labels: stateLabels
              }
            },
            educationalCounseling: {
              'ui:title': 'Would you like to receive vocational and educational counseling?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              educationProgram: educationProgram.schema(),
              educationObjective,
              educationStartDate,
              restorativeTraining,
              vocationalTraining,
              trainingState: _.merge(trainingState, {
                type: 'string'
              }),
              educationalCounseling
            }
          }
        }
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation,
        secondaryContact: {
          title: 'Secondary contact',
          path: 'personal-information/secondary-contact',
          initialData: {},
          uiSchema: {
            'ui:title': 'Secondary contact',
            'ui:description': 'This person should know where you can be reached at all times.',
            secondaryContact: {
              fullName: {
                'ui:title': 'Name'
              },
              phone: phone.uiSchema('Telephone number'),
              sameAddress: {
                'ui:title': 'Address for secondary contact is the same as mine'
              },
              address: _.merge(address.uiSchema(), {
                'ui:options': {
                  hideIf: (form) => _.get('secondaryContact.sameAddress', form) === true
                }
              })
            }
          },
          schema: {
            type: 'object',
            properties: {
              secondaryContact: {
                type: 'object',
                properties: {
                  fullName: secondaryContact.properties.fullName,
                  phone: phone.schema,
                  sameAddress: secondaryContact.properties.sameAddress,
                  address: address.schema(),
                }
              }
            }
          }
        },
        directDeposit
      }
    }
  }
};

export default formConfig;
