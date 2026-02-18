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
import { getArrayUrlSearchParams } from '~/platform/forms-system/src/js/patterns/array-builder/helpers';
import {
  careFrequencyLabels,
  recipientTypeLabels,
} from '../../../utils/labels';
import { transformDate } from './helpers';

const nounSingular = 'medical expense';
const nounPlural = 'medical expenses';

function ItemDescription(item) {
  const paymentDate = transformDate(item?.paymentDate);
  const frequency = careFrequencyLabels[(item?.paymentFrequency)];
  if (!paymentDate && !frequency) return null;
  return (
    <div>
      {paymentDate && (
        <span className="vads-u-display--block">{paymentDate}</span>
      )}
      {frequency && <span className="vads-u-display--block">{frequency}</span>}
    </div>
  );
}

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

function checkIsItemIncomplete(item) {
  return (
    !item?.recipient ||
    ((item.recipient === 'CHILD' || item.recipient === 'OTHER') &&
      !item?.fullNameRecipient) ||
    !item?.paymentDate ||
    !item?.purpose ||
    !item?.paymentFrequency ||
    !item?.paymentAmount
  );
}

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'medicalExpenses',
  nounSingular,
  nounPlural,
  required: false,
  isItemIncomplete: item => checkIsItemIncomplete(item),
  maxItems: 14,
  text: {
    getItemName: item => item?.provider || 'Provider',
    cardDescription: item => ItemDescription(item),
    cancelAddTitle: `Cancel adding this ${nounSingular}?`,
    cancelEditTitle: `Cancel editing this ${nounSingular}?`,
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription: `This will delete the information from your list of ${nounPlural}. You’ll return to a page where you can add a new ${nounSingular}.`,
    deleteNo: 'No, keep',
    deleteTitle: `Delete this ${nounSingular}?`,
    deleteYes: 'Yes, delete',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Medical recipient', () => {
      const search = getArrayUrlSearchParams();
      const isEdit = search.get('edit');
      if (isEdit) {
        return 'We’ll take you through each of the sections of this medical expense for you to review and edit.';
      }
      return null;
    }),
    recipient: radioUI({
      title: 'Who’s the expense for?',
      labels: recipientTypeLabels,
    }),
    fullNameRecipient: textUI({
      title: 'Full name of the person who received care',
      expandUnder: 'recipient',
      expandUnderCondition: field => field === 'CHILD' || field === 'OTHER',
      required: (formData, index, fullData) => {
        // Adding a check for formData and fullData since formData is sometimes undefined on load
        // and we can't rely on fullData for testing
        const medicalExpenses =
          formData?.medicalExpenses ?? fullData?.medicalExpenses;
        const medicalExpense = medicalExpenses?.[index];
        return ['CHILD', 'OTHER'].includes(medicalExpense?.recipient);
      },
    }),
    //
  },
  schema: {
    type: 'object',
    properties: {
      recipient: radioSchema(Object.keys(recipientTypeLabels)),
      fullNameRecipient: textSchema,
    },
    required: ['recipient'],
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
    paymentAmount: currencyUI({
      title: 'How much is each payment?',
      max: 999999.99,
    }),
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
