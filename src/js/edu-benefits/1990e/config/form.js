import _ from 'lodash/fp';

import {
  transform,
  eligibilityDescription
} from '../helpers';

import fullSchema1990e from 'vets-json-schema/dist/transfer-benefits-schema.json';

import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as gender from '../../../common/schemaform/definitions/gender';
import * as fullName from '../../../common/schemaform/definitions/fullName';
import * as ssn from '../../../common/schemaform/definitions/ssn';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { enumToNames, benefitsLabels, relationshipLabels } from '../../utils/helpers';

const {
  benefit,
  relationship
} = fullSchema1990e.properties;

const formConfig = {
  urlPrefix: '/1990e/',
  submitUrl: '/v0/education_benefits_claims/1990e',
  trackingPrefix: 'edu-1990e-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for transferred education benefits',
  subTitle: 'Form 22-1990e',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant information',
          initialData: {},
          uiSchema: {
            applicantFullName: fullName.uiSchema,
            applicantSocialSecurityNumber: ssn.uiSchema,
            applicantDateOfBirth: currentOrPastDate.uiSchema('Applicant date of birth'),
            applicantGender: gender.uiSchema('Applicant gender'),
            relationship: {
              'ui:widget': 'radio',
              'ui:title': 'What is your relationship to the service member whose benefit is being transferred to you?'
            }
          },
          schema: {
            type: 'object',
            required: ['applicantFullName'],
            properties: {
              applicantFullName: fullName.schema,
              applicantSocialSecurityNumber: ssn.schema,
              applicantDateOfBirth: currentOrPastDate.schema,
              applicantGender: gender.schema,
              relationship: _.assign(relationship, {
                enumNames: enumToNames(relationship.enum, relationshipLabels)
              })
            }
          }
        },
        sponsorInformation: {
        }
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
              'ui:title': 'Select the benefit that is the best match for you.'
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:benefitDescription': {
                type: 'object',
                properties: {}
              },
              benefit: _.assign(benefit, {
                enumNames: enumToNames(benefit.enum, benefitsLabels)
              })
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
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
      }
    }
  }
};


export default formConfig;
