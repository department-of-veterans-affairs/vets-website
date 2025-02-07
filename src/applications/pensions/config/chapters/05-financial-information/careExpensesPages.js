import React from 'react';
import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  numberUI,
  numberSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaCheckboxField } from 'platform/forms-system/src/js/web-component-fields';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  careTypeLabels,
  careFrequencyLabels,
  recipientTypeLabels,
} from '../../../labels';
import { childNameRequired } from './helpers';
import { formatCurrency, showMultiplePageResponse } from '../../../helpers';

// eslint-disable-next-line no-unused-vars
const { ONE_TIME, ...careFrequencyLabelsWithoutOneTime } = careFrequencyLabels;

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'careExpenses',
  nounSingular: 'care expense',
  nounPlural: 'care expenses',
  required: false,
  isItemIncomplete: item =>
    !item?.recipients ||
    !item.provider ||
    !item.careType ||
    !item.paymentFrequency ||
    !item.paymentAmount, // include all required fields here
  text: {
    summaryTitleWithoutItems: 'Care expenses',
    getItemName: item => item.provider,
    cardDescription: item =>
      item?.paymentAmount && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Care recipient:{' '}
            <span className="vads-u-font-weight--bold">
              {recipientTypeLabels[item.recipients]}
            </span>
          </li>
          <li>
            Care type:{' '}
            <span className="vads-u-font-weight--bold">
              {careTypeLabels[item.careType]}
            </span>
          </li>
          <li>
            Payment frequency:{' '}
            <span className="vads-u-font-weight--bold">
              {careFrequencyLabelsWithoutOneTime[item.paymentFrequency]}
            </span>
          </li>
          <li>
            Payment amount:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.paymentAmount)}
            </span>
          </li>
        </ul>
      ),
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingCareExpenses': arrayBuilderYesNoUI(options, {
      title:
        'Do you, your spouse, or your dependents pay recurring care expenses that aren’t reimbursed?',
      labelHeaderLevel: ' ',
      hint:
        'Examples of unreimbursed care expenses include payments to in-home care providers, nursing homes, or other care facilities that insurance won’t cover.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingCareExpenses': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingCareExpenses'],
  },
};

/** @returns {PageSchema} */
const careExpenseRecipient = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Care recipient',
      nounSingular: options.nounSingular,
    }),
    recipients: radioUI({
      title: 'Who receives care?',
      labels: recipientTypeLabels,
      classNames: 'vads-u-margin-bottom--2',
    }),
    childName: textUI({
      title: 'Enter the child’s name',
      expandUnder: 'recipients',
      expandUnderCondition: 'DEPENDENT',
      required: (formData, index) =>
        childNameRequired('careExpenses', formData, index),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recipients: radioSchema(Object.keys(recipientTypeLabels)),
      childName: textSchema,
    },
    required: ['recipients'],
  },
};

/** @returns {PageSchema} */
const careExpenseProvider = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Care provider'),
    provider: textUI('What’s the name of the care provider?'),
  },
  schema: {
    type: 'object',
    properties: {
      provider: textSchema,
    },
    required: ['provider'],
  },
};

/** @returns {PageSchema} */
const careExpenseTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Care type'),
    careType: radioUI({
      title: 'Choose the type of care:',
      labels: careTypeLabels,
    }),
    ratePerHour: merge(
      {},
      currencyUI('If this is an in-home provider, what is the rate per hour?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
    hoursPerWeek: numberUI({
      title: 'How many hours per week does the care provider work?',
      width: 'sm',
      min: 1,
      max: 168,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      careType: radioSchema(Object.keys(careTypeLabels)),
      ratePerHour: {
        type: 'number',
      },
      hoursPerWeek: numberSchema,
    },
    required: ['careType'],
  },
};

/** @returns {PageSchema} */
const careExpenseDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Care dates'),
    careDateRange: currentOrPastDateRangeUI(
      'Care start date',
      'Care end date',
      'End of care must be after start of care',
    ),
    noCareEndDate: {
      'ui:title': 'No end date',
      'ui:webComponentField': VaCheckboxField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      careDateRange: {
        ...currentOrPastDateRangeSchema,
        required: ['from'],
      },
      noCareEndDate: {
        type: 'boolean',
      },
    },
  },
};

/** @returns {PageSchema} */
const careExpensePaymentPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Care expense payment',
      nounSingular: options.nounSingular,
    }),
    paymentFrequency: radioUI({
      title: 'How often are the payments?',
      labels: careFrequencyLabelsWithoutOneTime,
    }),
    paymentAmount: merge({}, currencyUI('How much is each payment?'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      paymentFrequency: radioSchema(
        Object.keys(careFrequencyLabelsWithoutOneTime),
      ),
      paymentAmount: {
        type: 'number',
      },
    },
    required: ['paymentFrequency', 'paymentAmount'],
  },
};

export const careExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  careExpensesSummary: pageBuilder.summaryPage({
    title: 'Care expenses',
    path: 'financial/care-expenses/summary',
    depends: () => showMultiplePageResponse(),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  careExpenseRecipient: pageBuilder.itemPage({
    title: 'Care recipient',
    path: 'financial/care-expenses/:index/care-recipient',
    depends: () => showMultiplePageResponse(),
    uiSchema: careExpenseRecipient.uiSchema,
    schema: careExpenseRecipient.schema,
  }),
  careExpenseProvider: pageBuilder.itemPage({
    title: 'Care provider',
    path: 'financial/care-expenses/:index/care-provider',
    depends: () => showMultiplePageResponse(),
    uiSchema: careExpenseProvider.uiSchema,
    schema: careExpenseProvider.schema,
  }),
  careExpenseTypePage: pageBuilder.itemPage({
    title: 'Care type',
    path: 'financial/care-expenses/:index/care-type',
    depends: () => showMultiplePageResponse(),
    uiSchema: careExpenseTypePage.uiSchema,
    schema: careExpenseTypePage.schema,
  }),
  careExpenseDatesPage: pageBuilder.itemPage({
    title: 'Care dates',
    path: 'financial/care-expenses/:index/care-dates',
    depends: () => showMultiplePageResponse(),
    uiSchema: careExpenseDatesPage.uiSchema,
    schema: careExpenseDatesPage.schema,
  }),
  careExpensePaymentPage: pageBuilder.itemPage({
    title: 'Care expense payment',
    path: 'financial/care-expenses/:index/care-expense-payment',
    depends: () => showMultiplePageResponse(),
    uiSchema: careExpensePaymentPage.uiSchema,
    schema: careExpensePaymentPage.schema,
  }),
}));
