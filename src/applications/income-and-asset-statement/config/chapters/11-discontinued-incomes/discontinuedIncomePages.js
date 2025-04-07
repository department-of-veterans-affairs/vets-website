import React from 'react';
import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
} from '../../../helpers';
import { incomeFrequencyLabels, relationshipLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'discontinuedIncomes',
  nounSingular: 'discontinued income',
  nounPlural: 'discontinued incomes',
  required: false,
  isItemIncomplete: item =>
    !item?.recipientRelationship ||
    !item.payer ||
    !item.incomeType ||
    !item.incomeFrequency ||
    !item.incomeLastReceivedDate ||
    !item.grossAnnualAmount, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: () => 'Discontinued income',
    cardDescription: item =>
      item?.grossAnnualAmount && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Income relationship:{' '}
            <span className="vads-u-font-weight--bold">
              {relationshipLabels[item.recipientRelationship]}
            </span>
          </li>
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
    alertMaxItems:
      'You have added the maximum number of allowed discontinued incomes for this application. You may edit or delete an discontinued income or choose to continue the application.',
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
        labels: {
          Y: 'Yes, I have a discontinued income to report',
          N: 'No, I don’t have any discontinued incomes to report',
        },
      },
      {
        title: 'Do you have any more discontinued incomes to report?',
        labels: {
          Y: 'Yes, I have another discontinued income to report',
          N: 'No, I don’t have anymore discontinued incomes to report',
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
      title: 'What is the income recipient’s relationship to the Veteran?',
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Tell us the type of relationship',
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
    recipientName: textUI({
      title: 'Tell us the income recipient’s name',
      hint: 'Only needed if child, parent, custodian of child, or other',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recipientName: textSchema,
    },
    required: ['recipientName'],
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
      title: 'What is the frequency of the income received?',
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
      'When was the income last paid?',
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
    grossAnnualAmount: merge(
      {},
      currencyUI('What was the gross annual amount reported to the IRS?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      grossAnnualAmount: { type: 'number' },
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
