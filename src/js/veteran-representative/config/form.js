// import fullSchema from 'vets-json-schema/dist/21-22-schema.json';
// import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';

import fullSchema from '../2122-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import IdentityFieldsWarning from '../components/IdentityFieldsWarning';
import asyncLoader from '../../common/components/asyncLoader';
import { prefillTransformer, submit, identityMatchesPrefill } from '../helpers';

import fullNameUI from '../../common/schemaform/definitions/fullName';
import ssnUI from '../../common/schemaform/definitions/ssn';
import * as addressDefinition from '../definitions/address';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import phoneUI from '../../common/schemaform/definitions/phone';
import { genderLabels } from '../../common/utils/labels';
import { validateMatch } from '../../common/schemaform/validation';

const {
  veteranDateOfBirth,
  // email,
  // serviceBranch,
  // photo
} = fullSchema.properties;

const {
  fullName,
  date,
  // phone,
  gender,
} = fullSchema.definitions;

const { ssn, vaFileNumber, insuranceNumber } = fullSchema.properties.veteran;
const { address, email, phone, relationship } = fullSchema.properties.claimant;

console.log("full schema", fullSchema);
console.log("claimantAddress", address);


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
    fullName,
    ssn,
    vaFileNumber,
    insuranceNumber,
    address,
    email,
    phone,
    relationship,
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: {
            fullName: fullNameUI,
            ssn: ssnUI,
            vaFileNumber: { 'ui:title': 'VA file number'},
            insuranceNumber: {'ui:title': 'Insurance Number'},
          },
          schema: {
            type: 'object',
            required: [
              'fullName',
              'ssn',
              'vaFileNumber',
              'insuranceNumber',
            ],
            properties: {
              fullName,
              ssn,
              vaFileNumber,
              insuranceNumber,
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
            fullName: fullNameUI,
            relationship: { 'ui:title': 'Relationship to Veteran (parent, spouse, child, ?)'},
            // address: ,
            email: { 'ui:title': 'Email address' },
            phone: phoneUI,
          },
          schema: {
            type: 'object',
            required: [
              'fullName',
              'address',
              'email',
              'phone',
              'relationship',
            ],
            properties: {
              fullName,
              address,
              email,
              phone,
              relationship,
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
