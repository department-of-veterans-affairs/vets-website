import React from 'react';
import {
  currencyUI,
  currencySchema,
  radioUI,
  radioSchema,
  numberSchema,
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
import { getArrayUrlSearchParams } from '~/platform/forms-system/src/js/patterns/array-builder/helpers';
import { recipientTypeLabels, careTypeLabels } from '../../../utils/labels';
import {
  transformDate,
  hideIfInHomeCare,
  requiredIfInHomeCare,
  getCostPageTitle,
} from './helpers';

const nounSingular = 'care expense';
const nounPlural = 'care expenses';

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
        <p>We’ll ask you to upload these documents at the end of this form.</p>
      </va-additional-info>
    </div>
  );
}

function checkIsItemIncomplete(item) {
  return (
    !item?.typeOfCare ||
    !item?.recipient ||
    ((item.recipient === 'CHILD' || item.recipient === 'OTHER') &&
      !item?.fullNameRecipient) ||
    !item?.provider ||
    !item?.careDate?.from ||
    !item?.monthlyAmount ||
    (item?.typeOfCare === 'IN_HOME_CARE_ATTENDANT' &&
      (!item?.hourlyRate || !item?.weeklyHours))
  );
}

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'careExpenses',
  nounSingular,
  nounPlural,
  required: false,
  isItemIncomplete: item => checkIsItemIncomplete(item),
  maxItems: 8,
  text: {
    getItemName: item => item?.provider || 'Provider',
    cardDescription: item => {
      const fromDate = transformDate(item?.careDate?.from);
      const toDate = transformDate(item?.careDate?.to);
      if (fromDate && toDate) {
        return `${fromDate} - ${toDate}`;
      }
      if (fromDate) {
        return `${fromDate}`;
      }
      return '';
    },
    cancelAddTitle: 'Cancel adding this care expense?',
    cancelEditTitle: 'Cancel editing this care expense?',
    cancelAddDescription:
      'If you cancel, we won’t add this expense to your list of care expenses. You’ll return to a page where you can add a new care expense.',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Type of care', () => {
      const search = getArrayUrlSearchParams();
      const isEdit = search.get('edit');
      if (isEdit) {
        return 'We’ll take you through each of the sections of this care expense for you to review and edit.';
      }
      return null;
    }),
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
    ...arrayBuilderItemSubsequentPageTitleUI('Care recipient'),
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
        const careExpenses = formData.careExpenses ?? fullData.careExpenses;
        const careExpense = careExpenses?.[index];
        return ['CHILD', 'OTHER'].includes(careExpense?.recipient);
      },
    }),
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
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Care provider’s name and dates of care',
    ),
    provider: textUI('What’s the name of the care provider?'),
    careDate: currentOrPastDateRangeUI(
      {
        title: 'Care start date',
        hint:
          'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
        removeDateHint: true,
        monthSelect: false,
      },
      {
        title: 'Care end date',
        hint: 'Leave blank if care is ongoing.',
        removeDateHint: true,
        monthSelect: false,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      provider: textSchema,
      careDate: {
        ...currentOrPastDateRangeSchema,
        required: ['from'],
      },
    },
    required: ['typeOfCare', 'provider'],
  },
};

/** @returns {PageSchema} */
const costPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      const provider = formData?.provider ?? '';
      return provider ? `Cost of care for ${provider}` : 'Cost of care';
    }),
    monthlyAmount: currencyUI({
      title: 'What’s the monthly cost of this care?',
      max: 999999.99,
    }),
    hourlyRate: {
      ...currencyUI({
        title: 'What is the care provider’s hourly rate?',
        hideIf: (formData, index, fullData) =>
          hideIfInHomeCare(formData, index, fullData),
        max: 999,
      }),
      'ui:required': (formData, index, fullData) =>
        requiredIfInHomeCare(formData, index, fullData),
    },
    weeklyHours: {
      ...numberUI({
        title: 'How many hours per week does the care provider work?',
        hideIf: (formData, index, fullData) =>
          hideIfInHomeCare(formData, index, fullData),
        max: 999,
      }),
      'ui:required': (formData, index, fullData) =>
        requiredIfInHomeCare(formData, index, fullData),
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
    title: 'Care recipient',
    path: 'expenses/care/:index/recipient',
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  careExpensesDatesPage: pageBuilder.itemPage({
    title: 'Care provider’s name and dates of care',
    path: 'expenses/care/:index/dates',
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
  }),
  careExpensesCostPage: pageBuilder.itemPage({
    title: ({ formData }) => getCostPageTitle(formData),
    path: 'expenses/care/:index/cost',
    uiSchema: costPage.uiSchema,
    schema: costPage.schema,
  }),
}));
