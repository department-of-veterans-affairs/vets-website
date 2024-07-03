import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { relationshipLabels, incomeTypeEarnedLabels } from '../../../labels';
import {
  otherExplanationRequired,
  otherIncomeTypeExplanationRequired,
  recipientNameRequired,
  showRecipientName,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'associatedIncomes',
  nounSingular: 'income and net worth associated with financial accounts',
  nounPlural: 'incomes and net worth associated with financial accounts',
  required: false,
  isItemIncomplete: item =>
    !item?.recipientRelationship ||
    !item.incomeType ||
    !item.grossMonthlyIncome ||
    !item.accountValue ||
    !item.payer, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: item => relationshipLabels[item.recipientRelationship],
    reviewAddButtonText: 'Add another income and net worth',
    alertMaxItems:
      'You have added the maximum number of allowed incomes for this application. You may edit or delete an income or choose to continue the application.',
    alertItemUpdated: 'Your income and net worth information has been updated',
    alertItemDeleted: 'Your income and net worth information has been deleted',
    cancelAddTitle: 'Cancel adding this income and net worth',
    cancelAddButtonText: 'Cancel adding this income and net worth',
    cancelAddYes: 'Yes, cancel adding this income and net worth',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this income and net worth',
    cancelEditYes: 'Yes, cancel editing this income and net worth',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this income and net worth',
    deleteYes: 'Yes, delete this income and net worth',
    deleteNo: 'No',
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you or your dependents receiving or expecting to receive any income in the next 12 months that is related to financial accounts?',
        labels: {
          Y: 'Yes, I have income to report',
          N: 'No, I don’t have any income to report',
        },
      },
      {
        title: 'Do you have any more income to report?',
        labels: {
          Y: 'Yes, I have more income to report',
          N: 'No, I don’t have anymore income to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasAssociatedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:hasAssociatedIncomes'],
  },
};

/** @returns {PageSchema} */
const incomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Income and net worth associated with financial accounts',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title:
        'What is the type of income recipient’s relationship to the Veteran?',
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Tell us the type of relationship',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'recipientRelationship',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': otherExplanationRequired,
    },
    recipientName: {
      'ui:title': 'Tell us the income recipient’s name',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'Only needed if child, parent, custodian of child, or other',
        expandUnder: 'recipientRelationship',
        expandUnderCondition: showRecipientName,
      },
      'ui:required': recipientNameRequired,
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(Object.keys(relationshipLabels)),
      otherRecipientRelationshipType: { type: 'string' },
      recipientName: textSchema,
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const incomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Income and net worth associated with financial accounts',
    ),
    incomeType: radioUI({
      title: 'What is the type of income earned?',
      labels: incomeTypeEarnedLabels,
    }),
    otherIncomeType: {
      'ui:title': 'Tell us the type of income',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'incomeType',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': otherIncomeTypeExplanationRequired,
    },
    grossMonthlyIncome: merge({}, currencyUI('Gross monthly income'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
      },
    }),
    accountValue: merge({}, currencyUI('Value of account'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
      },
    }),
    payer: textUI({
      title: 'Income payer name',
      hint: 'Name of business, financial institution, or program, etc.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeType: radioSchema(Object.keys(incomeTypeEarnedLabels)),
      otherIncomeType: { type: 'string' },
      grossMonthlyIncome: { type: 'number' },
      accountValue: { type: 'number' },
      payer: textSchema,
    },
    required: ['incomeType', 'grossMonthlyIncome', 'accountValue', 'payer'],
  },
};

export const associatedIncomePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    associatedIncomePagesSummary: pageBuilder.summaryPage({
      title:
        'Review your income and net worth associated with financial accounts',
      path: 'associated-incomes-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomeRecipientPage: pageBuilder.itemPage({
      title: 'Income recipient',
      path: 'associated-incomes/:index/income-recipient',
      uiSchema: incomeRecipientPage.uiSchema,
      schema: incomeRecipientPage.schema,
    }),
    associatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Income type',
      path: 'associated-incomes/:index/income-type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
  }),
);
