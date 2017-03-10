import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import {
  benefitsLabels,
  relationshipLabels,
  hoursTypeLabels,
  highSchoolStatusLabels,
  transform
} from '../helpers';
import { showSchoolAddress } from '../../utils/helpers';
import { states } from '../../../common/utils/options-for-select';

import * as address from '../../../common/schemaform/definitions/address';
import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as date from '../../../common/schemaform/definitions/date';
import { uiSchema as uiSchemaDateRange } from '../../../common/schemaform/definitions/dateRange';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as ssn from '../../../common/schemaform/definitions/ssn';
import * as toursOfDuty from '../../definitions/toursOfDuty';
import * as educationType from '../../definitions/educationType';

import contactInformation from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';

import IntroductionPage from '../components/IntroductionPage';
import EmploymentPeriodView from '../components/EmploymentPeriodView';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  highSchool,
  civilianBenefitsAssistance,
  civilianBenefitsSource,
  currentlyActiveDuty,
  educationObjective,
  educationProgram,
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
  dateRange
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
    educationType: educationType.schema,
    date: date.schema,
    dateRange
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
      pages: {
        educationHistory: {
          title: 'Education history',
          path: 'education-history',
          initialData: {},
          uiSchema: {
            highSchool: {
              status: {
                'ui:title': 'What is your current high school status?',
                'ui:options': {
                  labels: highSchoolStatusLabels
                }
              },
              highSchoolOrGedCompletionDate: _.assign(
                date.uiSchema('When did you earn your high school diploma or equivalency certificate?'), {
                  'ui:options': {
                    hideIf: form => {
                      const status = _.get('highSchool.status', form);
                      return status !== 'graduated' && status !== 'ged';
                    }
                  }
                }),
              'view:hasHighSchool': {
                'ui:options': {
                  hideIf: form => {
                    const status = _.get('highSchool.status', form);
                    return status !== 'graduationExpected';
                  }
                },
                name: {
                  'ui:title': 'Name of high school'
                },
                city: {
                  'ui:title': 'City'
                },
                state: {
                  'ui:title': 'State'
                },
                dateRange: uiSchemaDateRange(),
                hours: {
                  'ui:title': 'Hours completed'
                },
                hoursType: {
                  'ui:title': 'Type of hours',
                  'ui:options': {
                    labels: hoursTypeLabels
                  }
                },
                degreeReceived: {
                  'ui:title': 'Degree, diploma, or certificate received'
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              highSchool: {
                type: 'object',
                properties: {
                  status: highSchool.properties.status,
                  highSchoolOrGedCompletionDate: date.schema,
                  'view:hasHighSchool': {
                    type: 'object',
                    properties: {
                      name: highSchool.properties.name,
                      city: highSchool.properties.city,
                      state: highSchool.properties.state,
                      dateRange: highSchool.properties.dateRange,
                      hours: highSchool.properties.hours,
                      hoursType: highSchool.properties.hoursType,
                      degreeReceived: highSchool.properties.degreeReceived
                    }
                  }
                }
              }
            }
          }
        }
      }
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
            educationProgram: {
              'ui:order': ['name', 'educationType', 'address'],
              address: _.merge(address.uiSchema(), {
                'ui:options': {
                  hideIf: (form) => !showSchoolAddress(_.get('educationProgram.educationType', form))
                }
              }),
              educationType: educationType.uiSchema,
              name: {
                'ui:title': 'Name of school, university, or training facility'
              }
            },
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
              educationProgram: _.set('properties.address', address.schema(), educationProgram),
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
