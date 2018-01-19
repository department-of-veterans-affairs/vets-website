// import { transform } from '../helpers';
import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PhotoField from '../components/PhotoField';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import ssnUI from '../../common/schemaform/definitions/ssn';
import * as addressDefinition from '../../common/schemaform/definitions/address';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import phoneUI from '../../common/schemaform/definitions/phone';
import { genderLabels } from '../../common/utils/labels';
import { validateMatch } from '../../common/schemaform/validation';

const {
  veteranDateOfBirth,
  veteranSocialSecurityNumber,
  veteranFullName,
  email,
  serviceBranch
} = fullSchemaVIC.properties;

const {
  fullName,
  ssn,
  date,
  phone,
  gender
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
  title: 'Apply for Veteran ID Card',
  defaultDefinitions: {
    ssn,
    fullName,
    date
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: {
            veteranFullName: fullNameUI,
            veteranSocialSecurityNumber: ssnUI,
            gender: {
              'ui:widget': 'radio',
              'ui:title': 'Gender',
              'ui:options': {
                labels: genderLabels
              }
            },
            veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
            serviceBranch: {
              'ui:title': 'Branch of service',
              'ui:description': 'If you have more than one branch of service, choose the one you want represented on the Veteran ID Card.',
              'ui:options': {
                labels: {
                  F: 'Air Force',
                  A: 'Army',
                  C: 'Coast Guard',
                  D: 'DoD',
                  M: 'Marine Corps',
                  N: 'Navy',
                  O: 'NOAA',
                  H: 'Public Health Service',
                  4: 'Foreign Air Force',
                  1: 'Foreign Army',
                  6: 'Foreign Coast Guard',
                  3: 'Foreign Marine Corps',
                  2: 'Foreign Navy',
                  X: 'Other',
                  Z: 'Unknown'
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'veteranFullName',
              'veteranSocialSecurityNumber',
              'veteranDateOfBirth',
              'serviceBranch',
              'gender'
            ],
            properties: {
              veteranFullName,
              gender,
              veteranSocialSecurityNumber,
              veteranDateOfBirth,
              serviceBranch
            }
          }
        }
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
        addressInformation: {
          path: 'address-information',
          title: 'Address information',
          uiSchema: {
            veteranAddress: addressDefinition.uiSchema(),
          },
          schema: {
            type: 'object',
            required: ['veteranAddress'],
            properties: {
              veteranAddress: addressDefinition.schema(fullSchemaVIC, true),
            }
          }
        },
        contactInformation: {
          path: 'contact-information',
          title: 'Contact information',
          uiSchema: {
            email: {
              'ui:title': 'Email address'
            },
            'view:confirmEmail': {
              'ui:title': 'Re-enter email address',
              'ui:options': {
                hideOnReview: true
              }
            },
            phone: phoneUI('Phone number'),
            'ui:validations': [
              validateMatch('email', 'view:confirmEmail')
            ]
          },
          schema: {
            type: 'object',
            required: ['email', 'view:confirmEmail'],
            properties: {
              email,
              'view:confirmEmail': email,
              phone
            }
          }
        }
      }
    },
    documentUpload: {
      title: 'Document Upload',
      pages: {
        photoUpload: {
          path: 'documents/photo',
          title: 'Photo upload',
          uiSchema: {
            'ui:title': 'Upload Your Photo',
            photo: {
              'ui:field': PhotoField,
              'ui:title': 'Please upload a current photo of yourself that’ll appear on your Veteran ID Card.',

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
