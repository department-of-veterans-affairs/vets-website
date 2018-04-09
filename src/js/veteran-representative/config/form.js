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
import {CheckboxWidget} from '../../common/schemaform/widgets';

const {
  veteranFullName,
  veteranSSN,
  vaFileNumber,
  insuranceNumber,
  claimantFullName,
  claimantAddress,
  claimantEmail,
  claimantDaytimePhone,
  claimantEveningPhone,
  relationship,
  appointmentDate,
  organizationName,
  organizationEmail,
  organizationRepresentativeName,
  organizationRepresentativeTitle,
  authorization,
  // email,
  // serviceBranch,
  // photo
} = fullSchema.properties;

const {
  fullName,
} = fullSchema.definitions;

const authorizationForRepresentativeAccessToRecordsDescription = "I authorize the VA facility having custody of my VA claimant records to disclose to the service organization named in Item 3A treatment records relating to drug abuse, alcoholism or alcohol abuse, infection with the human immunodeficiency virus (HIV), or sickle cell anemia. Redisclosure of these records by my service organization representative, other than to the VA or the Court of Appeals for Veterans Claims, is not authorized without my further consent. This authorization will remain in effect until the earlier of the following events: (1) I revoke this authorization by filing a written revocation with VA; or (2) I revoke the appointment of the service organization named above, either by explicit revocation or the appointment if another representative"

console.log("full schema", fullSchema);

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
    // ssn,
    // vaFileNumber,
    // insuranceNumber,
    // address,
    // email,
    // phone,
    // relationship,
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
            veteranSSN: ssnUI,
            vaFileNumber: { 'ui:title': 'VA file number'},
            insuranceNumber: {'ui:title': 'Insurance Number'},
          },
          schema: {
            type: 'object',
            // required: [
            //   'fullName',
            //   'veteranSSN',
            //   'vaFileNumber',
            //   'insuranceNumber',
            // ],
            properties: {
              fullName,
              veteranSSN,
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
            claimantAddress: {'ui:title': 'Address'},
            claimantEmail: { 'ui:title': 'Email address' },
            claimantDaytimePhone: phoneUI('Daytime phone number'),
            claimantEveningPhone: phoneUI('Evening phone number'),
            appointmentDate: currentOrPastDateUI("Date of claimaint's appointment"),
          },
          schema: {
            type: 'object',
            // required: [
            //   'fullName',
            //   'claimantAddress',
            //   'claimantEmail',
            //   'claimantDaytimePhone',
            //   'claimantEveningPhone',
            //   'relationship',
            //   'appointmentDate',
            // ],
            properties: {
              fullName,
              claimantAddress,
              claimantEmail,
              claimantDaytimePhone,
              claimantEveningPhone,
              relationship,
              appointmentDate,
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
            organizationName: {'ui:title': 'Service organization name'},
            organizationEmail: {'ui:title': 'Service organization email address'},
            organizationRepresentativeName: {'ui:title': "Official representative's name"},
            organizationRepresentativeTitle: {'ui:title': "Official representative's job title"},
          },
          schema: {
            type: 'object',
            // required: [
            //   'organizationName',
            //   'organizationEmail',
            //   'organizationRepresentativeName',
            //   'organizationRepresentativeTitle',
            // ],
            properties: {
              organizationName,
              organizationEmail,
              organizationRepresentativeName,
              organizationRepresentativeTitle,
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
            authorization: {
              'ui:title': authorizationForRepresentativeAccessToRecordsDescription,
            },
          },
          schema: {
            type: 'object',
            // required: [authorization],
            properties: {
              authorization
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
