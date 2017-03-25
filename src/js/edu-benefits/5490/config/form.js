import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import {
  benefitsLabels,
  benefitsRelinquishedWarning,
  relationshipLabels,
  highSchoolStatusLabels,
  transform
} from '../helpers';

import {
  stateLabels
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
import * as veteranId from '../../definitions/veteranId';

import createContactInformationPage from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';
import applicantInformation from '../../pages/applicantInformation';
import createSchoolSelectionPage from '../../pages/schoolSelection';
import additionalBenefits from '../../pages/additionalBenefits';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import Chapter33Warning from '../components/Chapter33Warning';
import Chapter35Warning from '../components/Chapter35Warning';

const {
  benefit,
  highSchool,
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
        }),
        additionalBenefits: additionalBenefits(fullSchema5490, {
          fields: ['civilianBenefitsAssistance', 'civilianBenefitsSource']
        }),
        applicantService: {
          title: 'Applicant service',
          path: 'applicant/service',
          initialData: {
          },
          uiSchema: {
            'ui:title': 'Applicant service',
            'view:applicantServed': {
              'ui:title': 'Have you ever served on active duty in the armed services?',
              'ui:widget': 'yesNo'
            },
            toursOfDuty: _.merge(toursOfDuty.uiSchema, {
              'ui:options': {
                expandUnder: 'view:applicantServed'
              },
              'ui:required': form => _.get('view:applicantServed', form),
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
      }
    },
    benefitSelection: {
      title: 'Benefits Eligibility',
      pages: {
        benefitSelection: {
          title: 'Benefits eligibility',
          path: 'benefits/eligibility',
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
            'view:benefitsRelinquishedInfo': {
              'ui:description': 'While receiving DEA or FRY scholarship benefits you may not receive payments of Dependency and Indemnity Compensation (DIC) or Pension and you may not be claimed as a dependent in a Compensation claim. If you are unsure of this decision it is strongly encouraged you talk with a VA counselor.',
            },
            'view:benefitsRelinquishedWarning': {
              'ui:description': benefitsRelinquishedWarning
            },
            benefitsRelinquishedDate: date.uiSchema('Effective date')
          },
          schema: {
            type: 'object',
            required: ['benefit', 'benefitsRelinquishedDate'],
            properties: {
              benefit,
              'view:benefitsRelinquishedInfo': {
                type: 'object',
                properties: {}
              },
              'view:benefitsRelinquishedWarning': {
                type: 'object',
                properties: {}
              },
              benefitsRelinquishedDate: dateSchema
            }
          }
        },
        benefitHistory: {
          title: 'Benefit history',
          path: 'benefits/history',
          initialData: {},
          uiSchema: {
            'ui:title': 'Benefit history',
            'ui:description': 'Before this application, have you ever applied for or received any of the following VA benefits?',
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
                'ui:title': 'Describe the benefits you used',
                'ui:options': { expandUnder: 'view:ownServiceBenefits' }
              },
              'view:claimedSponsorService': {
                'ui:title': 'Veterans education assistance based on someone else’s service',
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent'
                }
              },
              chapter35: {
                'ui:title': 'Survivors’ and Dependents’ Educational Assistance Program (DEA, Chapter 35)',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService'
                }
              },
              chapter33: {
                'ui:title': 'Post-9/11 GI Bill Marine Gunnery Sergeant David Fry Scholarship (Chapter 33)',
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
                    if (_.get('benefitHistory.data.previousBenefits.view:claimedSponsorService', form)) {
                      return fullName;
                    }

                    return nonRequiredFullName;
                  }
                }
              }),
              veteranSocialSecurityNumber: _.merge(ssn.uiSchema, {
                'ui:title': 'Sponsor\'s Social Security number',
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
    sponsorInformation: {
      title: 'Sponsor Information',
      pages: {
        sponsorInformation: {
          title: 'Sponsor information',
          path: 'sponsor/information',
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
                'ui:title': 'Sponsor first name'
              },
              middle: {
                'ui:title': 'Sponsor middle name'
              },
              last: {
                'ui:title': 'Sponsor last name'
              },
              suffix: {
                'ui:title': 'Sponsor suffix'
              }
            }),
            'view:veteranId': _.merge(veteranId.uiSchema, {
              veteranSocialSecurityNumber: {
                'ui:title': 'Sponsor Social Security number'
              },
              'view:noSSN': {
                'ui:title': 'I don\'t know my sponsor’s Social Security number',
              },
              vaFileNumber: {
                'ui:title': 'Sponsor file number',
              }
            }),
            veteranDateOfBirth: currentOrPastDate.uiSchema('Sponsor date of birth'),
            veteranDateOfDeath: currentOrPastDate.uiSchema('Sponsor date of death or date listed as MIA or POW'),
          },
          schema: {
            type: 'object',
            required: [
              'veteranDateOfBirth'
            ],
            properties: {
              spouseInfo,
              veteranFullName: fullName,
              'view:veteranId': veteranId.schema,
              veteranDateOfBirth,
              veteranDateOfDeath
            }
          }
        },
        sponsorService: {
          title: 'Sponsor service',
          path: 'sponsor/service',
          uiSchema: {
            'ui:title': 'Sponsor service',
            serviceBranch: {
              'ui:title': 'Branch of service'
            },
            currentlyActiveDuty: {
              'ui:title': 'Is the qualifying individual on active duty?',
              'ui:widget': 'yesNo'
            },
            outstandingFelony: {
              'ui:title': 'Do you or your sponsor have an outstanding felony and/or warrant?',
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
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
        educationHistory: {
          title: 'Education history',
          path: 'education/history',
          initialData: {},
          uiSchema: {
            highSchool: {
              status: {
                'ui:title': 'What\'s your current high school status?',
                'ui:options': {
                  labels: highSchoolStatusLabels,
                  expandUnderClassNames: 'schemaform-expandUnder-indent'
                }
              },
              'view:highSchoolOrGedCompletionDate': _.assign(
                date.uiSchema('When did you earn your high school diploma?'), {
                  'ui:options': {
                    hideIf: form => {
                      const status = _.get('highSchool.status', form);
                      return status !== 'graduated';
                    },
                    expandUnder: 'status'
                  }
                }
              ),
              'view:hasHighSchool': {
                'ui:options': {
                  hideIf: form => {
                    const status = _.get('highSchool.status', form);
                    return status !== 'discontinued';
                  },
                  expandUnder: 'status'
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
                  'view:hasHighSchool': {
                    type: 'object',
                    properties: {
                      name: highSchool.properties.name,
                      city: highSchool.properties.city,
                      state: highSchool.properties.state,
                      dateRange: highSchool.properties.dateRange,
                    }
                  },
                  'view:highSchoolOrGedCompletionDate': date.schema,
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
          path: 'employment/history',
          uiSchema: {
            'view:hasNonMilitaryJobs': {
              'ui:title': 'Have you ever held a license of journeyman rating (for example, as a contractor or plumber) to practice a profession?',
              'ui:widget': 'yesNo'
            },
            nonMilitaryJobs: _.set(['ui:options', 'expandUnder'], 'view:hasNonMilitaryJobs', nonMilitaryJobsUiSchema)
          },
          schema: {
            type: 'object',
            properties: {
              'view:hasNonMilitaryJobs': {
                type: 'boolean'
              },
              nonMilitaryJobs: _.unset('items.properties.postMilitaryJob', nonMilitaryJobs)
            }
          }
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        schoolSelection: _.merge(createSchoolSelectionPage(fullSchema5490, {
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
        }), {
          // Rephrase the question for facility name in educationProgram
          uiSchema: {
            educationProgram: {
              name: {
                'ui:title': 'Name of school, university, or training facility you want to attend'
              }
            }
          }
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
