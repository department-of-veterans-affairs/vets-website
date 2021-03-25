// Example of an imported schema:
// import fullSchema from '../-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  attestation,
  notEligible,
  militaryHistory,
  complianceAgreement,
  personalInformation,
  addressInformation,
  vaLocation,
} from './pages';

import { isTypeNone, isVeteran } from './helpers';

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '1234',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Sign up to get a COVID-19 vaccine at VA',
  chapters: {
    attestation: {
      title: 'Verify your eligibility',
      pages: {
        attestation: {
          path: 'verify-eligibility',
          schema: attestation.schema.attestation,
          uiSchema: attestation.uiSchema.attestation,
        },
        notEligible: {
          depends: formData => isTypeNone(formData),
          path: 'eligibility',
          schema: notEligible.schema.notEligible,
          uiSchema: notEligible.uiSchema.notEligible,
        },
      },
    },
    statementOfTruth: {
      title: 'Certify these statements',
      pages: {
        complianceAgreement: {
          depends: formData => !isTypeNone(formData),
          path: 'compliance-agreement',
          schema: complianceAgreement.schema.complianceAgreement,
          uiSchema: complianceAgreement.uiSchema.complianceAgreement,
        },
      },
    },
    militaryHistory: {
      title: 'Tell us about your military service',
      pages: {
        militaryHistory: {
          depends: formData => isVeteran(formData),
          path: 'military-history',
          schema: militaryHistory.schema.militaryHistory,
          uiSchema: militaryHistory.uiSchema.militaryHistory,
        },
      },
    },
    personalInformation: {
      title: 'Applicant Information',
      pages: {
        personalInformation: {
          depends: formData => !isTypeNone(formData),
          title: 'Applicant Information',
          path: 'personal-information',
          schema: personalInformation.schema.personalInformation,
          uiSchema: personalInformation.uiSchema.personalInformation,
        },
      },
    },
    addressInformation: {
      title: 'Applicant Address',
      pages: {
        addressInformation: {
          depends: formData => !isTypeNone(formData),
          title: 'Applicant Address',
          path: 'address',
          schema: addressInformation.schema.addressInformation,
          uiSchema: addressInformation.uiSchema.addressInformation,
        },
      },
    },
    vaLocation: {
      title: 'Select where to go for your vaccine',
      pages: {
        vaLocation: {
          depends: formData => !isTypeNone(formData),
          path: 'VA Location',
          schema: vaLocation.schema.vaLocation,
          uiSchema: vaLocation.uiSchema.vaLocation,
        },
      },
    },
  },
};

export default formConfig;
