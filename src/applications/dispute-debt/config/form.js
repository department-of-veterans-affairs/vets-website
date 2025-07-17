import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import {
  veteranInformation,
  debtSelection,
  disputeReason,
  supportStatement,
} from '../pages';

import contactInfo from './contactInfo';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import NeedHelp from '../components/NeedHelp';
import DebtReviewPage from '../components/DebtReviewPage';
import DebtSelectionReview from '../components/DebtSelectionReview';

import manifest from '../manifest.json';
// import prefillTransformer from './prefill-transformer';
import submitForm from './submitForm';
import { TITLE } from '../constants';
import transformForSubmit from './transformForSubmit';
import { getDebtPageTitle, focusH3 } from '../utils';

// Function to return the NeedHelp component
const getHelp = () => <NeedHelp />;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  transformForSubmit,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/debts_api/v0/digital_disputes`,
  submit: submitForm,
  trackingPrefix: 'dispute-debt',
  useCustomScrollAndFocus: true,
  scrollAndFocusTarget: focusH3, // scroll and focus fallback
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: false,
    collapsibleNavLinks: false,
  },
  formId: VA_FORM_IDS.FORM_DISPUTE_DEBT,
  saveInProgress: {
    messages: {
      inProgress: 'Your application for disputing your VA debt is in progress.',
      expired:
        'Your saved application for disputing your VA debt has expired. If you want to apply again, please start a new application.',
      saved: 'Your application for disputing your VA debt has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  // prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start your application over to dispute your VA debt.',
    noAuth:
      'Please sign in again to continue your application to dispute your VA debt.',
  },
  customText: {
    reviewTitle: 'Review and submit',
  },
  title: TITLE,
  downtime: {
    dependencies: [
      externalServices.mvi,
      externalServices.vbs,
      externalServices.dmc,
      externalServices.vaProfile,
    ],
  },
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Veteran information',
      pages: {
        veteranInformation: {
          title: 'Your personal information',
          path: 'personal-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        ...contactInfo,
      },
    },
    debtSelectionChapter: {
      title: 'Debt Selection',
      pages: {
        selectDebt: {
          path: 'select-debt',
          title: 'Which debt are you disputing?',
          uiSchema: debtSelection.uiSchema,
          schema: debtSelection.schema,
          initialData: {
            selectedDebts: [],
          },
          CustomPageReview: DebtSelectionReview,
        },
      },
    },
    reasonForDisputeChapter: {
      title: 'Reason for dispute',
      pages: {
        disputeReason: {
          path: 'existence-or-amount/:index',
          title: getDebtPageTitle,
          uiSchema: disputeReason.uiSchema,
          schema: disputeReason.schema,
          showPagePerItem: true,
          arrayPath: 'selectedDebts',
          CustomPageReview: DebtReviewPage,
        },
        supportStatement: {
          path: 'dispute-reason/:index',
          title: getDebtPageTitle,
          uiSchema: supportStatement.uiSchema,
          schema: supportStatement.schema,
          showPagePerItem: true,
          arrayPath: 'selectedDebts',
          CustomPageReview: DebtReviewPage,
        },
        chapterPlaceholder: {
          // This is in place for the depends to auto increment the chapter count to match veteran expectations
          // it does NOT render but MUST be here
          path: 'chapter-placeholder',
          title: 'Chapter placeholder',
          depends: formData => {
            return !formData?.selectedDebts?.length > 0;
          },
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
  getHelp,
  footerContent,
};

export default formConfig;
