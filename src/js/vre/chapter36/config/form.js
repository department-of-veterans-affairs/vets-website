import _ from 'lodash/fp';

import fullSchema36 from 'vets-json-schema/dist/28-8832-schema.json';

import {
  genderLabels
} from '../../../common/utils/labels.jsx';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import ssnUI from '../../../common/schemaform/definitions/ssn';
import fullNameUI from '../../../common/schemaform/definitions/fullName';

const {
  applicantFullName,
  applicantGender,
  applicantSocialSecurityNumber,
  seekingRestorativeTraining,
  seekingVocationalTraining,
  receivedPamphlet
} = fullSchema36.properties;

const {
  fullName,
  gender,
  ssn
} = fullSchema36.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vre',
  trackingPrefix: 'vre-chapter-36',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-8832',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for vocational counseling.',
    noAuth: 'Please sign in again to resume your application for vocational counseling.'
  },
  title: 'Apply for vocational counseling',
  subTitle: 'Form 28-8832',
  defaultDefinitions: {
    fullName,
    gender,
    ssn
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          title: 'Applicant information',
          path: 'applicant-information',
          applicantRelationshipToVeteran: 'Spouse',
          uiSchema: {
            'view:isVeteran': {
              'ui:title': 'Are you a Servicemember or Veteran applying for counseling service?',
              'ui:widget': 'yesNo'
            },
            applicantFullName: _.merge(fullNameUI, {
              first: {
                'ui:required': formData => formData['view:isVeteran'] === false,
              },
              last: {
                'ui:required': formData => formData['view:isVeteran'] === false,
              },
              'ui:options': {
                expandUnder: 'view:isVeteran',
                expandUnderCondition: false
              }
            }),
            applicantRelationshipToVeteran: {
              'ui:title': 'What is your relationship to the Servicemember or Veteran?',
              'ui:widget': 'radio',
              'ui:required': formData => formData['view:isVeteran'] === false,
              'ui:options': {
                expandUnder: 'view:isVeteran',
                expandUnderCondition: false
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:isVeteran'],
            properties: {
              'view:isVeteran': {
                type: 'boolean'
              },
              applicantFullName: _.unset('required', applicantFullName),
              applicantRelationshipToVeteran: {
                type: 'string',
                'enum': [
                  'Spouse',
                  'Surviving spouse',
                  'Child',
                  'Stepchild',
                  'Adopted child'
                ]
              }
            }
          }
        },
        dependentInformation: {
          title: 'Applicant information',
          path: 'dependent-information',
          depends: {
            'view:isVeteran': false
          },
          uiSchema: {
            applicantSocialSecurityNumber: ssnUI,
            applicantGender: {
              'ui:title': 'Gender',
              'ui:widget': 'radio',
              'ui:options': {
                labels: genderLabels
              }
            },
            seekingRestorativeTraining: {
              'ui:title': 'Are you a child who is at least 14 years old, a spouse, or a surviving spouse with a disability and looking for special restorative training?',
              'ui:widget': 'yesNo'
            },
            seekingVocationalTraining: {
              'ui:title': 'Are you a child, a spouse, or a surviving spouse with a disability and looking for special vocational training',
              'ui:widget': 'yesNo'
            },
            receivedPamphlet: {
              'ui:title': 'Have you received a pamphlet explaining survivors’ and dependents’ educational assistance benefits?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              applicantSocialSecurityNumber,
              applicantGender,
              seekingRestorativeTraining,
              seekingVocationalTraining,
              receivedPamphlet
            }
          }
        }
      },
      veteranInformation: {
        title: 'Veteran Information',
        pages: {
        }
      },
      additionalInformation: {
        title: 'Additional Information',
        pages: {
        }
      },
      militaryHistory: {
        title: 'Military History',
        pages: {
        }
      },
      contactInformation: {
        title: 'Contact Information',
        pages: {
        }
      }
    }
  }
};


export default formConfig;
