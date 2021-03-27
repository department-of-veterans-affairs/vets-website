import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  attestation,
  notEligible,
  militaryHistory,
  complianceAgreement,
  personalInformation,
  addressInformation,
  vaLocation,
  veteranInformation,
} from './pages';

import { isTypeNone, isVeteran, isSpouseOrCaregiver } from './helpers';
import PreSubmitInfo from './PreSubmitinfo';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: PreSubmitInfo,
  formId: VA_FORM_IDS.FORM_COVID_VACCINATION_EXPANSION,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  saveInProgress: {},
  title: 'Sign up to get a COVID-19 vaccine at VA',
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
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
          path: 'attestation',
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
          path: 'service-information',
          schema: militaryHistory.schema.militaryHistory,
          uiSchema: militaryHistory.uiSchema.militaryHistory,
        },
      },
    },
    veteranInformation: {
      title: "Veteran's information",
      pages: {
        veteranInformation: {
          depends: formData => isSpouseOrCaregiver(formData),
          path: 'veteran-information',
          schema: veteranInformation.schema.veteranInformation,
          uiSchema: veteranInformation.uiSchema.veteranInformation,
        },
      },
    },
    personalInformation: {
      title: 'Applicant Information',
      pages: {
        personalInformation: {
          depends: formData => !isTypeNone(formData),
          title: 'Applicant Information',
          path: 'recipient-information',
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
