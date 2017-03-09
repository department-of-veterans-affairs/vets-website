import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';
// benefitsLabels should be imported from utils/helpers, but for now, they don't
//  all have links, so for consistency, use the set in ../helpers
import { transform, benefitsLabels } from '../helpers';
import { enumToNames } from '../../utils/helpers';

import * as address from '../../../common/schemaform/definitions/address';
import * as bankAccount from '../../../common/schemaform/definitions/bankAccount';
import * as date from '../../../common/schemaform/definitions/date';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as phone from '../../../common/schemaform/definitions/phone';
import contactInformation from '../../definitions/contactInformation';

import IntroductionPage from '../components/IntroductionPage';
import EmploymentPeriodView from '../components/EmploymentPeriodView';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  previousBenefits
} = fullSchema5490.properties;

const {
  nonMilitaryJobs,
  secondaryContact,
  ssn
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
  defaultDefnitions: {
    ssn,
    fullName: fullName.schema
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
        },
        previousBenefits: {
          title: 'Previous Benefits',
          path: 'benefits-eligibility/previous-benefits',
          initialData: {},
          uiSchema: {
            previousBenefits: {
              disability: {
                'ui:title': 'Disability Compensation or Pension'
              },
              dic: {
                'ui:title': 'Dependents\' Indemnity Compensation (DIC)'
              },
              chapter31: {
                'ui:title': 'Vocational Rehabilitation benefits (Chapter 31)'
              },
              // I think we'll need a view-only checkbox to reveal this one
              //  'Veterans education assistance based on your own service'
              ownServiceBenefits: {
                'ui:title': 'Specify benefits'
              },
              // View-only checkbox to reveal these:
              chapter35: {
                'ui:title': ''
              },
              chapter33: {
                'ui:title': ''
              },
              transferOfEntitlement: {
                'ui:title': ''
              },
              other: {
                'ui:title': ''
              },
              // And another to reveal these:
              veteranFullName: {
                'ui:title': ''
              },
              veteranSocialSecurityNumber: {
                'ui:title': ''
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              previousBenefits
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
