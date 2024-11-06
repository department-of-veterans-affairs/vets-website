import React from 'react';
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
import {
  formatCurrency,
  otherRecipientRelationshipExplanationRequired,
  otherIncomeTypeExplanationRequired,
  recipientNameRequired,
  showRecipientName,
} from '../../../helpers';
import { relationshipLabels, incomeTypeEarnedLabels } from '../../../labels';

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
    cardDescription: item =>
      item?.grossMonthlyIncome && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Income type:{' '}
            <span className="vads-u-font-weight--bold">
              {incomeTypeEarnedLabels[item.incomeType]}
            </span>
          </li>
          <li>
            Gross monthly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.grossMonthlyIncome)}
            </span>
          </li>
          <li>
            Income recipient:{' '}
            <span className="vads-u-font-weight--bold">{item.payer}</span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another financial account',
    alertMaxItems:
      'You have added the maximum number of allowed incomes for this application. You may edit or delete an income or choose to continue the application.',
    alertItemUpdated: 'Your financial account information has been updated',
    alertItemDeleted: 'Your financial account information has been deleted',
    cancelAddTitle: 'Cancel adding this financial account',
    cancelAddButtonText: 'Cancel adding this financial account',
    cancelAddYes: 'Yes, cancel adding this financial account',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this financial account',
    cancelEditYes: 'Yes, cancel editing this financial account',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this financial account',
    deleteYes: 'Yes, delete this financial account',
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
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
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
      'view:isAddingAssociatedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingAssociatedIncomes'],
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
      'ui:required': (formData, index) =>
        otherRecipientRelationshipExplanationRequired(
          formData,
          index,
          'associatedIncomes',
        ),
    },
    recipientName: {
      'ui:title': 'Tell us the income recipient’s name',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'Only needed if child, parent, custodian of child, or other',
        expandUnder: 'recipientRelationship',
        expandUnderCondition: showRecipientName,
      },
      'ui:required': (formData, index) =>
        recipientNameRequired(formData, index, 'associatedIncomes'),
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
      'ui:required': (formData, index) =>
        otherIncomeTypeExplanationRequired(
          formData,
          index,
          'associatedIncomes',
        ),
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
      title: 'Income and net worth associated with financial accounts',
      path: 'associated-incomes-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomeRecipientPage: pageBuilder.itemPage({
      title: 'Financial account recipient',
      path: 'associated-incomes/:index/income-recipient',
      uiSchema: incomeRecipientPage.uiSchema,
      schema: incomeRecipientPage.schema,
    }),
    associatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Financial account type',
      path: 'associated-incomes/:index/income-type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
  }),
);
