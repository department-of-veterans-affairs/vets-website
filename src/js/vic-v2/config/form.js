// import { transform } from '../helpers';
import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PhotoField from '../components/PhotoField';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import ssnUI from '../../common/schemaform/definitions/ssn';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import { genderLabels } from '../../common/utils/labels';


const {
  veteranDateOfBirth,
  veteranSocialSecurityNumber,
  veteranFullName
} = fullSchemaVIC.properties;

const {
  fullName,
  ssn,
  date
} = fullSchemaVIC.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vic',
  trackingPrefix: 'veteran-id-card-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'VIC',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for a veteran id card.',
    noAuth: 'Please sign in again to resume your application for a veteran id card.'
  },
  title: 'Apply for veteran id card',
  defaultDefinitions: {
    ssn,
    fullName,
    date
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant/information',
          title: 'Applicant information',
          uiSchema: {
            veteranFullName: fullNameUI,
            veteranSocialSecurityNumber: ssnUI,
            'view:gender': {
              'ui:widget': 'radio',
              'ui:title': 'Gender',
              'ui:options': {
                labels: genderLabels
              }
            },
            veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
          },
          schema: {
            type: 'object',
            required: ['veteranFullName', 'veteranSocialSecurityNumber'],
            properties: {
              veteranFullName,
              veteranSocialSecurityNumber,
              'view:gender': {
                type: 'string',
                'enum': ['F', 'M']
              },
              veteranDateOfBirth
            }
          }
        }
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
      }
    },
    documentUpload: {
      title: 'Document Upload',
      pages: {
        photoUpload: {
          path: 'documents/photo',
          title: 'Photo upload',
          uiSchema: {
            photo: {
              'ui:field': PhotoField
            }
          },
          schema: {
            type: 'object',
            properties: {
              photo: {
                type: 'any'
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
