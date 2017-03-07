import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';
// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import { transform, benefitsLabels } from '../helpers';
import { enumToNames, showSchoolAddress } from '../../utils/helpers';
import { states } from '../../../common/utils/options-for-select';

import * as date from '../../../common/schemaform/definitions/date';
import * as bankAccount from '../../../common/schemaform/definitions/bankAccount';
import * as address from '../../../common/schemaform/definitions/address';
import * as phone from '../../../common/schemaform/definitions/phone';
import * as educationType from '../../definitions/educationType';
import contactInformation from '../../definitions/contactInformation';

import IntroductionPage from '../components/IntroductionPage';
import EmploymentPeriodView from '../components/EmploymentPeriodView';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  educationProgram,
  educationObjective,
  educationStartDate,
  restorativeTraining,
  vocationalTraining,
  trainingState,
  educationalCounseling
} = fullSchema5490.properties;

const {
  secondaryContact,
  nonMilitaryJobs
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
      pages: {}
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
              'ui:title': 'In what state do you plan on living while participating in this training?'
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
                type: 'string',
                enumNames: enumToNames(trainingState.enum, stateLabels)
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
