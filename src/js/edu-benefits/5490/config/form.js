import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';
import {
  benefitsLabels,
  relationshipLabels,
  transform
} from '../helpers';
import { enumToNames } from '../../utils/helpers';

import * as date from '../../../common/schemaform/definitions/date';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as ssn from '../../../common/schemaform/definitions/ssn';

import * as toursOfDuty from '../../definitions/toursOfDuty';

import IntroductionPage from '../components/IntroductionPage';
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
  relationship,
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
                  hideIf: (fieldData) => !fieldData.spouseInfo || !fieldData.spouseInfo.remarried
                }
              }),
              'ui:options': {
                hideIf: (fieldData) => fieldData.relationship !== 'spouse'
              }
            },
            relativeFullName: _.assign(fullName.uiSchema, {
              'ui:title': 'Name of Sponsor'
            }),
            // This isn't running validation for some reason...
            veteranSocialSecurityNumber: ssn.uiSchema,
            veteranDateOfBirth: date.uiSchema('Date of Birth'),
            veteranDateOfDeath: date.uiSchema('Date listed as MIA, POW, or as deceased'),
          },
          schema: {
            type: 'object',
            definitions: {
              'ui:title': 'Sponsor Service',
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
            toursOfDuty: (() => {
              // Set and show the title
              const uiSchema = toursOfDuty.uiSchema;
              uiSchema['ui:title'] = 'Applicant service periods';
              uiSchema['ui:options'].hideTitle = false;

              // Set other labels
              uiSchema.items = _.assign(uiSchema.items, {
                serviceStatus: {
                  'ui:title': 'Service Status'
                }
              });
              return uiSchema;
            })()
          },
          schema: {
            type: 'object',
            properties: {
              // Perhaps we can take benefitsToApplyTo out of the schema? Don't
              //  know that it's actually used.
              toursOfDuty: toursOfDuty.schema(['serviceBranch', 'dateRange', 'applyPeriodToSelected'])
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
    schoolSelection: {
      title: 'School Selection',
      pages: {}
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {}
    }
  }
};


export default formConfig;
