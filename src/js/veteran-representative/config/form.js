// import fullSchema from 'vets-json-schema/dist/21-22-schema.json';

// this is only in use while Graham is building the actual schema, commented out above:
import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import IdentityFieldsWarning from '../components/IdentityFieldsWarning';
import asyncLoader from '../../common/components/asyncLoader';
import PhotoDescription from '../components/PhotoDescription';
import { prefillTransformer, submit, identityMatchesPrefill } from '../helpers';

import fullNameUI from '../../common/schemaform/definitions/fullName';
import ssnUI from '../../common/schemaform/definitions/ssn';
import * as addressDefinition from '../definitions/address';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import phoneUI from '../../common/schemaform/definitions/phone';
import fileUploadUI from '../../common/schemaform/definitions/file';
import { genderLabels } from '../../common/utils/labels';
import { validateMatch } from '../../common/schemaform/validation';
import validateFile from '../validation';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const {
  veteranDateOfBirth,
  veteranSocialSecurityNumber,
  veteranFullName,
  email,
  serviceBranch,
  photo
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
  submitUrl: '/v0/api',
  trackingPrefix: 'form-2122-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for veteran representative.',
    noAuth: 'Please sign in again to continue your application for veteran representative.'
  },
  title: 'Appoint a Veteran Service Officer as your representative',
  defaultDefinitions: {
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
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
          },
          schema: {
            type: 'object',
            required: ['email', 'view:confirmEmail'],
            properties: {
              email,
              'view:confirmEmail': email,
            }
          }
        }
      }
    },
    claimantInformation: {
      title: 'Claimant Information',
      pages: {
        claimantInformation: {
          path: 'claimant-information',
          title: 'Claimant Information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    veteranServiceOrganization: {
      title: 'Veteran Service Organization',
      pages: {
        veteranServiceOrganization: {
          path: 'veteran-service-organization',
          title: 'Veteran Service Organization',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    authorizationForRepresentativeAccessToRecords: {
      title: "Authorization for Representative's Access to Records Protected by Section 7332, TITLE 38, U.S.C.",
      pages: {
        authorizationForRepresentativeAccessToRecords: {
          path: 'authorization-for-representative-access-to-records',
          title: "Authorization for Representative's Access to Records Protected by Section 7332, TITLE 38, U.S.C.",
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    limitationOfConsent: {
      title: 'Limitation of Consent',
      pages: {
        limitationOfConsent: {
          path: 'limitation-of-consent',
          title: 'Limitation of Consent',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    authorizationToChangeClaimantAddress: {
      title: "Authorization to Change Claimaint's Address",
      pages: {
        authorizationToChangeClaimantAddress: {
          path: 'authorization-to-change-claimant-address',
          title: "Authorization to Change Claimaint's Address",
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    }
  }
};

export default formConfig;
