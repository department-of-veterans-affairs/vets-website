import _ from 'lodash/fp';

import fullSchema31 from 'vets-json-schema/dist/28-1900-schema.json';

import * as address from '../../../common/schemaform/definitions/address';
import phoneUI from '../../../common/schemaform/definitions/phone';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import createVeteranInfoPage from '../../pages/veteranInfo';
import { facilityLocatorLink } from '../helpers';
import { validateMatch } from '../../../common/schemaform/validation';

const {
  daytimePhone,
  email,
  eveningPhone,
  vaRecordsOffice
} = fullSchema31.properties;

const {
  date,
  fullName,
  phone,
  ssn,
  vaFileNumber,
} = fullSchema31.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vre',
  trackingPrefix: 'vre-chapter-31',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-1900',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: '',
    noAuth: ''
  },
  title: 'Apply for Vocational Rehabilitation',
  subTitle: 'Form 28-1900',
  defaultDefinitions: {
    fullName,
    date,
    phone,
    ssn,
    vaFileNumber,
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: createVeteranInfoPage(fullSchema31, {
          uiSchema: {
            vaRecordsOffice: {
              'ui:title': 'VA benefit office where your records are located',
              'ui:help': facilityLocatorLink
            }
          },
          schema: {
            vaRecordsOffice
          }
        })
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        militaryHistory: {
          path: 'military-information',
          title: 'Military Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    workInformation: {
      title: 'Work Information',
      pages: {
        workInformation: {
          path: 'work-information',
          title: 'Work Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    educationAndVREInformation: {
      title: 'Education and Vocational Rehab Information',
      pages: {
        educationAndVREInformation: {
          path: 'education-vre-information',
          title: 'Education and Vocational Rehab Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    disabilityInformation: {
      title: 'Disability Information',
      pages: {
        disabilityInformation: {
          path: 'Disability-information',
          title: 'Disability Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
        veteranAddress: {
          path: 'veteran-address',
          title: 'Address information',
          uiSchema: {
            veteranAddress: address.uiSchema(),
            'view:isMoving': {
              'ui:title': 'Are you moving within the next 30 days?',
              'ui:widget': 'yesNo'
            },
            veteranNewAddress: _.merge(
              address.uiSchema('', false, (formData) => formData['view:isMoving']),
              {
                'ui:options': {
                  expandUnder: 'view:isMoving'
                }
              }
            )
          },
          schema: {
            type: 'object',
            required: ['veteranAddress'],
            properties: {
              veteranAddress: address.schema(fullSchema31, true),
              'view:isMoving': {
                type: 'boolean'
              },
              veteranNewAddress: address.schema(fullSchema31)
            }
          }
        },
        contactInformation: {
          path: 'contact-information',
          title: 'Contact information',
          uiSchema: {
            daytimePhone: phoneUI('Daytime phone number'),
            eveningPhone: phoneUI('Evening phone number'),
            email: {
              'ui:title': 'Email address'
            },
            'view:confirmEmail': {
              'ui:title': 'Re-enter email address',
              'ui:options': {
                hideOnReview: true
              }
            },
            'ui:validations': [
              validateMatch('email', 'view:confirmEmail')
            ]
          },
          schema: {
            type: 'object',
            properties: {
              daytimePhone,
              eveningPhone,
              email,
              'view:confirmEmail': email,
            }
          }
        }
      }
    }
  }
};

export default formConfig;
