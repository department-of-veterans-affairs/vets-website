// @ts-check
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '~/platform/utilities/environment';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PresubmitInfo from '../components/PresubmitInfo';

import { CustomReviewTopContent } from '../helpers';

import * as PreviouslyApplied from '../pages/PreviouslyApplied';
import * as SelectVABenefit from '../pages/SelectVABenefit';
import * as VABenefitWarning from '../pages/VABenefitWarning';
import * as PayeeNumber from '../pages/PayeeNumber';
import * as TestNameAndDate from '../pages/TestNameAndDate';
import * as OrganizationInfo from '../pages/OrganizationInfo';
import * as TestCost from '../pages/TestCost';
import * as Remarks from '../pages/Remarks';
import * as SubmissionInstructions from '../pages/SubmissionInstructions';

import submitForm from './submitForm';
import transform from './transform';
import prefillTransform from './prefillTransform';

export const SUBMIT_URL = `${
  environment.API_URL
}/v0/education_benefits_claims/0803`;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitForm,
  trackingPrefix: '0803-edu-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_22_0803,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-0803) is in progress.',
    //   expired: 'Your saved education benefits application (22-0803) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer: prefillTransform,
  transformForSubmit: transform,
  preSubmitInfo: {
    CustomComponent: PresubmitInfo,
    required: true,
    statementOfTruth: {
      useProfileFullName: true,
    },
  },
  CustomReviewTopContent,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  customText: {
    reviewPageTitle: 'Review',
    submitButtonText: 'Continue',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
  chapters: {
    benefitsInformationChapter: {
      title: 'Your education benefits information',
      pages: {
        previouslyApplied: {
          path: 'previously-applied',
          title: 'Previously Applied',
          uiSchema: PreviouslyApplied.uiSchema,
          schema: PreviouslyApplied.schema,
        },
        selectVABenefit: {
          path: 'select-va-benefit-program',
          title: 'VA Benefit Program',
          uiSchema: SelectVABenefit.uiSchema,
          schema: SelectVABenefit.schema,
          depends: formData => formData?.hasPreviouslyApplied,
        },
        vaBenefitWarning: {
          path: 'va-benefit-warning',
          title: 'You VA education benefits',
          uiSchema: VABenefitWarning.uiSchema,
          schema: VABenefitWarning.schema,
          depends: formData => !formData?.hasPreviouslyApplied,
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...personalInformationPage({
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
          depends: formData =>
            formData?.vaBenefitProgram === 'chapter35' &&
            !!formData.vaFileNumber,
        },
        ...profileContactInfoPages({
          contactInfoRequiredKeys: ['mailingAddress'],
          // disableMockContactInfo: true,
          // prefillPatternEnabled: true,
        }),
      },
    },
    testInformationChapter: {
      title: 'Test information',
      pages: {
        testNameAndDate: {
          path: 'test-name-and-date',
          title: 'Test name and date',
          uiSchema: TestNameAndDate.uiSchema,
          schema: TestNameAndDate.schema,
        },
        organizationInfo: {
          path: 'organization-info',
          title: 'Organization information',
          uiSchema: OrganizationInfo.uiSchema,
          schema: OrganizationInfo.schema,
        },
        testCost: {
          path: 'test-cost',
          title: 'Test cost',
          uiSchema: TestCost.uiSchema,
          schema: TestCost.schema,
        },
      },
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarksPage: {
          path: 'remarks',
          title: 'Remarks',
          uiSchema: Remarks.uiSchema,
          schema: Remarks.schema,
        },
      },
    },
    submissionInstructionsChapter: {
      title: 'Submission instructions',
      hideOnReviewPage: true,
      pages: {
        submissionInstructions: {
          path: 'submission-instructions',
          title: 'Submission instructions',
          uiSchema: SubmissionInstructions.uiSchema,
          schema: SubmissionInstructions.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
