import _ from 'lodash/fp';
import fullSchema5495 from 'vets-json-schema/dist/22-5495-schema.json';

import applicantInformation from '../../pages/applicantInformation';
import applicantServicePage from '../../pages/applicantService';
import createOldSchoolPage from '../../pages/oldSchool';
import createSchoolSelectionPage from '../../pages/schoolSelection';
import contactInformationPage from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';

import * as fullName from '../../../common/schemaform/definitions/fullName';

import * as veteranId from '../../definitions/veteranId';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';

import {
  survivorBenefitsLabels
} from '../../utils/helpers';

const {
  benefit,
  outstandingFelony,
  veteranFullName
} = fullSchema5495.properties;

const {
  school,
  educationType,
  date
} = fullSchema5495.definitions;

const formConfig = {
  urlPrefix: '/5495/',
  submitUrl: '/v0/education_benefits_claims/5495',
  trackingPrefix: 'edu-5495-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    fullName: fullName.schema,
    school,
    educationType,
    date
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
        }),
        applicantService: applicantServicePage()
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
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        sponsorInformation: {
          path: 'sponsor/information',
          title: 'Sponsor information',
          uiSchema: {
            veteranFullName: fullName.uiSchema,
            'view:veteranId': _.merge(veteranId.uiSchema, {
              'view:noSSN': {
                'ui:title': 'I don’t know my sponsor’s Social Security number',
              },
            }),
            outstandingFelony: {
              'ui:title': 'Do you or your sponsor have an outstanding felony and/or warrant?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName,
              'view:veteranId': veteranId.schema,
              outstandingFelony
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
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        newSchool: createSchoolSelectionPage(fullSchema5495, {
          required: ['educationType', 'name'],
          fields: [
            'educationProgram',
            'educationObjective'
          ]
        }),
        oldSchool: createOldSchoolPage(fullSchema5495)
      }
    },
  }
};


export default formConfig;
