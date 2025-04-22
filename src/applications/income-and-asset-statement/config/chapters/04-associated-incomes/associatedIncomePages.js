import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  formatFullNameNoSuffix,
  otherRecipientRelationshipExplanationRequired,
  otherIncomeTypeExplanationRequired,
  recipientNameRequired,
  isDefined,
} from '../../../helpers';
import { relationshipLabels, incomeTypeEarnedLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'associatedIncomes',
  nounSingular: 'income and net worth associated with financial accounts',
  nounPlural: 'incomes and net worth associated with financial accounts',
  required: false,
  isItemIncomplete: item =>
    !isDefined(item?.recipientRelationship) ||
    (!isDefined(item?.otherRecipientRelationshipType) &&
      item?.recipientRelationship === 'OTHER') ||
    (!isDefined(item?.recipientName) &&
      item?.recipientRelationship !== 'VETERAN') ||
    !isDefined(item.incomeType) ||
    (!isDefined(item?.otherIncomeType) && item?.incomeType === 'OTHER') ||
    !isDefined(item.grossMonthlyIncome) ||
    !isDefined(item.accountValue) ||
    !isDefined(item.payer), // include all required fields here
  maxItems: 5,
  text: {
    getItemName: item =>
      isDefined(item?.recipientRelationship) &&
      isDefined(item?.payer) &&
      `${
        item?.recipientRelationship === 'VETERAN'
          ? 'Veteran'
          : formatFullNameNoSuffix(item?.recipientName)
      }’s income from ${item.payer}`,
    cardDescription: item =>
      isDefined(item?.grossMonthlyIncome) && (
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
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(Object.keys(relationshipLabels)),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const recipientNamePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Income and net worth associated with financial accounts',
    ),
    recipientName: fullNameNoSuffixUI(title => `Income recipient’s ${title}`),
  },
  schema: {
    type: 'object',
    properties: {
      recipientName: fullNameNoSuffixSchema,
    },
    required: ['recipientName'],
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
    grossMonthlyIncome: currencyUI('Gross monthly income'),
    accountValue: currencyUI('Value of account'),
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
      grossMonthlyIncome: currencySchema,
      accountValue: currencySchema,
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
    associatedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: 'Financial account recipient name',
      path: 'associated-incomes/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'associatedIncomes'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    associatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Financial account type',
      path: 'associated-incomes/:index/income-type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
  }),
);
