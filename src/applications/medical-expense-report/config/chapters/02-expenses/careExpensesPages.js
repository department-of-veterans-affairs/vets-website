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
import { recipientTypeLabels } from '../../../utils/labels';

function SupportingDocumentsDescription() {
  return (
    <div>
      <p>
        In the next few questions, we’ll ask you about recurring care expenses
        that aren’t reimbursed. You’ll need to add at least one care expense.
      </p>
      <h4>You need to submit supporting documents</h4>
      <p>
        Based on your answer, you’ll need to submit one or more of these VA
        forms that have been signed by a provider:
      </p>
      <ul>
        <li>
          Residential Care, Adult Daycare, or a Similar Facility worksheet
          (opens in a new tab)
        </li>
        <li>In-Home Attendant Expenses worksheet (opens in a new tab)</li>
        <li>
          Request for Nursing Home Information in Connection with Claim for Aid
          and Attendance (VA Form 21-0779 (opens in a new tab))
        </li>
        <li>
          Examination for Housebound Status or Permanent Need for Regular Aid
          and Attendance form (VA Form 21-2680 (opens in a new tab))
        </li>
      </ul>
      <p>
        We’ll ask you to upload these documents at the end of this application.
      </p>
    </div>
  );
}

const transformTypeOfCare = type =>
  type === 'residential'
    ? 'Residential care facility'
    : 'In-home care attendant';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'careExpenses',
  nounSingular: 'care expense',
  nounPlural: 'care expenses',
  required: true,
  isItemIncomplete: item =>
    !item?.typeOfCare ||
    !item?.recipients ||
    !item?.careDate?.from ||
    !item?.monthlyPayment,
  maxItems: 5,
  text: {
    getItemName: item =>
      transformTypeOfCare(item?.typeOfCare) || 'New care expense',
    cardDescription: item => item?.careDate?.from || '',
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add care expenses',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    'ui:description': SupportingDocumentsDescription,
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
    'view:hasCareExpenses': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasCareExpenses': arrayBuilderYesNoSchema,
    },
    required: ['view:hasCareExpenses'],
  },
};

/** @returns {PageSchema} */
const typeOfCarePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Type of care'),
    typeOfCare: radioUI({
      title: 'Select the type of care.',
      labels: {
        residential: 'Residential care facility',
        inHome: 'In-home care attendant',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      typeOfCare: radioSchema(['residential', 'inHome']),
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
    recipients: radioUI({
      title: 'Who is the expense for?',
      labels: recipientTypeLabels,
    }),
    childName: textUI({
      title: 'Full name of the person who received care',
      expandUnder: 'recipients',
      expandUnderCondition: field => field === 'DEPENDENT' || field === 'OTHER',
      required: (formData, index) =>
        ['DEPENDENT', 'OTHER'].includes(
          formData?.careExpenses?.[index]?.recipients,
        ),
    }),
    provider: textUI('What’s the name of the care provider?'),
  },
  schema: {
    type: 'object',
    properties: {
      recipients: radioSchema(Object.keys(recipientTypeLabels)),
      childName: textSchema,
      provider: textSchema,
    },
    required: ['recipients', 'provider'],
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
    monthlyPayment: currencyUI('How much is each monthly payment?'),
    hourlyRate: {
      ...currencyUI('What is the hourly rate for the care provider?'),
      'ui:required': (formData, index) =>
        formData?.careExpenses?.[index]?.typeOfCare === 'inHome',
      'ui:hideIf': (formData, index) =>
        formData?.careExpenses?.[index]?.typeOfCare !== 'inHome',
    },
    hoursPerWeek: {
      ...numberUI('How many hours per week does the care provider work?'),
      'ui:required': (formData, index) =>
        formData?.careExpenses?.[index]?.typeOfCare === 'inHome',
      'ui:hideIf': (formData, index) =>
        formData?.careExpenses?.[index]?.typeOfCare !== 'inHome',
    },
  },
  schema: {
    type: 'object',
    properties: {
      monthlyPayment: currencySchema,
      hourlyRate: currencySchema,
      hoursPerWeek: numberSchema,
    },
    required: ['monthlyPayment'],
  },
};

export const careExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  intro: pageBuilder.introPage({
    title: 'Care expenses',
    path: 'expenses/care/intro',
    depends: formData => formData.hasCareExpenses === true,
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  careExpensesSummary: pageBuilder.summaryPage({
    title: 'Care expenses',
    path: 'expenses/care/summary',
    depends: formData => formData.hasCareExpenses === true,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  careExpensesTypePage: pageBuilder.itemPage({
    title: 'Type of care',
    path: 'expenses/care/:index/type-of-care',
    depends: formData => formData.hasCareExpenses === true,
    uiSchema: typeOfCarePage.uiSchema,
    schema: typeOfCarePage.schema,
  }),
  careExpensesRecipientPage: pageBuilder.itemPage({
    title: 'Care recipient and provider',
    path: 'expenses/care/:index/recipient-provider',
    depends: formData => formData.hasCareExpenses === true,
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  careExpensesDatesPage: pageBuilder.itemPage({
    title: 'Dates of care',
    path: 'expenses/care/:index/dates',
    depends: formData => formData.hasCareExpenses === true,
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
  }),
  careExpensesCostPage: pageBuilder.itemPage({
    title: 'Cost of care',
    path: 'expenses/care/:index/cost',
    depends: formData => formData.hasCareExpenses === true,
    uiSchema: costPage.uiSchema,
    schema: costPage.schema,
  }),
}));
