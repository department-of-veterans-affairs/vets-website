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
  numberUI,
  numberSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  careRecipientLabels,
  careTypeLabels,
  careFrequencyLabels,
} from '../../../../utils/labels';
import { transformDate } from '../../05-claim-information/helpers';

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
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21p-8416/"
                text="Get VA Form 21P-8416 to download"
                external
              />
            </span>
          </li>
          <li>
            Worksheet for In-Home Attendant from VA Form 21P-8416
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21p-8416/"
                text="Get VA Form 21P-8416 to download"
                external
              />
            </span>
          </li>
          <li>
            Request for Nursing Home Information in Connection with Claim for
            Aid and Attendance (VA Form 21-0779)
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21-0779/"
                text="Get VA Form 21-0779 to download"
                external
              />
            </span>
          </li>
          <li>
            Examination for Housebound Status or Permanent Need for Regular Aid
            and Attendance form (VA Form 21-2680)
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21-2680/"
                text="Get VA Form 21-2680 to download"
                external
              />
            </span>
          </li>
        </ul>
        <p>We’ll ask you to upload these documents at the end of this form.</p>
      </va-additional-info>
    </div>
  );
}

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'careExpenses',
  nounSingular: 'care expense',
  nounPlural: 'care expenses',
  required: false,
  maxItems: 3,
  isItemIncomplete: item =>
    !item?.careType ||
    !item?.recipient ||
    !item?.provider ||
    !item?.careDateRange?.from ||
    !item?.paymentAmount,
  text: {
    cancelAddTitle: 'Cancel adding this care expense?',
    cancelEditTitle: 'Cancel editing this care expense?',
    cancelAddDescription:
      'If you cancel, we won’t add this care expense to your list of expenses. You’ll return to a page where you can add a new care expense.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this expense and you will be returned to the care expenses review page.',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription:
      'This will delete the information from your list of care expenses. You’ll return to a page where you can add a new care expense.',
    deleteNo: 'No, keep',
    deleteTitle: 'Delete this care expense?',
    deleteYes: 'Yes, delete',
    alertMaxItems: (
      <div>
        <p className="vads-u-margin-top--0">
          You have added the maximum number of allowed care expenses for this
          application. Additional care expenses can be added using VA Form
          21P-8416 and uploaded at the end of this application.
        </p>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-8416"
          external
          text="Get VA Form 21P-8416 to download"
        />
      </div>
    ),
    getItemName: item => item?.provider || 'Care provider',
    cardDescription: item => {
      if (!item?.careDateRange) {
        return 'Care dates not provided';
      }
      if (item?.careDateRange?.from && item?.careDateRange?.to) {
        return `${transformDate(item.careDateRange.from)} - ${transformDate(
          item.careDateRange.to,
        )}`;
      }
      return transformDate(item.careDateRange.from);
    },
    summaryTitle: 'Review your care expenses',
    yesNoBlankReviewQuestion: 'Do you have another care expense to add?',
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
    careType: radioUI({
      title: 'Select the type of care.',
      labels: careTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      careType: radioSchema(Object.keys(careTypeLabels)),
    },
    required: ['careType'],
  },
};

const recipientPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Care recipient and provider name',
    ),
    recipient: radioUI({
      title: 'Who is the expense for?',
      labels: careRecipientLabels,
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
      recipient: radioSchema(Object.keys(careRecipientLabels)),
      recipientName: textSchema,
      provider: textSchema,
    },
    required: ['recipient', 'provider'],
  },
};

const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Dates of care'),
    careDateRange: currentOrPastDateRangeUI(
      {
        title: 'Care start date',
        monthSelect: false,
      },
      {
        title: 'Care end date',
        monthSelect: false,
      },
    ),
    noCareEndDate: checkboxUI('No end date'),
  },
  schema: {
    type: 'object',
    properties: {
      careDateRange: {
        ...currentOrPastDateRangeSchema,
        required: ['from'],
      },
      noCareEndDate: checkboxSchema,
    },
  },
};

const costPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Cost of care'),
    paymentFrequency: radioUI({
      title: 'How often are the payments?',
      labels: careFrequencyLabels,
    }),
    paymentAmount: currencyUI({
      title: 'How much is each payment?',
      max: 999999999,
    }),
    ratePerHour: {
      ...currencyUI({
        title: 'What is the provider’s rate per hour?',
        max: 999999999,
        hideIf: (formData, index, fullData) => {
          const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
          const careExpense = careExpenses?.[index];
          return careExpense?.careType !== 'IN_HOME_CARE_ATTENDANT';
        },
      }),
      'ui:required': (formData, index, fullData) => {
        const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
        const careExpense = careExpenses?.[index];
        return careExpense?.careType === 'IN_HOME_CARE_ATTENDANT';
      },
    },
    hoursPerWeek: {
      ...numberUI({
        title: 'How many hours per week does the care provider work?',
        hideIf: (formData, index, fullData) => {
          const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
          const careExpense = careExpenses?.[index];
          return careExpense?.careType !== 'IN_HOME_CARE_ATTENDANT';
        },
      }),
      'ui:required': (formData, index, fullData) => {
        const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
        const careExpense = careExpenses?.[index];
        return careExpense?.careType === 'IN_HOME_CARE_ATTENDANT';
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      paymentFrequency: radioSchema(Object.keys(careFrequencyLabels)),
      paymentAmount: currencySchema,
      ratePerHour: currencySchema,
      hoursPerWeek: numberSchema,
    },
    required: ['paymentAmount', 'paymentFrequency'],
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
