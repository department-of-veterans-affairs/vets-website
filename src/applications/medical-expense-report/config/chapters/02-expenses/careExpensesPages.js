import React from 'react';
import {
  currencyUI,
  currencySchema,
  radioUI,
  checkboxUI,
  radioSchema,
  numberSchema,
  checkboxSchema,
  numberUI,
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
import { recipientTypeLabels, careTypeLabels } from '../../../utils/labels';
import { transformDate } from './helpers';

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        Next we’ll ask you about unreimbursed care expenses that you, your
        spouse, or your dependents pay for.
      </p>
      <p>
        Examples of unreimbursed care expenses include payments to in-home care,
        nursing homes, or other care facilities that insurance won’t cover.
      </p>
      <va-additional-info trigger="Additional documents you may need to submit">
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
        <p>
          We’ll ask you to upload these documents at the end of this
          application.
        </p>
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
  isItemIncomplete: item =>
    !item?.typeOfCare ||
    !item?.recipient ||
    ((item.recipient === 'DEPENDENT' || item.recipient === 'OTHER') &&
      !item?.recipientName) ||
    !item?.provider ||
    !item?.careDate?.from ||
    !item?.monthlyAmount ||
    (item?.typeOfCare === 'IN_HOME_CARE_ATTENDANT' &&
      (!item?.hourlyRate || !item?.weeklyHours)),
  maxItems: 5,
  text: {
    getItemName: item =>
      careTypeLabels[(item?.typeOfCare)] || 'New care expense',
    cardDescription: item => transformDate(item?.careDate?.from) || '',
  },
};

/** @returns {PageSchema} */
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

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
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

/** @returns {PageSchema} */
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

/** @returns {PageSchema} */
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
      expandUnderCondition: field => field === 'DEPENDENT' || field === 'OTHER',
      required: (formData, index, fullData) => {
        // Adding a check for formData and fullData since formData is sometimes undefined on load
        // and we can't rely on fullData for testing
        const careExpenses = formData.careExpenses ?? fullData.careExpenses;
        const careExpense = careExpenses?.[index];
        return ['DEPENDENT', 'OTHER'].includes(careExpense?.recipient);
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
/** @returns {PageSchema} */
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
    required: ['typeOfCare'],
  },
};

/** @returns {PageSchema} */
const costPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Cost of care'),
    monthlyAmount: currencyUI('How much is each monthly payment?'),
    hourlyRate: {
      ...currencyUI({
        title: 'What is the care provider’s hourly rate?',
        hideIf: (formData, index, fullData) => {
          const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
          const careExpense = careExpenses?.[index];
          return careExpense?.typeOfCare !== 'IN_HOME_CARE_ATTENDANT';
        },
      }),
      'ui:required': (formData, index, fullData) => {
        const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
        const careExpense = careExpenses?.[index];
        return careExpense?.typeOfCare === 'IN_HOME_CARE_ATTENDANT';
      },
    },
    weeklyHours: {
      ...numberUI({
        title: 'How many hours per week does the care provider work?',
        hideIf: (formData, index, fullData) => {
          const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
          const careExpense = careExpenses?.[index];
          return careExpense?.typeOfCare !== 'IN_HOME_CARE_ATTENDANT';
        },
      }),
      'ui:required': (formData, index, fullData) => {
        const careExpenses = formData?.careExpenses ?? fullData?.careExpenses;
        const careExpense = careExpenses?.[index];
        return careExpense?.typeOfCare === 'IN_HOME_CARE_ATTENDANT';
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      monthlyAmount: currencySchema,
      hourlyRate: currencySchema,
      weeklyHours: numberSchema,
    },
    required: ['monthlyAmount'],
  },
};

export const careExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  careExpensesIntro: pageBuilder.introPage({
    title: 'Care expenses',
    path: 'expenses/care',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  careExpensesSummary: pageBuilder.summaryPage({
    title: 'Care expenses',
    path: 'expenses/care/add',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  careExpensesTypePage: pageBuilder.itemPage({
    title: 'Type of care',
    path: 'expenses/care/:index/type-of-care',
    uiSchema: typeOfCarePage.uiSchema,
    schema: typeOfCarePage.schema,
  }),
  careExpensesRecipientPage: pageBuilder.itemPage({
    title: 'Care recipient and provider',
    path: 'expenses/care/:index/recipient-provider',
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  careExpensesDatesPage: pageBuilder.itemPage({
    title: 'Dates of care',
    path: 'expenses/care/:index/dates',
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
  }),
  careExpensesCostPage: pageBuilder.itemPage({
    title: 'Cost of care',
    path: 'expenses/care/:index/cost',
    uiSchema: costPage.uiSchema,
    schema: costPage.schema,
  }),
}));
