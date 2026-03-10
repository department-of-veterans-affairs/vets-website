import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import prefillTransform from './prefillTransform';

// Components
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import {
  educationBenefitsEligibility,
  hasPreviouslyApplied,
  selectVaBenefit,
} from '../pages';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '0810-edu-benefits',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_22_0810,
  saveInProgress: {
    messages: {
      inProgress: 'Your request (22-0810) is in progress.',
      expired:
        'Your saved request (22-0810) has expired. Please start a new request.',
      saved: 'Your request has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer: prefillTransform,
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your request.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  customText: {
    appType: 'request',
    continueAppButtonText: 'Continue your request',
    startNewAppButtonText: 'Start a new request',
    finishAppLaterMessage: 'Finish this request later',
    appSavedSuccessfullyMessage: 'We’ve saved your request.',
    reviewPageTitle: 'Review',
    submitButtonText: 'Continue',
  },
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
  chapters: {
    educationBenefitsChapter: {
      title: 'Your education benefits information',
      pages: {
        hasPreviouslyApplied: {
          path: 'previously-applied',
          title: 'Your VA education benefits',
          uiSchema: hasPreviouslyApplied.uiSchema,
          schema: hasPreviouslyApplied.schema,
          updateFormData: hasPreviouslyApplied.updateFormData,
        },
        selectVABenefit: {
          path: 'select-va-benefit-program',
          title: 'Select a VA benefit program',
          uiSchema: selectVaBenefit.uiSchema,
          schema: selectVaBenefit.schema,
          depends: formData => formData?.hasPreviouslyApplied === true,
        },
        educationBenefitsEligibility: {
          path: 'education-benefits-eligibility',
          title: 'Your VA education benefits',
          uiSchema: educationBenefitsEligibility.uiSchema,
          schema: educationBenefitsEligibility.schema,
          depends: formData => formData?.hasPreviouslyApplied === false,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
