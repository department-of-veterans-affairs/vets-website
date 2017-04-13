// import _ from 'lodash/fp';

import fullSchema5495 from 'vets-json-schema/dist/22-5495-schema.json';

// import pages from '../../pages/';
import applicantInformation from '../../pages/applicantInformation';
import contactInformationPage from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';

// import common schemaform definitions from '../../../common/schemaform/definitions/'

// import local modified definitions from '../../definitions/'

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';

import {
  survivorBenefitsLabels
} from '../../utils/helpers';

const {
  benefit
} = fullSchema5495.properties;

// const {
// } = fullSchema5495.definitions;

const formConfig = {
  urlPrefix: '/5495/',
  submitUrl: '/v0/education_benefits_claims/5495',
  trackingPrefix: 'edu-5495-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
  },
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-5495',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: applicantInformation(fullSchema5495, {
          required: ['relativeFullName', 'relativeDateOfBirth'],
          fields: [
            'relativeFullName',
            'relativeDateOfBirth',
            'gender',
            'relativeSocialSecurityNumber',
            'view:noSSN',
            'vaFileNumber'
          ]
        })
      }
    },
    benefitSelection: {
      title: 'Benefit Selection',
      pages: {
        benefitSelection: {
          path: 'benefits/selection', // other forms this is benefits/eligibility
          title: 'Benefit selection',
          uiSchema: {
            benefit: {
              'ui:title': 'Select the benefit that is the best match for you:',
              'ui:widget': 'radio',
              'ui:options': {
                labels: survivorBenefitsLabels
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              benefit
            }
          }
        }
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: contactInformationPage('relativeAddress'),
        directDeposit
      }
    }
  }
};


export default formConfig;
