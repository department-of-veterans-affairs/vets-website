import React from 'react';
import {
  textUI,
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
import {
  medicalExpenseRecipientLabels,
  frequencyLabels,
} from '../../../../utils/labels';
import { transformDate } from '../../05-claim-information/helpers';
import { customTextSchema } from '../../../definitions';

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        We’ll now ask about medical or certain other expenses that aren’t
        reimbursed. You may add up to 6 medical, last, burial, or other
        expenses.
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
        <li>
          <span className="vads-u-font-weight--bold">
            Last or burial expenses{' '}
          </span>
          that you paid for the last illness and burial of a spouse or child
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
export const options = {
  arrayPath: 'medicalExpenses',
  nounSingular: 'medical expense',
  nounPlural: 'medical expenses',
  required: false,
  maxItems: 6,
  isItemIncomplete: item =>
    !item?.recipient ||
    (['CHILD'].includes(item?.recipient) && !item?.childName) ||
    !item?.purpose ||
    !item?.paymentDate ||
    !item?.paymentFrequency ||
    !item?.paymentAmount,
  text: {
    cancelAddTitle: 'Cancel adding this medical expense?',
    cancelEditTitle: 'Cancel editing this medical expense?',
    cancelAddDescription:
      'If you cancel, we won’t add this medical expense to your list of expenses. You’ll return to a page where you can add a new medical expense.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this expense and you will be returned to the medical expenses review page.',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription:
      'This will delete the information from your list of medical expenses. You’ll return to a page where you can add a new medical expense.',
    deleteNeedAtLeastOneDescription: '',
    deleteNo: 'No, keep',
    deleteTitle: 'Delete this medical expense?',
    deleteYes: 'Yes, delete',
    alertMaxItems: (
      <div>
        <p className="vads-u-margin-top--0">
          You have added the maximum number of allowed medical, last, burial,
          and other expenses for this application. Additional medical expenses
          added using VA Form 21P-8416 and uploaded at the end of this
          application.
        </p>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-8416"
          external
          text="Get VA Form 21P-8416 to download"
        />
      </div>
    ),
    getItemName: item => item?.paymentRecipient || 'Medical expense',
    cardDescription: item => (
      <div>
        <span className="vads-u-display--block">
          {transformDate(item?.paymentDate) || 'Date not provided'}
        </span>
        <span className="vads-u-display--block">
          {frequencyLabels[(item?.paymentFrequency)] ||
            'Frequency not provided'}
        </span>
      </div>
    ),
    summaryTitle: 'Review your medical, last, burial, and other expenses',
  },
};

const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Medical, last, burial, and other expenses',
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
      {
        title: 'Do you have a medical, last, burial, or other expense to add?',
        hint: '',
      },
      {
        title:
          'Do you have another medical, last, burial, or other expense to add?',
        hint: '',
      },
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
      'Expense recipient and provider name',
    ),
    recipient: radioUI({
      title: 'Who is the expense for?',
      labels: medicalExpenseRecipientLabels,
    }),
    childName: textUI({
      title: 'Full name of the person who the expense is for',
      expandUnder: 'recipient',
      expandUnderCondition: field => field === 'CHILD',
      required: (formData, index, fullData) => {
        const items = formData?.medicalExpenses ?? fullData?.medicalExpenses;
        const item = items?.[index];
        return ['CHILD'].includes(item?.recipient);
      },
    }),
    provider: textUI({
      title: 'Who receives the payment?',
      hint: 'For example: provider’s name or insurance company',
      'ui:required': true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recipient: radioSchema(Object.keys(medicalExpenseRecipientLabels)),
      childName: customTextSchema,
      provider: customTextSchema,
    },
    required: ['recipient', 'provider'],
  },
};

const purposeDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Expense purpose and date'),
    purpose: textUI({
      title: 'What’s the payment for?',
      hint: 'For example: insurance premium or medical supplies',
    }),
    paymentDate: currentOrPastDateUI({
      title: 'What’s the date of the payment?',
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      purpose: customTextSchema,
      paymentDate: currentOrPastDateSchema,
    },
    required: ['purpose', 'paymentDate'],
  },
};

const frequencyCostPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Frequency and cost of care'),
    paymentFrequency: radioUI({
      title: 'How often are the payments?',
      labels: frequencyLabels,
    }),
    paymentAmount: currencyUI({
      title: 'How much is each payment?',
      max: 999999999.0,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      paymentFrequency: radioSchema(Object.keys(frequencyLabels)),
      paymentAmount: currencySchema,
    },
    required: ['paymentFrequency', 'paymentAmount'],
  },
};

export const medicalExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  medicalExpensesIntro: pageBuilder.introPage({
    title: 'Medical, last, burial, and other expenses',
    path: 'financial-information/medical-expenses',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  medicalExpensesSummary: pageBuilder.summaryPage({
    title: 'Medical, last, burial, and other expenses',
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
