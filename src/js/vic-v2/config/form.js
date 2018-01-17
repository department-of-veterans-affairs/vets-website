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
  phone
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
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
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
    militaryContactInformation: {
      title: 'Military and Contact Information',
      pages: {
        militaryContactInformation: {
          path: 'military-contact-information',
          title: 'Military and contact information',
          uiSchema: {
            'view:military': {
              'ui:title': 'Military information',
              serviceBranch: {
                'ui:title': 'Branch of service'
              }
            },
            'view:contact': {
              'ui:title': 'Contact information',
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
          },
          schema: {
            type: 'object',
            properties: {
              'view:military': {
                type: 'object',
                require: ['serviceBranch'],
                properties: {
                  serviceBranch
                }
              },
              'view:contact': {
                type: 'object',
                required: ['email', 'view:confirmEmail'],
                properties: {
                  email,
                  'view:confirmEmail': email,
                  phone
                }
              },
            }
          }
        },
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
