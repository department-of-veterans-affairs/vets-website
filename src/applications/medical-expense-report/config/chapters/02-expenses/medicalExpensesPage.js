import React from 'react';
import {
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  checkboxUI,
  radioSchema,
  textUI,
  textSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  careFrequencyLabels,
  recipientTypeLabels,
} from '../../../utils/labels';
import { transformDate } from './helpers';

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        In the next few questions, we’ll ask you about medical or other expenses
        that aren't reimbursed. You’ll need to add at least one medical or other
        expense.
      </p>
      <va-additional-info trigger="How to report monthly recurring expenses">
        <p>
          For recurring monthly expenses, report them as a single expense.
          Include the start date and the monthly or annual cost.
        </p>
        <p>
          If a recurring expense has ended, treat the expense as non-recurring.
          Non-recurring expenses must be reported individually as separate
          expenses.
        </p>
        <p>Prescription medications are generally not considered recurring.</p>
      </va-additional-info>
    </div>
  );
}

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'medicalExpenses',
  nounSingular: 'medical expense',
  nounPlural: 'medical expenses',
  required: false,
  isItemIncomplete: item => !item?.recipient || !item?.paymentDate,
  maxItems: 5,
  text: {
    getItemName: item => item?.provider || 'Provider',
    cardDescription: item => transformDate(item?.paymentDate) || '',
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add medical expenses',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    'ui:description': introDescription,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:medicalExpensesList': arrayBuilderYesNoUI(
      options,
      { hint: '' },
      { hint: '' },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicalExpensesList': arrayBuilderYesNoSchema,
    },
    required: ['view:medicalExpensesList'],
  },
};

/** @returns {PageSchema} */
const recipientPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Medical recipient and provider name',
    ),
    recipient: radioUI({
      title: 'Who is the expense for?',
      labels: recipientTypeLabels,
    }),
    recipientName: textUI({
      title: 'Full name of the person who received care',
      expandUnder: 'recipient',
      expandUnderCondition: field => field === 'DEPENDENT' || field === 'OTHER',
      required: (formData, index, fullData) => {
        // Adding a check for formData and fullData since formData is sometimes undefined on load
        // and we can't rely on fullData for testing
        const medicalExpenses =
          formData?.medicalExpenses ?? fullData?.medicalExpenses;
        const medicalExpense = medicalExpenses?.[index];
        return ['DEPENDENT', 'OTHER'].includes(medicalExpense?.recipient);
      },
    }),
    provider: textUI('Who receives the payment?'),
  },
  schema: {
    type: 'object',
    properties: {
      recipient: radioSchema(Object.keys(recipientTypeLabels)),
      recipientName: textSchema,
      provider: textSchema,
    },
    required: ['recipient', 'recipientName', 'provider'],
  },
};
/** @returns {PageSchema} */
const purposePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Expense purpose and date'),
    purpose: textUI('What is the payment for?'),
    paymentDate: currentOrPastDateUI({
      title: 'What’s the date of the payment?',
      monthSelect: false,
    }),
    noEndDate: checkboxUI('No end date'),
  },
  schema: {
    type: 'object',
    properties: {
      purpose: textSchema,
      paymentDate: currentOrPastDateSchema,
    },
    required: ['purpose', 'paymentDate'],
  },
};

/** @returns {PageSchema} */
const frequencyPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Frequency and cost of care'),
    paymentFrequency: radioUI({
      title: 'How often are the payments?',
      labels: careFrequencyLabels,
    }),
    paymentAmount: currencyUI('How much is each payment?'),
  },
  schema: {
    type: 'object',
    properties: {
      paymentFrequency: radioSchema(Object.keys(careFrequencyLabels)),
      paymentAmount: currencySchema,
    },
    required: ['paymentFrequency', 'paymentAmount'],
  },
};

export const medicalExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  medicalExpensesIntro: pageBuilder.introPage({
    title: 'Medical expenses',
    path: 'expenses/medical',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  medicalExpensesSummary: pageBuilder.summaryPage({
    title: 'Medical expenses',
    path: 'expenses/medical/add',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  medicalExpensesRecipientPage: pageBuilder.itemPage({
    title: 'Medical recipient and provider',
    path: 'expenses/medical/:index/recipient-provider',
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  medicalExpensesPurposePage: pageBuilder.itemPage({
    title: 'Expense purpose and date',
    path: 'expenses/medical/:index/purpose',
    uiSchema: purposePage.uiSchema,
    schema: purposePage.schema,
  }),
  medicalExpensesFrequencyPage: pageBuilder.itemPage({
    title: 'Frequency and cost of care',
    path: 'expenses/medical/:index/frequency',
    uiSchema: frequencyPage.uiSchema,
    schema: frequencyPage.schema,
  }),
}));
