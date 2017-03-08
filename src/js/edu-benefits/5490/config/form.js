import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import {
  benefitsLabels,
  relationshipLabels,
  transform
} from '../helpers';
import { enumToNames } from '../../utils/helpers';

import * as address from '../../../common/schemaform/definitions/address';
import * as bankAccount from '../../../common/schemaform/definitions/bankAccount';
import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as date from '../../../common/schemaform/definitions/date';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as ssn from '../../../common/schemaform/definitions/ssn';
import * as toursOfDuty from '../../definitions/toursOfDuty';

import contactInformation from '../../definitions/contactInformation';

import IntroductionPage from '../components/IntroductionPage';
import EmploymentPeriodView from '../components/EmploymentPeriodView';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  civilianBenefitsAssistance,
  civilianBenefitsSource,
  currentlyActiveDuty,
  outstandingFelony,
  serviceBranch,
  spouseInfo,
  veteranDateOfBirth,
  veteranDateOfDeath
} = fullSchema5490.properties;

const {
  nonMilitaryJobs,
  relationship,
  secondaryContact
} = fullSchema5490.definitions;

const formConfig = {
  urlPrefix: '/5490/',
  submitUrl: '/v0/education_benefits_claims/5490',
  trackingPrefix: 'edu-5490-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-5490',
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
              'ui:title': 'Select the benefit that is the best match for you:'
            },
            benefitsRelinquishedDate: date.uiSchema('Effective date')
          },
          schema: {
            type: 'object',
            properties: {
              benefit: _.assign(benefit, {
                enumNames: enumToNames(benefit.enum, benefitsLabels)
              }),
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
              'ui:title': 'What is your relationship to the Servicemember whose benefit is being transferred to you?',
              'ui:widget': 'radio'
            },
            spouseInfo: {
              divorcePending: {
                'ui:title': 'Is there a divorce or annulment pending to the qualifying individual?',
                'ui:widget': 'yesNo'
              },
              remarried: {
                'ui:title': 'If you are the surviving spouse, have you remarried?',
                'ui:widget': 'yesNo'
              },
              remarriageDate: _.assign(date.uiSchema('Remarriage Date'), {
                'ui:options': {
                  // Needs the || because it's undefined on other pages
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
            veteranDateOfDeath: currentOrPastDate.uiSchema('Date listed as MIA, POW, or as deceased'),
          },
          schema: {
            type: 'object',
            definitions: {
              date: date.schema // For spouseInfo
            },
            properties: {
              relationship: _.assign(relationship, {
                enumNames: enumToNames(relationship.enum, relationshipLabels)
              }),
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
              'ui:title': 'Do you or the qualifying individual on whose account you are claiming benefits have an outstanding felony and/or warrant?',
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
              'ui:title': 'I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA.'
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
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          initialData: {},
          uiSchema: {
            'ui:title': 'Direct deposit',
            bankAccount: bankAccount.uiSchema,
          },
          schema: {
            type: 'object',
            properties: {
              bankAccount: bankAccount.schema
            }
          }
        }
      }
    }
  }
};

export default formConfig;
