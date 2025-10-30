import React from 'react';
import {
  currencyUI,
  currencySchema,
  radioUI,
  checkboxUI,
  radioSchema,
  checkboxSchema,
  textUI,
  textSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { recipientTypeLabels, careTypeLabels } from '../../../../utils/labels';

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        Next we’ll ask you about unreimbursed recurring care expenses that you
        or your dependents pay for. You may add up to 3 care expenses.
      </p>
      <p>
        Examples of unreimbursed care expenses include payments to in-home care
        providers, nursing homes, or other care facilities that insurance won’t
        cover.
      </p>

      <va-additional-info trigger="Additional documents we may ask for">
        <p>
          If you’re reporting in-home care, nursing home, or other care facility
          expenses, you may need to submit proof for these expenses with your
          form.
        </p>
        <p>
          You may also need to submit 1 or more of these VA forms signed by a
          provider:
        </p>
        <ul>
          <li>
            Worksheet for a Residential Care, Adult Daycare, or Similar Facility
            from VA Form 21P-8416
          </li>
          <li>Worksheet for In-Home Attendant from VA Form 21P-8416</li>
          <li>
            Request for Nursing Home Information in Connection with Claim for
            Aid and Attendance (VA Form 21-0779)
          </li>
          <li>
            Examination for Housebound Status or Permanent Need for Regular Aid
            and Attendance form (VA Form 21-2680)
          </li>
        </ul>
        <p>We’ll ask you to upload these documents at the end of this form.</p>
      </va-additional-info>
    </div>
  );
}

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'careExpenses',
  nounSingular: 'care expense',
  nounPlural: 'care expenses',
  required: false,
  maxItems: 3,
  isItemIncomplete: item =>
    !item?.typeOfCare ||
    !item?.recipient ||
    !item?.provider ||
    !item?.careDate?.from ||
    !item?.paymentAmount,
  text: {
    getItemName: item => careTypeLabels[(item?.typeOfCare)] || 'Care expense',
    cardDescription: () => 'Payment amount',
    summaryTitle: () => 'Review your care expenses',
    yesNoBlankReviewQuestion: () => 'Do you have another care expense to add?',
  },
};

const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Care expenses',
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
    'view:careExpensesList': arrayBuilderYesNoUI(
      options,
      { hint: '' },
      { hint: '' },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:careExpensesList': arrayBuilderYesNoSchema,
    },
    required: ['view:careExpensesList'],
  },
};

const typeOfCarePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Type of care'),
    typeOfCare: radioUI({
      title: 'Select the type of care.',
      labels: careTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      typeOfCare: radioSchema(Object.keys(careTypeLabels)),
    },
    required: ['typeOfCare'],
  },
};

const recipientPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Care recipient and provider name',
    ),
    recipient: radioUI({
      title: 'Who is the expense for?',
      labels: recipientTypeLabels,
    }),
    recipientName: textUI({
      title: 'Full name of the person who received care',
      expandUnder: 'recipient',
      expandUnderCondition: field => field === 'OTHER',
      required: (formData, index, fullData) => {
        const items = formData?.careExpenses ?? fullData?.careExpenses;
        const item = items?.[index];
        return item?.recipient === 'OTHER';
      },
    }),
    provider: textUI('What’s the name of the care provider?'),
  },
  schema: {
    type: 'object',
    properties: {
      recipient: radioSchema(Object.keys(recipientTypeLabels)),
      recipientName: textSchema,
      provider: textSchema,
    },
    required: ['recipient', 'provider'],
  },
};

const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Dates of care'),
    careDate: currentOrPastDateRangeUI(
      {
        title: 'Care start date',
        monthSelect: false,
      },
      {
        title: 'Care end date',
        monthSelect: false,
      },
    ),
    noEndDate: checkboxUI('No end date'),
  },
  schema: {
    type: 'object',
    properties: {
      careDate: {
        ...currentOrPastDateRangeSchema,
        required: ['from'],
      },
      noEndDate: checkboxSchema,
    },
  },
};

const costPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Cost of care'),
    paymentAmount: currencyUI('How much is each payment?'),
  },
  schema: {
    type: 'object',
    properties: {
      paymentAmount: currencySchema,
    },
    required: ['paymentAmount'],
  },
};

export const careExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  careExpensesIntro: pageBuilder.introPage({
    title: 'Care expenses',
    path: 'financial-information/care-expenses',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  careExpensesSummary: pageBuilder.summaryPage({
    title: 'Care expenses',
    path: 'financial-information/care-expenses/add',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  careTypePage: pageBuilder.itemPage({
    title: 'Type of care',
    path: 'financial-information/care-expenses/:index/type-of-care',
    uiSchema: typeOfCarePage.uiSchema,
    schema: typeOfCarePage.schema,
  }),
  careRecipientPage: pageBuilder.itemPage({
    title: 'Care recipient and provider name',
    path: 'financial-information/care-expenses/:index/recipient-provider',
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  careDatesPage: pageBuilder.itemPage({
    title: 'Dates of care',
    path: 'financial-information/care-expenses/:index/dates',
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
  }),
  careCostPage: pageBuilder.itemPage({
    title: 'Cost of care',
    path: 'financial-information/care-expenses/:index/cost',
    uiSchema: costPage.uiSchema,
    schema: costPage.schema,
  }),
}));

export default careExpensesPages;
