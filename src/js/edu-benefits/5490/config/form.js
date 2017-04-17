import _ from 'lodash/fp';
import { createSelector } from 'reselect';

import fullSchema5490 from 'vets-json-schema/dist/22-5490-schema.json';

import {
  benefitsRelinquishedInfo,
  benefitsRelinquishedWarning,
  benefitsDisclaimerChild,
  benefitsDisclaimerSpouse,
  relationshipLabels,
  highSchoolStatusLabels,
  transform
} from '../helpers';

import {
  stateLabels,
  survivorBenefitsLabels
} from '../../utils/helpers';

import {
  validateDate,
  validateFutureDateIfExpectedGrad
} from '../../../common/schemaform/validation';

import * as address from '../../../common/schemaform/definitions/address';
import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as date from '../../../common/schemaform/definitions/date';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as veteranId from '../../definitions/veteranId';

import { uiSchema as dateRangeUi } from '../../../common/schemaform/definitions/dateRange';
import { uiSchema as fullNameUi } from '../../../common/schemaform/definitions/fullName';
import { uiSchema as nonMilitaryJobsUi } from '../../../common/schemaform/definitions/nonMilitaryJobs';
import postHighSchoolTrainingsUi from '../../definitions/postHighSchoolTrainings';

import contactInformationPage from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';
import applicantInformationPage from '../../pages/applicantInformation';
import applicantServicePage from '../../pages/applicantService';
import createSchoolSelectionPage, { schoolSelectionOptionsFor } from '../../pages/schoolSelection';
import additionalBenefitsPage from '../../pages/additionalBenefits';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import benefitSelectionWarning from '../components/BenefitSelectionWarning';

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
  postHighSchoolTrainings,
  vaFileNumber
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
  title: 'Apply for education benefits as an eligible dependent',
  subTitle: 'Form 22-5490',
  defaultDefinitions: {
    date: dateSchema,
    educationType,
    dateRange,
    fullName,
    ssn: ssnSchema,
    vaFileNumber
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: applicantInformationPage(fullSchema5490, {
          labels: { relationship: relationshipLabels }
        }),
        additionalBenefits: additionalBenefitsPage(fullSchema5490, {
          fields: ['civilianBenefitsAssistance', 'civilianBenefitsSource']
        }),
        applicantService: applicantServicePage(),
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
            'ui:title': 'Benefit selection',
            'view:benefitsDisclaimerChild': {
              'ui:description': benefitsDisclaimerChild,
              'ui:options': {
                hideIf: form => _.get('relationship', form) !== 'child'
              }
            },
            'view:benefitsDisclaimerSpouse': {
              'ui:description': benefitsDisclaimerSpouse,
              'ui:options': {
                hideIf: form => _.get('relationship', form) !== 'spouse'
              }
            },
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you:',
              'ui:options': {
                labels: survivorBenefitsLabels,
                updateSchema: (data, form, schema) => {
                  const relationship = _.get('applicantInformation.data.relationship', form);
                  const nestedContent = {
                    chapter33: benefitSelectionWarning('chapter33', relationship),
                    chapter35: benefitSelectionWarning('chapter35', relationship),
                  };
                  const uiOptions = _.get('benefitSelection.uiSchema.benefit.ui:options', form);
                  uiOptions.nestedContent = nestedContent;
                  return schema;
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: ['benefit'],
            properties: {
              'view:benefitsDisclaimerChild': {
                type: 'object',
                properties: {}
              },
              'view:benefitsDisclaimerSpouse': {
                type: 'object',
                properties: {}
              },
              benefit
            }
          }
        },
        benefitRelinquishment: {
          title: 'Benefits relinquishment',
          path: 'benefits/relinquishment',
          initialData: {},
          depends: {
            applicantInformation: {
              data: {
                relationship: 'child'
              }
            }
          },
          uiSchema: {
            'ui:title': 'Benefit relinquishment',
            'view:benefitsRelinquishedInfo': {
              'ui:description': benefitsRelinquishedInfo,
            },
            benefitsRelinquishedDate: currentOrPastDate.uiSchema('Effective date'),
            'view:benefitsRelinquishedWarning': {
              'ui:description': benefitsRelinquishedWarning,
            }
          },
          schema: {
            type: 'object',
            required: ['benefitsRelinquishedDate'],
            properties: {
              'view:benefitsRelinquishedInfo': {
                type: 'object',
                properties: {}
              },
              benefitsRelinquishedDate: dateSchema,
              'view:benefitsRelinquishedWarning': {
                type: 'object',
                properties: {}
              }
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
                'view:veteranId',
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
                'ui:options': {
                  expandUnder: 'view:ownServiceBenefits'
                }
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
              veteranFullName: _.merge(fullNameUi, {
                'ui:title': 'Sponsor Veteran’s name',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService',
                  updateSchema: (data, form) => {
                    if (_.get('benefitHistory.data.previousBenefits.view:claimedSponsorService', form)) {
                      return fullName;
                    }
                    return nonRequiredFullName;
                  }
                },
                // Re-label the inputs to add 'sponsor'
                first: { 'ui:title': 'Sponsor first name' },
                last: { 'ui:title': 'Sponsor last name' },
                middle: { 'ui:title': 'Sponsor middle name' },
                suffix: { 'ui:title': 'Sponsor suffix' },
              }),
              'view:veteranId': _.merge(veteranId.uiSchema, {
                veteranSocialSecurityNumber: {
                  'ui:title': 'Sponsor Social Security number',
                  'ui:required': (formData) => _.get('previousBenefits.view:claimedSponsorService', formData) && !_.get('previousBenefits.view:veteranId.view:noSSN', formData)
                },
                'view:noSSN': {
                  'ui:title': 'I don’t know my sponsor’s Social Security number',
                },
                vaFileNumber: {
                  'ui:title': 'Sponsor file number',
                  'ui:required': (formData) => _.get('previousBenefits.view:claimedSponsorService', formData) && !!_.get('previousBenefits.view:veteranId.view:noSSN', formData)
                },
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
                _.omit([
                  'anyOf',
                  'properties.veteranFullName',
                  'properties.veteranSocialSecurityNumber',
                  'properties.vaFileNumber'],
                  previousBenefits),
                {
                  properties: {
                    'view:noPreviousBenefits': { type: 'boolean' },
                    'view:ownServiceBenefits': { type: 'boolean' },
                    'view:claimedSponsorService': { type: 'boolean' },
                    veteranFullName: fullName,
                    'view:veteranId': veteranId.schema
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
            'view:currentSameAsPrevious': {
              'ui:options': {
                hideIf: (formData) => !_.get('previousBenefits.view:claimedSponsorService', formData)
              },
              'ui:title': 'Same sponsor as previously claimed benefits'
            },
            'view:currentSponsorInformation': {
              'ui:options': {
                hideIf: (formData) => formData['view:currentSameAsPrevious']
              },
              veteranFullName: _.merge(fullNameUi, {
                'ui:options': {
                  updateSchema: (data, form) => {
                    if (!_.get('sponsorInformation.data.view:currentSameAsPrevious', form)) {
                      return fullName;
                    }
                    return nonRequiredFullName;
                  }
                },
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
                  'ui:title': 'Sponsor Social Security number',
                  'ui:required': (formData) => !_.get('view:currentSameAsPrevious', formData) && !_.get('view:currentSponsorInformation.view:veteranId.view:noSSN', formData)
                },
                'view:noSSN': {
                  'ui:title': 'I don’t know my sponsor’s Social Security number',
                },
                vaFileNumber: {
                  'ui:required': (formData) => !!_.get('view:currentSponsorInformation.view:veteranId.view:noSSN', formData),
                  'ui:title': 'Sponsor file number',
                }
              })
            },
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
              'view:currentSameAsPrevious': {
                type: 'boolean'
              },
              'view:currentSponsorInformation': {
                type: 'object',
                properties: {
                  veteranFullName: fullName,
                  'view:veteranId': veteranId.schema,
                }
              },
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
              'ui:title': 'Is your sponsor on active duty?',
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
              highSchoolOrGedCompletionDate: _.assign(
                date.uiSchema(null), {
                  'ui:options': {
                    hideIf: form => {
                      const status = _.get('highSchool.status', form);
                      return status !== 'graduated' && status !== 'graduationExpected';
                    },
                    expandUnder: 'status',
                    updateSchema: (pageData, form) => {
                      const status = _.get('educationHistory.data.highSchool.status', form);

                      if (status === 'graduationExpected') {
                        return { title: 'When do you expect to earn your high school diploma?' };
                      }

                      return { title: 'When did you earn your high school diploma?' };
                    }
                  },
                  'ui:validations': [
                    validateDate,
                    validateFutureDateIfExpectedGrad
                  ]
                },
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
                dateRange: dateRangeUi(),
              }
            },
            'view:hasTrainings': {
              'ui:title': 'Do you have any training after high school?',
              'ui:widget': 'yesNo'
            },
            postHighSchoolTrainings: _.merge(postHighSchoolTrainingsUi, {
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
                    }
                  },
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
            nonMilitaryJobs: _.set(['ui:options', 'expandUnder'], 'view:hasNonMilitaryJobs', nonMilitaryJobsUi)
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
        schoolSelection: _.merge(createSchoolSelectionPage(fullSchema5490, schoolSelectionOptionsFor['5490']), {
          // Rephrase the question for facility name in educationProgram
          uiSchema: {
            educationProgram: {
              name: {
                'ui:title': 'Name of school, university, or training facility you want to attend'
              },
              educationType: {
                'ui:options': {
                  updateSchema: (() => {
                    const edTypes = educationType.enum;
                    // Using reselect here avoids running the filter code
                    // and creating a new object unless either benefit or
                    // relationship has changed
                    const filterEducationType = createSelector(
                      _.get('benefitSelection.data.benefit'),
                      _.get('applicantInformation.data.relationship'),
                      (benefitData, relationshipData) => {
                        // Remove tuition top-up
                        const filterOut = ['tuitionTopUp'];
                        // Correspondence not available to Chapter 35 (DEA) children
                        if (benefitData === 'chapter35' && relationshipData === 'child') {
                          filterOut.push('correspondence');
                        }
                        // Flight training available to Chapter 33 (Fry Scholarships) only
                        if (benefitData && benefitData !== 'chapter33') {
                          filterOut.push('flightTraining');
                        }

                        return { 'enum': _.without(filterOut, edTypes) };
                      });

                    return (pageData, form) => filterEducationType(form);
                  })()
                }
              }
            }
          }
        })
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: contactInformationPage('relativeAddress'),
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
