import fullSchema36 from 'vets-json-schema/dist/28-8832-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import ssnUI from '../../../common/schemaform/definitions/ssn';

const {
  seekingRestorativeTraining,
  seekingVocationalTraining,
  receivedPamphlet
} = fullSchema36.properties;

const {
  ssn,
  gender
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
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      initialData: {
        socialSecurityNumber: '424242424'
      },
      pages: {
        applicantInformation: {
          title: 'Applicant information',
          path: 'applicant-information',
          uiSchema: {
            socialSecurityNumber: ssnUI,
            gender: {
              'ui:title': 'Gender',
              'ui:widget': 'radio'
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
              'ui:title': 'Have you received a pamphlet explaining survivors\' and dependents\' educational assistance benefits?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            definitions: {
              seekingRestorativeTraining,
              seekingVocationalTraining,
              receivedPamphlet
            },
            properties: {
              socialSecurityNumber: ssn,
              gender
            }
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
};

export default formConfig;
