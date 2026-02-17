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
import { getArrayUrlSearchParams } from '~/platform/forms-system/src/js/patterns/array-builder/helpers';
import {
  recipientTypeLabels,
  travelLocationLabels,
} from '../../../utils/labels';
import {
  transformDate,
  requiredIfMileageReimbursed,
  requiredIfMileageLocationOther,
} from './helpers';

const nounSingular = 'mileage expense';
const nounPlural = 'mileage expenses';

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

function checkIsItemIncomplete(item) {
  return (
    !item?.traveler ||
    ((item.traveler === 'CHILD' || item.traveler === 'OTHER') &&
      !item?.fullNameTraveler) ||
    !item?.travelLocation ||
    (item.travelLocation === 'OTHER' && !item?.otherTravelLocation) ||
    !item?.travelDate ||
    !item?.travelMilesTraveled ||
    (item?.travelReimbursed !== false &&
      item.travelReimbursed === true &&
      !item?.travelReimbursementAmount)
  );
}

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'mileageExpenses',
  nounSingular,
  nounPlural,
  required: false,
  isItemIncomplete: item => checkIsItemIncomplete(item),
  maxItems: 12,
  text: {
    getItemName: item => travelLocationLabels[item?.travelLocation] || '',
    cardDescription: item => transformDate(item?.travelDate) || '',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Traveler information', () => {
      const search = getArrayUrlSearchParams();
      const isEdit = search.get('edit');
      if (isEdit) {
        return 'We’ll take you through each of the sections of this mileage expense for you to review and edit.';
      }
      return null;
    }),
    traveler: radioUI({
      title: 'Who needed to travel?',
      labels: recipientTypeLabels,
    }),
    fullNameTraveler: textUI({
      title: 'Full name of the person who traveled',
      expandUnder: 'traveler',
      expandUnderCondition: field => field === 'CHILD' || field === 'OTHER',
      required: (formData, index, fullData) => {
        // Adding a check for formData and fullData since formData is sometimes undefined on load
        // and we can't rely on fullData for testing
        const mileageExpenses =
          formData?.mileageExpenses ?? fullData?.mileageExpenses;
        const mileageExpense = mileageExpenses?.[index];
        return ['CHILD', 'OTHER'].includes(mileageExpense?.traveler);
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      traveler: radioSchema(Object.keys(recipientTypeLabels)),
      fullNameTraveler: textSchema,
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
    otherTravelLocation: textUI({
      title: 'Describe the destination',
      expandUnder: 'travelLocation',
      expandUnderCondition: field => field === 'OTHER',
      required: (formData, index, fullData) =>
        requiredIfMileageLocationOther(formData, index, fullData),
    }),
    travelMilesTraveled: numberUI({
      title: 'How many miles were traveled?',
      max: 9999,
    }),
    travelDate: currentOrPastDateUI({
      title: 'What was the date of travel?',
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      travelLocation: radioSchema(Object.keys(travelLocationLabels)),
      otherTravelLocation: textSchema,
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
        max: 999999.99,
        expandUnderCondition: field => field === true,
      }),
      'ui:required': (formData, index, fullData) =>
        requiredIfMileageReimbursed(formData, index, fullData),
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
