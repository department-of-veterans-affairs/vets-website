import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { profilePersonalInfoPage } from 'platform/forms-system/src/js/patterns/prefill/PersonalInformation';
import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import prefillTransform from './prefillTransform';

// Components
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import * as PayeeNumber from '../pages/PayeeNumber';

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
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...profilePersonalInfoPage({
          personalInfoConfig: {
            name: { show: true, required: true },
            ssn: { show: true, required: true },
            dateOfBirth: { show: true, required: false },
          },
          dataAdapter: {
            ssnPath: 'ssn',
          },
        }),
        payeeNumber: {
          path: 'payee-number',
          title: 'Payee Number',
          uiSchema: PayeeNumber.uiSchema,
          schema: PayeeNumber.schema,
          depends: formData => formData?.vaBenefitProgram === 'chapter35',
        },
        ...profileContactInfoPages({
          contactInfoRequiredKeys: ['mailingAddress'],
          content: {
            ...getContent('request'),
            title: 'Confirm the contact information we have on file for you',
            description: null,
          },
        }),
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
