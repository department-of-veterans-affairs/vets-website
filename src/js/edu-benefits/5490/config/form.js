import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';
import { transform, benefitsLabels } from '../helpers';
import { enumToNames } from '../../utils/helpers';

import * as date from '../../../common/schemaform/definitions/date';
import * as fullName from '../../../common/schemaform/definitions/fullName';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  spouseInfo
} = fullSchema5490.properties;

const {
  relationship
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
              'ui:options': {
                expandUnder: 'relationship'
              }
            },
            relativeFullName: _.assign(fullName.uiSchema, {
              'ui:title': 'Name of Sponsor'
            })
          },
          schema: {
            type: 'object',
            definitions: {
              date // For spouseInfo
            },
            properties: {
              relationship,
              spouseInfo,
              relativeFullName: fullName.schema
            }
          }
        },
        sponsorService: {
          title: 'Sponsor Service',
          path: 'military-service/sponsor-service'
        },
        applicantService: {
          title: 'Applicant Service',
          path: 'military-service/applicant-service'
        },
        contributions: {
          title: 'Contributions',
          path: 'military-service/contributions'
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
