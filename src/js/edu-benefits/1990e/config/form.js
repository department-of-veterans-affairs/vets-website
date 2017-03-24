import _ from 'lodash/fp';

import fullSchema1990e from 'vets-json-schema/dist/transfer-benefits-schema.json';

import additionalBenefits from '../../pages/additionalBenefits';
import applicantInformation from '../../pages/applicantInformation';
import createContactInformationPage from '../../pages/contactInformation';
import createSchoolSelectionPage from '../../pages/schoolSelection';
import directDeposit from '../../pages/directDeposit';

import * as address from '../../../common/schemaform/definitions/address';
import { uiSchema as fullNameUISchema } from '../../../common/schemaform/definitions/fullName';
import { uiSchema as dateUi } from '../../../common/schemaform/definitions/date';
import { uiSchema as nonMilitaryJobsUi } from '../../../common/schemaform/definitions/nonMilitaryJobs';
import postHighSchoolTrainingsUi from '../../definitions/postHighSchoolTrainings';
import * as veteranId from '../../definitions/veteranId';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform,
  eligibilityDescription,
  benefitsLabels
} from '../helpers';

const {
  benefit,
  faaFlightCertificatesInformation,
  serviceBranch
} = fullSchema1990e.properties;

const {
  date,
  dateRange,
  educationType,
  fullName,
  nonMilitaryJobs,
  postHighSchoolTrainings
} = fullSchema1990e.definitions;

const formConfig = {
  urlPrefix: '/1990e/',
  submitUrl: '/v0/education_benefits_claims/1990e',
  trackingPrefix: 'edu-1990e-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
    dateRange,
    educationType
  },
  title: 'Apply to use transferred education benefits',
  subTitle: 'Form 22-1990e',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: applicantInformation(fullSchema1990e),
        additionalBenefits: additionalBenefits(fullSchema1990e)
      }
    },
    benefitEligibility: {
      title: 'Benefits Eligibility',
      pages: {
        benefitEligibility: {
          path: 'benefits/eligibility',
          title: 'Benefits eligibility',
          uiSchema: {
            'view:benefitDescription': {
              'ui:description': eligibilityDescription
            },
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that has been transferred to you.',
              'ui:options': {
                labels: benefitsLabels
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:benefitDescription': {
                type: 'object',
                properties: {}
              },
              benefit
            }
          },
        }
      }
    },
    sponsorVeteran: {
      title: 'Sponsor Information',
      pages: {
        sponsorVeteran: {
          title: 'Sponsor information',
          path: 'sponsor/information',
          uiSchema: {
            veteranFullName: _.merge(fullNameUISchema, {
              first: {
                'ui:title': 'Sponsor first name'
              },
              last: {
                'ui:title': 'Sponsor last name'
              },
              middle: {
                'ui:title': 'Sponsor middle name'
              },
              suffix: {
                'ui:title': 'Sponsor suffix',
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
            veteranAddress: address.uiSchema('Sponsor address'),
            serviceBranch: {
              'ui:title': 'Sponsor Branch of Service'
            }
          },
          schema: {
            type: 'object',
            required: ['veteranFullName'],
            properties: {
              veteranFullName: fullName,
              'view:veteranId': veteranId.schema,
              veteranAddress: address.schema(),
              serviceBranch
            }
          }
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
        educationHistory: {
          path: 'education/history',
          title: 'Education history',
          initialData: {
          },
          uiSchema: {
            highSchoolOrGedCompletionDate: dateUi('When did you earn your high school diploma or equivalency certificate?'),
            postHighSchoolTrainings: postHighSchoolTrainingsUi,
            faaFlightCertificatesInformation: {
              'ui:title': 'If you have any FAA flight certificates, please list them here.',
              'ui:widget': 'textarea'
            }
          },
          schema: {
            type: 'object',
            properties: {
              highSchoolOrGedCompletionDate: date,
              postHighSchoolTrainings,
              faaFlightCertificatesInformation
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
            employmentHistory: {
              'view:hasNonMilitaryJobs': {
                'ui:title': 'Have you ever held a license of journeyman rating (for example, as a contractor or plumber) to practice a profession?',
                'ui:widget': 'yesNo'
              },
              nonMilitaryJobs: _.set(['ui:options', 'expandUnder'], 'view:hasNonMilitaryJobs', nonMilitaryJobsUi)
            }
          },
          schema: {
            type: 'object',
            properties: {
              employmentHistory: {
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
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        schoolSelection: createSchoolSelectionPage(fullSchema1990e, {
          fields: [
            'educationProgram',
            'educationObjective'
          ],
          required: ['educationType']
        })
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: createContactInformationPage('relativeAddress'),
        directDeposit
      }
    }
  }
};

export default formConfig;
