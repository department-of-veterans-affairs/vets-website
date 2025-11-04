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
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  formatPossessiveString,
  generateDeleteDescription,
  isDefined,
  isIncomeTypeInfoIncomplete,
  isRecipientInfoIncomplete,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
  requireExpandedArrayField,
  resolveRecipientFullName,
  showUpdatedContent,
  sharedYesNoOptionsBase,
} from '../../../helpers';
import { incomeFrequencyLabels, relationshipLabels } from '../../../labels';
import { DiscontinuedIncomeSummaryDescription } from '../../../components/SummaryDescriptions';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'discontinuedIncomes',
  nounSingular: 'discontinued income',
  nounPlural: 'discontinued incomes',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    !isDefined(item.payer) ||
    isIncomeTypeInfoIncomplete(item) ||
    !isDefined(item.incomeFrequency) ||
    !isDefined(item.incomeLastReceivedDate) ||
    !isDefined(item.grossAnnualAmount), // include all required fields here
  text: {
    summaryTitle: 'Review  discontinued and irregular income',
    summaryTitleWithoutItems: showUpdatedContent()
      ? 'Discontinued and irregular income'
      : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? DiscontinuedIncomeSummaryDescription
      : null,
    getItemName: (item, index, formData) => {
      if (!isDefined(item?.recipientRelationship) || !isDefined(item?.payer)) {
        return undefined;
      }
      const fullName = resolveRecipientFullName(item, formData);
      const possessiveName = formatPossessiveString(fullName);
      return `${possessiveName} income from ${item.payer}`;
    },
    cardDescription: item =>
      isDefined(item?.grossAnnualAmount) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Income type:{' '}
            <span className="vads-u-font-weight--bold">{item.incomeType}</span>
          </li>
          <li>
            Gross annual amount:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.grossAnnualAmount)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another discontinued income',
    alertItemUpdated: 'Your discontinued income information has been updated',
    alertItemDeleted: 'Your discontinued income information has been deleted',
    cancelAddTitle: 'Cancel adding this discontinued income',
    cancelAddButtonText: 'Cancel adding this discontinued income',
    cancelAddYes: 'Yes, cancel adding this discontinued income',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this discontinued income',
    cancelEditYes: 'Yes, cancel editing this discontinued income',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this discontinued income',
    deleteYes: 'Yes, delete this discontinued income',
    deleteNo: 'No',
    deleteDescription: props =>
      generateDeleteDescription(props, options.text.getItemName),
  },
};

// We support multiple summary pages (one per claimant type).
// These constants centralize shared text so each summary page stays consistent.
// Important: only one summary page should ever be displayed at a time.

// Shared summary page text
const updatedTitleNoItems =
  'Have you or your dependents received income that has ended during the reporting period or in the last full calendar year (if this is your first claim)?';
const updatedTitleWithItems = 'Do you have more discontinued income to report?';
const summaryPageTitle = 'Discontinued and irregular income';
const yesNoOptionLabels = {
  Y: 'Yes, I have income to report',
  N: 'No, I don’t have income to report',
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Did you or your dependents receive income that has stopped or is no longer being received within the last calendar year?',
        hint: 'If yes, you’ll need to report at least one income',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more discontinued incomes to report?',
        ...sharedYesNoOptionsBase,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingDiscontinuedIncomes'],
  },
};

const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
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

const spouseSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint: 'Your dependents include children who you financially support.',
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

const childSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Have you received income that has ended during the reporting period or in the last full calendar year (if this is your first claim)?',
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

const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
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

const parentSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
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
const relationshipPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Discontinued income relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who received the income?',
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Describe their relationship to the Veteran',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'recipientRelationship',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        otherRecipientRelationshipExplanationRequired(
          formData,
          index,
          'discontinuedIncomes',
        ),
    },
    'ui:options': {
      ...requireExpandedArrayField('otherRecipientRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(Object.keys(relationshipLabels)),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const recipientNamePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Discontinued income recipient name',
    ),
    recipientName: fullNameNoSuffixUI(title => `Income recipient’s ${title}`),
  },
  schema: {
    type: 'object',
    properties: {
      recipientName: fullNameNoSuffixSchema,
    },
  },
};

/** @returns {PageSchema} */
const incomePayerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income payer'),
    payer: textUI({
      title: 'Income payer name',
      hint: 'Name of business, financial institution, etc.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      payer: textSchema,
    },
    required: ['payer'],
  },
};

/** @returns {PageSchema} */
const incomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income type'),
    incomeType: textUI({
      title: 'What is the type of income received?',
      hint: 'Interest, dividends, etc',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeType: textSchema,
    },
    required: ['incomeType'],
  },
};

/** @returns {PageSchema} */
const incomeFrequencyPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income frequency'),
    incomeFrequency: radioUI({
      title: 'How often was this income received?',
      labels: incomeFrequencyLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeFrequency: radioSchema(Object.keys(incomeFrequencyLabels)),
    },
    required: ['incomeFrequency'],
  },
};

/** @returns {PageSchema} */
const incomeDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income date'),
    incomeLastReceivedDate: currentOrPastDateUI(
      'When was this income last paid?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      incomeLastReceivedDate: currentOrPastDateSchema,
    },
    required: ['incomeLastReceivedDate'],
  },
};

/** @returns {PageSchema} */
const incomeAmountPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income amount'),
    grossAnnualAmount: currencyUI(
      'What was the gross annual amount reported to the IRS?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      grossAnnualAmount: currencySchema,
    },
    required: ['grossAnnualAmount'],
  },
};

export const discontinuedIncomePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    discontinuedIncomePagesVeteranSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-incomes-summary-veteran',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesSpouseSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-incomes-summary-spouse',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesChildSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-incomes-summary-child',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: childSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesCustodianSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-incomes-summary-custodian',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesParentSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-incomes-summary-parent',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
    discontinuedIncomePagesSummary: pageBuilder.summaryPage({
      title: 'Discontinued incomes',
      path: 'discontinued-incomes-summary',
      depends: () => !showUpdatedContent(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomeRelationshipPage: pageBuilder.itemPage({
      title: 'Discontinued income relationship',
      path: 'discontinued-incomes/:index/relationship',
      uiSchema: relationshipPage.uiSchema,
      schema: relationshipPage.schema,
    }),
    discontinuedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: 'Discontinued income recipient name',
      path: 'discontinued-incomes/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'discontinuedIncomes'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    discontinuedIncomePayerPage: pageBuilder.itemPage({
      title: 'Discontinued income payer',
      path: 'discontinued-incomes/:index/payer',
      uiSchema: incomePayerPage.uiSchema,
      schema: incomePayerPage.schema,
    }),
    discontinuedIncomeTypePage: pageBuilder.itemPage({
      title: 'Discontinued income type',
      path: 'discontinued-incomes/:index/type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
    discontinuedIncomeFrequencyPage: pageBuilder.itemPage({
      title: 'Discontinued income frequency',
      path: 'discontinued-incomes/:index/frequency',
      uiSchema: incomeFrequencyPage.uiSchema,
      schema: incomeFrequencyPage.schema,
    }),
    discontinuedIncomeDatePage: pageBuilder.itemPage({
      title: 'Discontinued income date',
      path: 'discontinued-incomes/:index/date',
      uiSchema: incomeDatePage.uiSchema,
      schema: incomeDatePage.schema,
    }),
    discontinuedIncomeAmountPage: pageBuilder.itemPage({
      title: 'Discontinued income amount',
      path: 'discontinued-incomes/:index/amount',
      uiSchema: incomeAmountPage.uiSchema,
      schema: incomeAmountPage.schema,
    }),
  }),
);
