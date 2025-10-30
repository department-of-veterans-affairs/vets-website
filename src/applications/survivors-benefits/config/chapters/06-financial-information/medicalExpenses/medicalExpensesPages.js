import React from 'react';
import {
  textUI,
  textSchema,
  radioUI,
  radioSchema,
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { recipientTypeLabels, frequencyLabels } from '../../../../utils/labels';

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        We’ll now ask about medical or certain other expenses that aren’t
        reimbursed.
      </p>
      <p>These types of expenses can include:</p>
      <ul>
        <li>
          <span className="vads-u-font-weight--bold">
            Recurring medical expenses{' '}
          </span>
          that insurance doesn’t cover
        </li>
        <li>
          <span className="vads-u-font-weight--bold">
            One-time medical expenses{' '}
          </span>
          that insurance doesn’t cover that occurred after you started this form
          or after you submitted an Intent to File
        </li>
      </ul>

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
  maxItems: 5,
  isItemIncomplete: item =>
    !item?.recipient ||
    (['VETERANS_CHILD', 'OTHER'].includes(item?.recipient) &&
      !item?.recipientName) ||
    !item?.purpose ||
    !item?.paymentDate ||
    !item?.frequency ||
    !item?.amount,
  text: {
    getItemName: item => item?.purpose || 'Medical expense',
    cardDescription: () => 'Date',
    summaryTitle: () => 'Review your medical and other expenses',
    yesNoBlankReviewQuestion: () =>
      'Do you have another medical or other expense to add?',
  },
};

const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Medical and other expenses',
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
      title: 'Full name of the person who the expense is for',
      expandUnder: 'recipient',
      expandUnderCondition: field =>
        field === 'VETERANS_CHILD' || field === 'OTHER',
      required: (formData, index, fullData) => {
        const items = formData?.medicalExpenses ?? fullData?.medicalExpenses;
        const item = items?.[index];
        return ['VETERANS_CHILD', 'OTHER'].includes(item?.recipient);
      },
    }),
    paymentRecipient: textUI({
      title: 'Who receives the payment?',
      'ui:required': true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recipient: radioSchema(Object.keys(recipientTypeLabels)),
      recipientName: textSchema,
      paymentRecipient: textSchema,
    },
    required: ['recipient', 'paymentRecipient'],
  },
};

const purposeDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Expense purpose and date'),
    purpose: textUI({
      title: 'What’s the payment for?',
    }),
    paymentDate: currentOrPastDateUI({
      title: 'What’s the date of the payment?',
      monthSelect: false,
    }),
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

const frequencyCostPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Frequency and cost of care'),
    frequency: radioUI({
      title: 'How often are the payments?',
      labels: frequencyLabels,
    }),
    amount: currencyUI('How much is each payment?'),
  },
  schema: {
    type: 'object',
    properties: {
      frequency: radioSchema(Object.keys(frequencyLabels)),
      amount: currencySchema,
    },
    required: ['frequency', 'amount'],
  },
};

export const medicalExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  medicalExpensesIntro: pageBuilder.introPage({
    title: 'Medical and other expenses',
    path: 'financial-information/medical-expenses',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  medicalExpensesSummary: pageBuilder.summaryPage({
    title: 'Medical and other expenses',
    path: 'financial-information/medical-expenses/add',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  medicalRecipientPage: pageBuilder.itemPage({
    title: 'Medical recipient and provider name',
    path: 'financial-information/medical-expenses/:index/recipient-provider',
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  medicalPurposeDatePage: pageBuilder.itemPage({
    title: 'Expense purpose and date',
    path: 'financial-information/medical-expenses/:index/purpose-date',
    uiSchema: purposeDatePage.uiSchema,
    schema: purposeDatePage.schema,
  }),
  medicalFrequencyCostPage: pageBuilder.itemPage({
    title: 'Frequency and cost of care',
    path: 'financial-information/medical-expenses/:index/frequency-cost',
    uiSchema: frequencyCostPage.uiSchema,
    schema: frequencyCostPage.schema,
  }),
}));

export default medicalExpensesPages;
