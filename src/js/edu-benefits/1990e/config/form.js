import _ from 'lodash/fp';

import fullSchema1990e from 'vets-json-schema/dist/transfer-benefits-schema.json';

import applicantInformation from '../../pages/applicantInformation';
import createContactInformationPage from '../../pages/contactInformation';
import createSchoolSelectionPage from '../../pages/schoolSelection';
import directDeposit from '../../pages/directDeposit';

import * as address from '../../../common/schemaform/definitions/address';
import { uiSchema as dateUiSchema } from '../../../common/schemaform/definitions/date';
import { uiSchema as nonMilitaryJobsUiSchema } from '../../../common/schemaform/definitions/nonMilitaryJobs';
import { uiSchema as ssnUiSchema } from '../../../common/schemaform/definitions/ssn';
import uiSchemaPostHighSchoolTrainings from '../../definitions/postHighSchoolTrainings';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform,
  eligibilityDescription
} from '../helpers';

import {
  benefitsLabels
} from '../../utils/helpers';

const {
  benefit,
  civilianBenefitsAssistance,
  faaFlightCertificatesInformation,
  serviceBranch
} = fullSchema1990e.properties;

const {
  date,
  dateRange,
  educationType,
  fullName,
  nonMilitaryJobs,
  postHighSchoolTrainings,
  ssn
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
  title: 'Apply for transferred education benefits',
  subTitle: 'Form 22-1990e',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: applicantInformation(fullSchema1990e)
      }
    },
    benefitEligibility: {
      title: 'Benefit Eligibility',
      pages: {
        benefitEligibility: {
          path: 'benefit-eligibility',
          title: 'Benefit Eligibility',
          uiSchema: {
            'view:benefitDescription': {
              'ui:description': eligibilityDescription
            },
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you.',
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
      title: 'Sponsor Veteran',
      pages: {
        sponsorVeteran: {
          title: 'Sponsor Veteran',
          path: 'sponsor-veteran',
          uiSchema: {
            veteranFullName: {
              first: {
                'ui:title': 'Veteran first name'
              },
              last: {
                'ui:title': 'Veteran last name'
              },
              middle: {
                'ui:title': 'Veteran middle name'
              },
              suffix: {
                'ui:title': 'Veteran suffix',
                'ui:options': {
                  widgetClassNames: 'form-select-medium'
                }
              }
            },
            veteranSocialSecurityNumber: _.set(['ui:title'], 'Veteran Social Security number', ssnUiSchema),
            veteranAddress: address.uiSchema('Veteran Address'),
            serviceBranch: {
              'ui:title': 'Branch of Service'
            },
            civilianBenefitsAssistance: {
              'ui:title': 'I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA.'
            }
          },
          schema: {
            type: 'object',
            required: ['veteranFullName', 'veteranSocialSecurityNumber'],
            properties: {
              veteranFullName: fullName,
              veteranSocialSecurityNumber: ssn,
              veteranAddress: address.schema(),
              serviceBranch,
              civilianBenefitsAssistance
            }
          }
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
        educationHistory: {
          path: 'education-history',
          title: 'Education History',
          initialData: {
          },
          uiSchema: {
            highSchoolOrGedCompletionDate: dateUiSchema('When did you earn your high school diploma or equivalency certificate?'),
            postHighSchoolTrainings: uiSchemaPostHighSchoolTrainings,
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
          title: 'Employment History',
          path: 'employment-history',
          uiSchema: {
            employmentHistory: {
              'view:hasNonMilitaryJobs': {
                'ui:title': 'Have you ever held a license of journeyman rating (for example, as a contractor or plumber) to practice a profession?',
                'ui:widget': 'yesNo'
              },
              nonMilitaryJobs: _.set(['ui:options', 'expandUnder'], 'view:hasNonMilitaryJobs', nonMilitaryJobsUiSchema)
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
        schoolSelection: createSchoolSelectionPage(fullSchema1990e, [
          'educationProgram',
          'educationObjective',
          'nonVaAssistance'
        ])
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
