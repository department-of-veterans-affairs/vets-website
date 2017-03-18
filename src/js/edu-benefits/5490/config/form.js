import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import {
  benefitsLabels,
  relationshipLabels,
  highSchoolStatusLabels,
  transform
} from '../helpers';

import {
  hoursTypeLabels,
  stateLabels,
  civilianBenefitsLabel
} from '../../utils/helpers';

import * as address from '../../../common/schemaform/definitions/address';
import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as date from '../../../common/schemaform/definitions/date';
import { uiSchema as uiSchemaDateRange } from '../../../common/schemaform/definitions/dateRange';
import { uiSchema as fullNameUISchema } from '../../../common/schemaform/definitions/fullName';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as ssn from '../../../common/schemaform/definitions/ssn';
import * as toursOfDuty from '../../definitions/toursOfDuty';
import { uiSchema as nonMilitaryJobsUiSchema } from '../../../common/schemaform/definitions/nonMilitaryJobs';
import uiSchemaPostHighSchoolTrainings from '../../definitions/postHighSchoolTrainings';

import createContactInformationPage from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';
import applicantInformation from '../../pages/applicantInformation';
import createSchoolSelectionPage from '../../pages/schoolSelection';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import Chapter33Warning from '../components/Chapter33Warning';
import Chapter35Warning from '../components/Chapter35Warning';

const {
  benefit,
  highSchool,
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
  secondaryContact,
  dateRange,
  educationType,
  fullName,
  postHighSchoolTrainings
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
    dateRange,
    fullName,
    ssn: ssnSchema
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: applicantInformation(fullSchema5490, {
          labels: { relationship: relationshipLabels }
        })
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
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you:',
              'ui:options': {
                labels: benefitsLabels,
                nestedContent: {
                  chapter33: Chapter33Warning,
                  chapter35: Chapter35Warning
                }
              }
            },
            benefitsRelinquishedDate: date.uiSchema('Effective date')
          },
          schema: {
            type: 'object',
            required: ['benefit', 'benefitsRelinquishedDate'],
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
                'ui:title': 'Veterans education assistance based on your own service',
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent'
                }
              },
              ownServiceBenefits: {
                'ui:title': 'Specify benefits',
                'ui:options': { expandUnder: 'view:ownServiceBenefits' }
              },
              'view:claimedSponsorService': {
                'ui:title': 'Veterans education assistance based on someone else’s service.',
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent'
                }
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
                    if (_.get('previousBenefits.data.previousBenefits.view:claimedSponsorService', form)) {
                      return fullName;
                    }

                    return nonRequiredFullName;
                  }
                }
              }),
              veteranSocialSecurityNumber: _.merge(ssn.uiSchema, {
                'ui:title': 'Sponsor SSN',
                'ui:required': (formData) => _.get('previousBenefits.view:claimedSponsorService', formData),
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
            spouseInfo: {
              divorcePending: {
                'ui:title': 'Is there a divorce or annulment pending with your sponsor?',
                'ui:widget': 'yesNo',
                'ui:required': (formData) => _.get('relationship', formData) === 'spouse'
              },
              remarried: {
                'ui:title': 'If you\'re the surviving spouse, did you get remarried?',
                'ui:widget': 'yesNo'
              },
              remarriageDate: _.assign(date.uiSchema('Date you got remarried'), {
                'ui:options': {
                  expandUnder: 'remarried',
                },
                'ui:required': (formData) => _.get('spouseInfo.remarried', formData)
              }),
              'ui:options': {
                hideIf: (formData) => _.get('relationship', formData) !== 'spouse'
              }
            },
            veteranFullName: _.merge(fullNameUISchema, {
              'ui:title': 'Name of Sponsor',
              first: {
                'ui:title': 'Veteran first name'
              },
              middle: {
                'ui:title': 'Veteran middle name'
              },
              last: {
                'ui:title': 'Veteran last name'
              },
              suffix: {
                'ui:title': 'Veteran suffix'
              }
            }),
            veteranSocialSecurityNumber: _.assign(ssn.uiSchema, {
              'ui:title': 'Veteran Social Security number'
            }),
            veteranDateOfBirth: currentOrPastDate.uiSchema('Veteran date of birth'),
            veteranDateOfDeath: currentOrPastDate.uiSchema('Veteran date of death or date listed as MIA or POW'),
          },
          schema: {
            type: 'object',
            // TODO: Conditionally require divorcePending and remarried if
            //  spouseInfo is unhidden
            required: [
              'veteranSocialSecurityNumber',
              'veteranDateOfBirth'
            ],
            properties: {
              spouseInfo,
              veteranFullName: fullName,
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
              'ui:required': _.get('view:applicantServed'),
              items: {
                serviceStatus: { 'ui:title': 'Type of separation or discharge' }
              }
            })
          },
          schema: {
            type: 'object',
            // If answered 'Yes' without entering information, it's the same as
            //  answering 'No' as far as the back end is concerned.
            required: ['view:applicantServed'],
            properties: {
              'view:applicantServed': {
                type: 'boolean'
              },
              toursOfDuty: toursOfDuty.schema({
                fields: [
                  'serviceBranch',
                  'dateRange',
                  'serviceStatus'
                ],
                required: ['serviceBranch', 'dateRange.from']
              })
            }
          }
        },
        contributions: {
          title: 'Contributions',
          path: 'military-service/contributions',
          uiSchema: {
            civilianBenefitsAssistance: {
              'ui:title': civilianBenefitsLabel,
              'ui:widget': 'yesNo'
            },
            civilianBenefitsSource: {
              'ui:title': 'What is the source of these funds?',
              // Conditionally require civilianBenefitsSource if
              //  civilianBenefitsAssistance is true.
              'ui:required': (formData) => formData.civilianBenefitsAssistance,
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
                  'ui:title': 'State',
                  'ui:options': {
                    labels: stateLabels
                  }
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
            },
            'view:hasTrainings': {
              'ui:title': 'Do you have any training after high school?',
              'ui:widget': 'yesNo'
            },
            postHighSchoolTrainings: _.merge(uiSchemaPostHighSchoolTrainings, {
              'ui:options': {
                expandUnder: 'view:hasTrainings'
              }
            })
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
              },
              'view:hasTrainings': {
                type: 'boolean'
              },
              postHighSchoolTrainings
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
            nonMilitaryJobs: nonMilitaryJobsUiSchema
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
        schoolSelection: createSchoolSelectionPage(fullSchema5490, {
          fields: [
            'educationProgram',
            'educationObjective',
            'educationStartDate',
            'restorativeTraining',
            'vocationalTraining',
            'trainingState',
            'educationalCounseling'
          ],
          required: ['educationType']
        })
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
                  hideIf: (formData) => _.get('secondaryContact.sameAddress', formData) === true
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
