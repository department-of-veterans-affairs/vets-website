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
  generateDeleteDescription,
  isDefined,
  isIncomeTypeInfoIncomplete,
  isRecipientInfoIncomplete,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
  resolveRecipientFullName,
} from '../../../helpers';
import { incomeFrequencyLabels, relationshipLabels } from '../../../labels';

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
    getItemName: (item, index, formData) => {
      if (!isDefined(item?.recipientRelationship) || !isDefined(item?.payer)) {
        return undefined;
      }
      const fullName = resolveRecipientFullName(item, formData);
      return `${fullName}’s income from ${item.payer}`;
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
        labels: {
          Y: 'Yes',
          N: 'No',
        },
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
      },
      'ui:required': (formData, index) =>
        otherRecipientRelationshipExplanationRequired(
          formData,
          index,
          'discontinuedIncomes',
        ),
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
    discontinuedIncomePagesSummary: pageBuilder.summaryPage({
      title: 'Discontinued incomes',
      path: 'discontinued-incomes-summary',
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
