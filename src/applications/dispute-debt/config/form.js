import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import environment from 'platform/utilities/environment';
import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import {
  veteranInformation,
  debtSelection,
  disputeReason,
  supportStatement,
} from '../pages';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import NeedHelp from '../components/NeedHelp';

import manifest from '../manifest.json';
import prefillTransformer from './prefill-transformer';
import submitForm from './submitForm';
import { TITLE, SUBTITLE } from '../constants';

// Function to return the NeedHelp component
const getHelp = () => <NeedHelp />;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/debts_api/v0/digital_disputes`,
  submit: submitForm,
  trackingPrefix: 'dispute-debt',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_DISPUTE_DEBT,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your digital dispute for debts application (DISPUTE-DEBT) is in progress.',
    //   expired: 'Your saved digital dispute for debts application (DISPUTE-DEBT) has expired. If you want to apply for digital dispute for debts, please start a new application.',
    //   saved: 'Your digital dispute for debts application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for digital dispute for debts.',
    noAuth:
      'Please sign in again to continue your application for digital dispute for debts.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
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
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo2',
          contactPath: 'contact-information',
          contactInfoRequiredKeys: ['mobilePhone', 'mailingAddress', 'email'],
          included: ['mobilePhone', 'mailingAddress', 'email'], // default
          wrapperKey: 'veteranInformation',
        }),
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
        },
      },
    },
    reasonForDisputeChapter: {
      title: 'Reason for dispute',
      pages: {
        disputeReason: {
          path: 'existence-or-amount/:index',
          title: 'Debt X of Y: Name of debt',
          uiSchema: disputeReason.uiSchema,
          schema: disputeReason.schema,
          showPagePerItem: true,
          arrayPath: 'selectedDebts',
        },
        supportStatement: {
          path: 'dispute-reason/:index',
          title: 'Debt X of Y: Name of debt',
          uiSchema: supportStatement.uiSchema,
          schema: supportStatement.schema,
          showPagePerItem: true,
          arrayPath: 'selectedDebts',
        },
      },
    },
  },
  getHelp,
  footerContent,
  ...minimalHeaderFormConfigOptions(),
};

export default formConfig;
