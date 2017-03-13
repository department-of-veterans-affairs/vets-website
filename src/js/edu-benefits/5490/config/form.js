import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import {
  benefitsLabels,
  relationshipLabels,
  transform
} from '../helpers';

import * as address from '../../../common/schemaform/definitions/address';
import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as date from '../../../common/schemaform/definitions/date';
import { uiSchema as fullNameUISchema } from '../../../common/schemaform/definitions/fullName';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as ssn from '../../../common/schemaform/definitions/ssn';
import * as toursOfDuty from '../../definitions/toursOfDuty';

import createContactInformationPage from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';
import createSchoolSelectionPage from '../../pages/schoolSelection';

import IntroductionPage from '../components/IntroductionPage';
import EmploymentPeriodView from '../components/EmploymentPeriodView';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  civilianBenefitsAssistance,
  civilianBenefitsSource,
  currentlyActiveDuty,
  outstandingFelony,
  previousBenefits,
  serviceBranch,
  spouseInfo,
  veteranDateOfBirth,
  veteranDateOfDeath,
} = fullSchema5490.properties;

const {
  nonMilitaryJobs,
  relationship,
  secondaryContact,
  educationType,
  fullName
} = fullSchema5490.definitions;

const dateSchema = fullSchema5490.definitions.date;
const ssnSchema = fullSchema5490.definitions.ssn;

const nonRequiredFullName = _.assign(fullName, {
  required: []
});


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
    date: dateSchema,
    educationType,
    fullName,
    ssn: ssnSchema
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
              benefitsRelinquishedDate: dateSchema
            }
          }
        },
        previousBenefits: {
          title: 'Previous Benefits',
          path: 'benefits-eligibility/previous-benefits',
          initialData: {},
          uiSchema: {
            'ui:description': 'Prior to this application, have you ever applied for or received any of the following VA benefits?',
            previousBenefits: {
              // Add the view-only fields in the proper order
              'ui:order': [
                'view:noPreviousBenefits',
                'disability',
                'dic',
                'chapter31',
                'view:ownServiceBenefits',
                'ownServiceBenefits',
                'view:claimedSponsorService',
                'chapter35',
                'chapter33',
                'transferOfEntitlement',
                'veteranFullName',
                'veteranSocialSecurityNumber',
                'other'
              ],
              'view:noPreviousBenefits': {
                'ui:title': 'None'
              },
              disability: {
                'ui:title': 'Disability Compensation or Pension'
              },
              dic: {
                'ui:title': 'Dependents\' Indemnity Compensation (DIC)'
              },
              chapter31: {
                'ui:title': 'Vocational Rehabilitation benefits (Chapter 31)'
              },
              'view:ownServiceBenefits': {
                'ui:title': 'Veterans education assistance based on your own service'
              },
              ownServiceBenefits: {
                'ui:title': 'Specify benefits',
                'ui:options': { expandUnder: 'view:ownServiceBenefits' }
              },
              'view:claimedSponsorService': {
                'ui:title': 'Veterans education assistance based on someone else’s service.'
              },
              chapter35: {
                'ui:title': 'Chapter 35 - Survivors’ and Dependents’ Educational Assistance Program (DEA)',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService'
                }
              },
              chapter33: {
                'ui:title': 'Chapter 33 - Post-9/11 GI Bill Marine Gunnery Sergeant David Fry Scholarship',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService'
                }
              },
              transferOfEntitlement: {
                'ui:title': 'Transferred Entitlement',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService'
                }
              },
              veteranFullName: _.merge(fullNameUISchema, {
                'ui:title': 'Sponsor Veteran’s name',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService',
                  updateSchema: (data, form) => {
                    if (_.get(['previousBenefits', 'data', 'previousBenefits', 'view:claimedSponsorService'], form)) {
                      return fullName;
                    }

                    return nonRequiredFullName;
                  }
                }
              }),
              veteranSocialSecurityNumber: _.merge(ssn.uiSchema, {
                'ui:title': 'Sponsor SSN',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService'
                }
              }),
              other: {
                'ui:title': 'Other benefit'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              previousBenefits: _.merge(
                _.unset('properties.veteranFullName', previousBenefits),
                {
                  properties: {
                    'view:noPreviousBenefits': { type: 'boolean' },
                    'view:ownServiceBenefits': { type: 'boolean' },
                    'view:claimedSponsorService': { type: 'boolean' },
                    veteranFullName: fullName
                  }
                }
              )
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
            relativeFullName: _.assign(fullNameUISchema, {
              'ui:title': 'Name of Sponsor'
            }),
            veteranSocialSecurityNumber: ssn.uiSchema,
            veteranDateOfBirth: currentOrPastDate.uiSchema('Date of Birth'),
            veteranDateOfDeath: currentOrPastDate.uiSchema('Date of death or date listed as MIA or POW'),
          },
          schema: {
            type: 'object',
            required: ['veteranSocialSecurityNumber'],
            properties: {
              relationship,
              spouseInfo,
              relativeFullName: fullName,
              veteranSocialSecurityNumber: ssnSchema,
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
        schoolSelection: createSchoolSelectionPage(fullSchema5490, [
          'educationProgram',
          'educationObjective',
          'educationStartDate',
          'restorativeTraining',
          'vocationalTraining',
          'trainingState',
          'educationalCounseling'
        ])
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: createContactInformationPage('relativeAddress'),
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
