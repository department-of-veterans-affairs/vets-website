import React from 'react';
import {
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  numberSchema,
  numberUI,
  textUI,
  textSchema,
  yesNoSchema,
  yesNoUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  recipientTypeLabels,
  travelLocationLabels,
} from '../../../utils/labels';
import { transformDate } from './helpers';

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        Next we’ll ask you about unreimbursed mileage that you, your spouse, or
        your dependents paid for.
      </p>
      <p>
        You can report miles that you traveled for medical purposes in a
        privately owned vehicle such as a car, truck, or motorcycle.
      </p>
    </div>
  );
}

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'mileageExpenses',
  nounSingular: 'mileage expense',
  nounPlural: 'mileage expenses',
  required: false,
  isItemIncomplete: item => !item?.travelLocation || !item?.travelDate,
  maxItems: 5,
  text: {
    getItemName: item => travelLocationLabels[(item?.travelLocation)] || '',
    cardDescription: item => transformDate(item?.travelDate) || '',
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Mileage expenses',
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
    'view:mileageExpensesList': arrayBuilderYesNoUI(
      options,
      { hint: '' },
      { hint: '' },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:mileageExpensesList': arrayBuilderYesNoSchema,
    },
    required: ['view:mileageExpensesList'],
  },
};

/** @returns {PageSchema} */
const travelerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Traveler information'),
    traveler: radioUI({
      title: 'Who needed to travel?',
      labels: recipientTypeLabels,
    }),
    travelerName: textUI({
      title: 'Full name of the person who traveled',
      expandUnder: 'traveler',
      expandUnderCondition: field => field === 'DEPENDENT' || field === 'OTHER',
      required: (formData, index, fullData) => {
        // Adding a check for formData and fullData since formData is sometimes undefined on load
        // and we can't rely on fullData for testing
        const mileageExpenses =
          formData?.mileageExpenses ?? fullData?.mileageExpenses;
        const mileageExpense = mileageExpenses?.[index];
        return ['DEPENDENT', 'OTHER'].includes(mileageExpense?.traveler);
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      traveler: radioSchema(Object.keys(recipientTypeLabels)),
      travelerName: textSchema,
    },
    required: ['traveler'],
  },
};
/** @returns {PageSchema} */
const destinationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Expense destination and date'),
    travelLocation: radioUI({
      title: 'What was the destination?',
      labels: travelLocationLabels,
      descriptions: {
        CLINIC:
          'This would be a doctor’s office, dentist, or other outpatient medical provider.',
      },
    }),
    travelLocationOther: textUI({
      title: 'Describe the destination',
      expandUnder: 'travelLocation',
      expandUnderCondition: field => field === 'OTHER',
      required: (formData, index, fullData) => {
        const mileageExpenses =
          formData?.mileageExpenses ?? fullData?.mileageExpenses;
        const mileageExpense = mileageExpenses?.[index];
        return mileageExpense?.travelLocation === 'OTHER';
      },
    }),
    travelMilesTraveled: numberUI('How many miles were traveled?'),
    travelDate: currentOrPastDateUI({
      title: 'What was the date of travel?',
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      travelLocation: radioSchema(Object.keys(travelLocationLabels)),
      travelLocationOther: textSchema,
      travelMilesTraveled: numberSchema,
      travelDate: currentOrPastDateSchema,
    },
    required: ['travelLocation', 'travelMilesTraveled', 'travelDate'],
  },
};

/** @returns {PageSchema} */
const reimbursementPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Expense reimbursement'),
    travelReimbursed: yesNoUI({
      title: 'Has this mileage been reimbursed by any other source?',
      hint: 'For example: a VA Medical Center',
    }),
    // Required doesn't seem to work set directly on currencyUI.
    travelReimbursementAmount: {
      ...currencyUI({
        title: 'How much money was reimbursed?',
        expandUnder: 'travelReimbursed',
        expandUnderCondition: field => field === true,
      }),
      'ui:required': (formData, index, fullData) => {
        const mileageExpenses =
          formData?.mileageExpenses ?? fullData?.mileageExpenses;
        const mileageExpense = mileageExpenses?.[index];
        return mileageExpense?.travelReimbursed === true;
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      travelReimbursed: yesNoSchema,
      travelReimbursementAmount: currencySchema,
    },
    required: ['travelReimbursed'],
  },
};

export const mileageExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  mileageExpensesIntro: pageBuilder.introPage({
    title: 'Mileage expenses',
    path: 'expenses/mileage',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  mileageExpensesSummary: pageBuilder.summaryPage({
    title: 'Do you have a mileage expense to add?',
    path: 'expenses/mileage/add',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  mileageExpensesTravelerPage: pageBuilder.itemPage({
    title: 'Traveler information',
    path: 'expenses/mileage/:index/traveler',
    uiSchema: travelerPage.uiSchema,
    schema: travelerPage.schema,
  }),
  mileageExpensesDestinationPage: pageBuilder.itemPage({
    title: 'Expense destination and date',
    path: 'expenses/mileage/:index/destination',
    uiSchema: destinationPage.uiSchema,
    schema: destinationPage.schema,
  }),
  mileageExpensesReimbursementPage: pageBuilder.itemPage({
    title: 'Expense reimbursement',
    path: 'expenses/mileage/:index/reimbursement',
    uiSchema: reimbursementPage.uiSchema,
    schema: reimbursementPage.schema,
  }),
}));
