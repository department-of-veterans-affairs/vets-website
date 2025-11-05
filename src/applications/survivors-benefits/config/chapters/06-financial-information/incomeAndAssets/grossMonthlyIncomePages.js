import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  titleUI,
  radioUI,
  textUI,
  radioSchema,
  currencyUI,
  currencySchema,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  recipientTypeLabels,
  typeOfIncomeLabels,
} from '../../../../utils/labels';

const {
  SURVIVING_SPOUSE,
  VETERANS_CHILD,
  CUSTODIAN,
  CUSTODIAN_SPOUSE,
} = recipientTypeLabels;

// specific income recipient labels for gross income per figma design
const incomeRecipients = {
  SURVIVING_SPOUSE,
  VETERANS_CHILD,
  CUSTODIAN,
  CUSTODIAN_SPOUSE,
};

const grossDescription = () => (
  <div>
    <p>
      Next we’ll ask you the gross monthly income you, your spouse, and your
      dependents receive. You’ll need to add at least 1 income source and can
      add up to 4.
    </p>

    <p>
      <strong>Note:</strong> If you’ve been told to complete an Income and Asset
      Statement in Support of Claim for Pension or Parents' Dependency and
      Indemnity Compensation (VA Form 21P-0969), we only require that Social
      Security income be reported in this step. All other income should be
      reported on the VA Form 21P-0969.
    </p>
  </div>
);

const whatWeConsiderIncome = () => (
  <va-additional-info trigger="What we consider income">
    <p>
      Your income is how much you earn. It includes your Social Security
      benefits, investment and retirement payments, and any income your spouse
      and dependents receive.
    </p>
  </va-additional-info>
);

/** Array builder options for income sources */
const options = {
  arrayPath: 'incomeSources',
  nounSingular: 'Income source',
  nounPlural: 'Income sources',
  required: false,
  text: {
    cancelAddTitle: 'Cancel adding this monthly income source?',
    cancelEditTitle: 'Cancel editing this monthly income source?',
    cancelAddDescription:
      'If you cancel, we won’t add this monthly income source to your list of income sources. You’ll return to a page where you can add a new monthly income source.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this monthly income source and you will be returned to the monthly income sources review page.',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
    deleteDescription:
      'This will delete the information from your list of monthly income sources. You’ll return to a page where you can add a new monthly income source.',
    deleteNo: 'No, keep',
    deleteTitle: 'Delete this monthly income source?',
    deleteYes: 'Yes, delete',
    // headline for each card: use the selected type of income label
    getItemName: item =>
      (item && item.typeOfIncome && typeOfIncomeLabels[item.typeOfIncome]) ||
      'Income source',
    // description shown under the card title: show monthly amount if present
    cardDescription: item =>
      item?.amount ? `$${item.amount}` : 'Monthly amount',
    // summary page heading
    summaryTitle: () => 'Review gross monthly income',
    // yes/no question text on summary page
    yesNoBlankReviewQuestion: () =>
      'Do you have another monthly income source to add?',
  },
};

export const grossMonthlyIncomePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    grossMonthlyIncome: pageBuilder.introPage({
      title: 'Gross monthly income',
      path: 'financial-information/gross-monthly-income',
      depends: formData => formData?.claims?.survivorPension === true,
      uiSchema: {
        ...titleUI('Gross monthly income', grossDescription),
        'ui:description': whatWeConsiderIncome,
      },
      schema: {
        type: 'object',
        properties: {},
      },
    }),
    addIncomeSource: pageBuilder.summaryPage({
      title: 'Add income source',
      path: 'financial-information/add-income-source',
      depends: formData => formData?.claims?.survivorPension === true,
      uiSchema: {
        ...titleUI('Add an income source'),
        'view:hasMonthlyIncomeSource': arrayBuilderYesNoUI(
          options,
          {
            title: 'Do you have a monthly income source to add?',
            hint: '',
          },
          {
            title: 'Do you have another monthly income source to add?',
            hint: '',
            labelHeaderLevel: 3,
          },
        ),
      },
      schema: {
        type: 'object',
        required: ['view:hasMonthlyIncomeSource'],
        properties: {
          'view:hasMonthlyIncomeSource': arrayBuilderYesNoSchema,
        },
      },
    }),
    monthlyIncomeDetails: pageBuilder.itemPage({
      title: 'Gross monthly income details',
      path: 'financial-information/:index/monthly-income-details',
      depends: formData => formData?.claims?.survivorPension === true,
      uiSchema: {
        ...titleUI('Gross monthly income details'),
        whoReceives: radioUI({
          title: 'Who receives this income?',
          labels: incomeRecipients,
        }),
        // fullName: textUI({
        //   title: 'Full name of the person who receives this income',
        //   expandUnder: 'whoReceives',
        //   expandUnderCondition: field => field === 'OTHER',
        //   required: formData => formData?.whoReceives === 'OTHER',
        // }),
        typeOfIncome: radioUI({
          title: 'What type of income?',
          labels: typeOfIncomeLabels,
        }),
        otherTypeExplanation: textUI({
          title: 'Tell us the type of income',
          expandUnder: 'typeOfIncome',
          expandUnderCondition: field => field === 'OTHER',
          required: (formData, index, fullData) => {
            const items = formData?.incomeSources ?? fullData?.incomeSources;
            const item = items?.[index];
            return item?.typeOfIncome === 'OTHER';
          },
        }),
        payer: {
          'ui:title': 'Who pays this income?',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            hint:
              'Enter the name of a government agency, a company, or another organization.',
            classNames: 'vads-u-margin-bottom--2',
          },
        },
        amount: currencyUI('How much is the monthly income?'),
      },
      schema: {
        type: 'object',
        required: ['whoReceives', 'typeOfIncome', 'payer', 'amount'],
        properties: {
          whoReceives: radioSchema(Object.keys(incomeRecipients)),
          // fullName: { type: 'string' },
          typeOfIncome: radioSchema(Object.keys(typeOfIncomeLabels)),
          payer: { type: 'string' },
          otherTypeExplanation: { type: 'string' },
          amount: currencySchema,
        },
      },
    }),
  }),
);

export default grossMonthlyIncomePages;
