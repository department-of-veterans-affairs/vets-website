import {
  transform,
  eligibilityDescription
} from '../helpers';

import fullSchema1990e from 'vets-json-schema/dist/transfer-benefits-schema.json';


import contactInformation from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';
import createSchoolSelectionPage from '../../pages/schoolSelection';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import applicantInformation from '../../pages/applicantInformation';

import { benefitsLabels } from '../../utils/helpers';

const {
  benefit,
} = fullSchema1990e.properties;

const {
  educationType,
  date
} = fullSchema1990e.definitions;

const formConfig = {
  urlPrefix: '/1990e/',
  submitUrl: '/v0/education_benefits_claims/1990e',
  trackingPrefix: 'edu-1990e-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for transferred education benefits',
  subTitle: 'Form 22-1990e',
  defaultDefinitions: {
    educationType,
    date
  },
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
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
      }
    },
    employmentHistory: {
      title: 'Employment History',
      pages: {
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
        contactInformation,
        directDeposit
      }
    }
  }
};

export default formConfig;
