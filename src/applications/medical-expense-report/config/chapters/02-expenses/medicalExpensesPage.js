import React from 'react';
import {
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
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
        We’ll now ask about medical or certain other expenses that aren’t
        reimbursed. These types of expenses can include:
      </p>
      <ul>
        <li>Recurring medical expenses that insurance doesn’t cover</li>
        <li>
          One-time medical expenses that insurance doesn’t cover that occurred
          after you started this form or after you submitted an Intent to File
        </li>
      </ul>
    </div>
  );
}

/** @type {ArrayBuilderOptions} */
export const options = {
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
      title: 'Medical expenses',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Medical recipient'),
    recipient: radioUI({
      title: 'Who’s the expense for?',
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
    //
  },
  schema: {
    type: 'object',
    properties: {
      recipient: radioSchema(Object.keys(recipientTypeLabels)),
      recipientName: textSchema,
    },
    required: ['recipient', 'recipientName'],
  },
};

/** @returns {PageSchema} */
const purposePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Expense recipient and purpose'),
    provider: textUI({
      title: 'Who receives the payment?',
      hint: 'For example: provider’s name or insurance company',
    }),
    purpose: textUI({
      title: 'What is the payment for?',
      hint: 'For example: insurance premium or medical supplies',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      provider: textSchema,
      purpose: textSchema,
    },
    required: ['provider', 'purpose'],
  },
};

/** @returns {PageSchema} */
const frequencyPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Frequency and cost of care'),
    paymentDate: currentOrPastDateUI({
      title: 'When did you start making this payment?',
      monthSelect: false,
    }),
    paymentFrequency: radioUI({
      title: 'How often do you make this payment?',
      labels: careFrequencyLabels,
    }),
    paymentAmount: currencyUI('How much is each payment?'),
  },
  schema: {
    type: 'object',
    properties: {
      paymentDate: currentOrPastDateSchema,
      paymentFrequency: radioSchema(Object.keys(careFrequencyLabels)),
      paymentAmount: currencySchema,
    },
    required: ['paymentDate', 'paymentFrequency', 'paymentAmount'],
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
    title: 'Medical recipient',
    path: 'expenses/medical/:index/recipient',
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  medicalExpensesPurposePage: pageBuilder.itemPage({
    title: 'Expense recipient and purpose',
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
