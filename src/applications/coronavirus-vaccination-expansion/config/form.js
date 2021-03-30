import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from './getFormHelp.jsx';

import {
  attestation,
  militaryHistory,
  personalInformation,
  addressInformation,
  vaLocation,
  veteranInformation,
} from './pages';

import { isTypeNone, isVeteran } from './helpers';
import PreSubmitInfo from './PreSubmitinfo';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/covid_vaccine/v0/expanded_registration`,
  trackingPrefix: 'covid-vaccination-expanded-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: PreSubmitInfo,
  formId: VA_FORM_IDS.FORM_COVID_VACCINATION_EXPANSION,
  version: 0,
  prefillEnabled: false,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  saveInProgress: {},
  title: 'Sign up to get a COVID-19 vaccine at VA',
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  customText: {
    reviewPageTitle: 'Review your information',
    appType: 'form',
  },
  chapters: {
    attestation: {
      title: 'Make sure you’re eligible',
      pages: {
        attestation: {
          path: 'eligibility',
          schema: attestation.schema.attestation,
          uiSchema: attestation.uiSchema.attestation,
        },
      },
    },
    militaryHistory: {
      title: 'Help us confirm your eligibility',
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
      title: 'Help us match you to an eligible Veteran',
      pages: {
        veteranInformation: {
          //  returning false to disable this page. leaving infrastructure in place as this may be desired functionality in the near future.
          // To revert set depends: formData => isSpouseOrCaregiver(formData)
          depends: () => false,
          path: 'veteran-information',
          schema: veteranInformation.schema.veteranInformation,
          uiSchema: veteranInformation.uiSchema.veteranInformation,
        },
      },
    },
    personalInformation: {
      title: 'Provide your personal information',
      pages: {
        personalInformation: {
          depends: formData => !isTypeNone(formData),
          path: 'personal-information',
          schema: personalInformation.schema.personalInformation,
          uiSchema: personalInformation.uiSchema.personalInformation,
        },
      },
    },
    addressInformation: {
      title: 'Provide your contact information',
      pages: {
        addressInformation: {
          depends: formData => !isTypeNone(formData),
          path: 'contact-information',
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
          path: 'vaccine-location',
          schema: vaLocation.schema.vaLocation,
          uiSchema: vaLocation.uiSchema.vaLocation,
        },
      },
    },
  },
};

export default formConfig;
