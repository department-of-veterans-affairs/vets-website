import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
  currencyUI,
  currencySchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { focusElement } from 'platform/utilities/ui/focus';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'expenses',
  nounSingular: 'expense',
  nounPlural: 'expenses',
  required: false,
  isItemIncomplete: item =>
    !item?.provider || !item?.expenseType || !item?.amount,
  maxItems: 4,
  text: {
    getItemName: item => item?.provider || 'Unknown provider',
    cardDescription: item => {
      const type = item?.expenseType || 'Not specified';
      const amount = item?.amount
        ? `$${parseFloat(item.amount).toFixed(2)}`
        : '$0.00';
      return `${type} - ${amount}`;
    },
  },
};

const yesNoOptions = {
  title: 'Do you have an expense to add?',
  hint: `You can add up to ${options.maxItems}`,
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    ...titleUI('Expenses you paid'),
    'view:hasExpenses': arrayBuilderYesNoUI(options, yesNoOptions),
    'view:expenseInfo': {
      'ui:description': (
        <va-alert status="info" uswds>
          <h3 slot="headline">
            You can only request reimbursement for expenses you’ve already paid.
          </h3>
          <p>If you have unpaid bills, you’ll need to use the paper form.</p>
          <p>
            <va-link
              href="https://www.va.gov/find-forms/about-form-21p-601/"
              external
              rel="noopener noreferrer"
              text="Download VA Form 21P-601 (PDF)"
            />
          </p>
        </va-alert>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:expenseInfo': {
        type: 'object',
        properties: {},
      },
      'view:hasExpenses': arrayBuilderYesNoSchema,
    },
    required: ['view:hasExpenses'],
  },
};

/** @returns {PageSchema} */
const expenseDetailsPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Expense details',
      nounSingular: options.nounSingular,
    }),
    provider: textUI('Provider or funeral home name'),
    expenseType: textUI({
      title: 'Type of expense',
      hint: 'For example: doctor, hospital, burial, funeral service.',
    }),
    amount: currencyUI({
      title: 'Cost of the expense',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      provider: textSchema,
      expenseType: textSchema,
      amount: currencySchema,
    },
    required: ['provider', 'expenseType', 'amount'],
  },
};

/** @returns {PageSchema} */
const expensePaidByPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      const provider = formData?.provider;
      return provider ? `Who paid ${provider}?` : 'Who paid this expense?';
    }),
    paidBy: textUI({
      title: 'Who paid this expense?',
      hint:
        'For example: the estate or another family member. Leave blank if you paid.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      paidBy: textSchema,
    },
  },
};

export const expensesPages = arrayBuilderPages(options, pageBuilder => ({
  expensesSummary: pageBuilder.summaryPage({
    title: 'Expenses you paid',
    path: 'expenses-list',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    scrollAndFocusTarget: () => focusElement('h3'),
  }),
  expenseDetailsPage: pageBuilder.itemPage({
    title: 'Expense details',
    path: 'expenses-list/:index/details',
    uiSchema: expenseDetailsPage.uiSchema,
    schema: expenseDetailsPage.schema,
  }),
  expensePaidByPage: pageBuilder.itemPage({
    title: 'Who paid this expense',
    path: 'expenses-list/:index/paid-by',
    uiSchema: expensePaidByPage.uiSchema,
    schema: expensePaidByPage.schema,
  }),
}));

// Export for testing
export const expensesOptions = options;
