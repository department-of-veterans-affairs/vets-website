import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { profilePersonalInfoPage } from 'platform/forms-system/src/js/patterns/prefill/PersonalInformation';
import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';

// Components
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import {
  educationBenefitsElibility,
  educationBenefitsHistory,
  hasPreviouslyApplied,
  payeeNumber,
} from '../pages';

import prefillTransform from './prefillTransform';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10272-edu-benefits',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_22_10272,
  saveInProgress: {
    messages: {
      inProgress: 'Your request (22-10272) is in progress.',
      expired:
        'Your saved request (22-10272) has expired. Please start a new request.',
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
        },
        educationBenefitsHistory: {
          path: 'education-benefits-history',
          title: 'Your VA education benefits history',
          uiSchema: educationBenefitsHistory.uiSchema,
          schema: educationBenefitsHistory.schema,
          depends: formData => formData?.hasPreviouslyApplied === true,
        },
        educationBenefitsEligibility: {
          path: 'education-benefits-eligibility',
          title: 'Your VA education benefits history',
          uiSchema: educationBenefitsElibility.uiSchema,
          schema: educationBenefitsElibility.schema,
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
            ssnPath: 'vaFileNumber',
          },
        }),
        payeeNumber: {
          path: 'payee-number',
          title: 'Your VA payee number',
          uiSchema: payeeNumber.uiSchema,
          schema: payeeNumber.schema,
        },
        ...profileContactInfoPages({
          content: {
            ...getContent('request'),
            title: 'Confirm the contact information we have on file for you',
          },
          contactInfoRequiredKeys: ['mailingAddress'],
        }),
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
