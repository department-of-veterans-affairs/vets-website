import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatDateLong } from 'platform/utilities/date';
import { trustTypeLabels } from '../../../labels';
import { TrustSupplementaryFormsAlert } from '../../../components/FormAlerts';

import {
  annualReceivedIncomeFromTrustRequired,
  formatCurrency,
  generateDeleteDescription,
  isDefined,
  monthlyMedicalReimbursementAmountRequired,
  requireExpandedArrayField,
  sharedYesNoOptionsBase,
  showUpdatedContent,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'trusts',
  nounSingular: 'trust',
  nounPlural: 'trusts',
  required: false,
  isItemIncomplete: item =>
    !isDefined(item?.establishedDate) ||
    !isDefined(item.marketValueAtEstablishment) ||
    !isDefined(item.trustType) ||
    typeof item.addedFundsAfterEstablishment !== 'boolean' ||
    typeof item.trustUsedForMedicalExpenses !== 'boolean' ||
    typeof item.trustEstablishedForVeteransChild !== 'boolean' ||
    typeof item.haveAuthorityOrControlOfTrust !== 'boolean', // include all required fields here
  text: {
    summaryTitle: 'Review trusts',
    summaryDescription: TrustSupplementaryFormsAlert,
    getItemName: item =>
      isDefined(item?.establishedDate) &&
      `Trust created on ${formatDateLong(item.establishedDate)}`,
    cardDescription: item =>
      isDefined(item?.marketValueAtEstablishment) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Type:{' '}
            <span className="vads-u-font-weight--bold">
              {trustTypeLabels[item.trustType]}
            </span>
          </li>
          <li>
            Fair market value when created:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.marketValueAtEstablishment)}
            </span>
          </li>
          <li>
            Yearly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.annualReceivedIncome)}
            </span>
          </li>
          <li>
            Money added to trust:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.addedFundsAmount)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another trust',
    alertItemUpdated: 'Your trust information has been updated',
    alertItemDeleted: 'Your trust information has been deleted',
    cancelAddTitle: 'Cancel adding this trust',
    cancelAddButtonText: 'Cancel adding this trust',
    cancelAddYes: 'Yes, cancel adding this trust',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this trust',
    cancelEditYes: 'Yes, cancel editing this trust',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this trust',
    deleteYes: 'Yes, delete this trust',
    deleteNo: 'No',
    deleteDescription: props =>
      generateDeleteDescription(props, options.text.getItemName),
  },
};

// We support multiple summary pages (one per claimant type).
// These constants centralize shared text so each summary page stays consistent.
// Important: only one summary page should ever be displayed at a time.

// Shared summary page text
const updatedTitleNoItems = 'Do you or your dependents have access to a trust?';
const updatedTitleWithItems = 'Do you have another trust to report?';
const summaryPageTitle = 'Trusts';
const yesNoOptionLabels = {
  Y: 'Yes, I have a trust to report',
  N: 'No, I don’t have a trust to report',
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingTrusts': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Have you or your dependents established a trust or do you or your dependents have access to a trust?',
        hint: 'If yes, you’ll need to report at least one trust',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more trusts to report?',
        ...sharedYesNoOptionsBase,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:TrustSupplementaryFormsAlert': {
        type: 'object',
        properties: {},
      },
      'view:isAddingTrusts': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingTrusts'],
  },
};

/** @returns {PageSchema} */
const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingTrusts': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

/** @returns {PageSchema} */
const spouseSummaryPage = {
  uiSchema: {
    'view:isAddingTrusts': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint: 'Your dependents include children who you financially support. ',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

/** @returns {PageSchema} */
const childSummaryPage = {
  uiSchema: {
    'view:isAddingTrusts': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint: null,
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

const parentSummaryPage = {
  uiSchema: {
    'view:isAddingTrusts': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

/** @returns {PageSchema} */
const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingTrusts': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and the Veteran’s children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

/** @returns {PageSchema} */
const informationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Trust establishment',
      nounSingular: options.nounSingular,
    }),
    establishedDate: currentOrPastDateUI('When was the trust established?'),
    marketValueAtEstablishment: currencyUI(
      'What was the market value of all assets within the trust at the time of establishment?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      establishedDate: currentOrPastDateSchema,
      marketValueAtEstablishment: currencySchema,
    },
    required: ['establishedDate', 'marketValueAtEstablishment'],
  },
};

/** @returns {PageSchema} */
const trustTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Type of trust'),
    trustType: radioUI({
      title: 'What is the type of trust established?',
      labels: trustTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      trustType: radioSchema(Object.keys(trustTypeLabels)),
    },
    required: ['trustType'],
  },
};

/** @returns {PageSchema} */
const incomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income from trust'),
    receivingIncomeFromTrust: yesNoUI(
      'Are you receiving income from the trust?',
    ),
    annualReceivedIncome: {
      ...currencyUI({
        title: 'How much is the annual amount received?',
        expandUnder: 'receivingIncomeFromTrust',
        expandUnderCondition: true,
      }),
      'ui:required': annualReceivedIncomeFromTrustRequired,
    },
    'ui:options': {
      ...requireExpandedArrayField('annualReceivedIncome'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      receivingIncomeFromTrust: yesNoSchema,
      annualReceivedIncome: currencySchema,
    },
    required: ['receivingIncomeFromTrust'],
  },
};

/** @returns {PageSchema} */
const medicalExpensePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Use of trust for medical expenses',
    ),
    trustUsedForMedicalExpenses: yesNoUI(
      'Is the trust being used to pay for or to reimburse someone else for your medical expenses?',
    ),
    monthlyMedicalReimbursementAmount: {
      ...currencyUI({
        title: 'How much is the amount being reimbursed monthly?',
        expandUnder: 'trustUsedForMedicalExpenses',
        expandUnderCondition: true,
      }),
      'ui:required': monthlyMedicalReimbursementAmountRequired,
    },
    'ui:options': {
      ...requireExpandedArrayField('monthlyMedicalReimbursementAmount'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      trustUsedForMedicalExpenses: yesNoSchema,
      monthlyMedicalReimbursementAmount: currencySchema,
    },
    required: ['trustUsedForMedicalExpenses'],
  },
};

/** @returns {PageSchema} */
const veteransChildPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust for child'),
    trustEstablishedForVeteransChild: yesNoUI(
      'Was the trust established for a child of the Veteran who was incapable of self-support prior to reaching age 18?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      trustEstablishedForVeteransChild: yesNoSchema,
    },
    required: ['trustEstablishedForVeteransChild'],
  },
};

/** @returns {PageSchema} */
const controlPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Control of trust'),
    haveAuthorityOrControlOfTrust: yesNoUI(
      'Do you have any additional authority or control of the trust?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      haveAuthorityOrControlOfTrust: yesNoSchema,
    },
    required: ['haveAuthorityOrControlOfTrust'],
  },
};

/** @returns {PageSchema} */
const hasAddedFundsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Funds added to trust'),
    addedFundsAfterEstablishment: yesNoUI(
      'Have you added funds to the trust after it was established?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      addedFundsAfterEstablishment: yesNoSchema,
    },
    required: ['addedFundsAfterEstablishment'],
  },
};

/** @returns {PageSchema} */
const addedFundsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Amount added to trust'),
    addedFundsDate: currentOrPastDateUI('When did you add funds?'),
    addedFundsAmount: currencyUI('How much did you add?'),
  },
  schema: {
    type: 'object',
    properties: {
      addedFundsDate: currentOrPastDateSchema,
      addedFundsAmount: currencySchema,
    },
    required: ['addedFundsDate', 'addedFundsAmount'],
  },
};

export const trustPages = arrayBuilderPages(options, pageBuilder => ({
  trustPagesVeteranSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'trusts-summary-veteran',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'VETERAN',
    uiSchema: veteranSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  trustPagesUpdatedSpouseSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'trusts-summary-spouse',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'SPOUSE',
    uiSchema: spouseSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  trustPagesUpdatedChildSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'trusts-summary-child',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CHILD',
    uiSchema: childSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  trustPagesUpdatedCustodianSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'trusts-summary-custodian',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  trustPagesUpdatedParentSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'trusts-summary-parent',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'PARENT',
    uiSchema: parentSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
  trustPagesSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'trusts-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  trustInformationPage: pageBuilder.itemPage({
    title: 'Trust information',
    path: 'trusts/:index/trust-information',
    uiSchema: informationPage.uiSchema,
    schema: informationPage.schema,
  }),
  trustTypePage: pageBuilder.itemPage({
    title: 'Trust type',
    path: 'trusts/:index/trust-type',
    uiSchema: trustTypePage.uiSchema,
    schema: trustTypePage.schema,
  }),
  trustIncomePage: pageBuilder.itemPage({
    title: 'Trust income',
    path: 'trusts/:index/trust-income',
    uiSchema: incomePage.uiSchema,
    schema: incomePage.schema,
  }),
  trustMedicalExpensePage: pageBuilder.itemPage({
    title: 'Trust medical expenses',
    path: 'trusts/:index/trust-medical-expenses',
    uiSchema: medicalExpensePage.uiSchema,
    schema: medicalExpensePage.schema,
  }),
  trustVeteransChildPage: pageBuilder.itemPage({
    title: 'Trust established for child',
    path: 'trusts/:index/trust-veterans-child',
    uiSchema: veteransChildPage.uiSchema,
    schema: veteransChildPage.schema,
  }),
  trustControlPage: pageBuilder.itemPage({
    title: 'Trust control',
    path: 'trusts/:index/trust-control',
    uiSchema: controlPage.uiSchema,
    schema: controlPage.schema,
  }),
  trustHasAddedFundsPage: pageBuilder.itemPage({
    title: 'Trust has added funds',
    path: 'trusts/:index/has-added-funds',
    uiSchema: hasAddedFundsPage.uiSchema,
    schema: hasAddedFundsPage.schema,
  }),
  trustAddedFundsPage: pageBuilder.itemPage({
    title: 'Trust added funds',
    path: 'trusts/:index/added-funds',
    depends: (formData, index) =>
      formData?.[options.arrayPath]?.[index]?.addedFundsAfterEstablishment,
    uiSchema: addedFundsPage.uiSchema,
    schema: addedFundsPage.schema,
  }),
}));
