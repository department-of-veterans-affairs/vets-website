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
  formatPossessiveString,
  generateDeleteDescription,
  isDefined,
  isIncomeTypeInfoIncomplete,
  isRecipientInfoIncomplete,
  otherIncomeTypeExplanationRequired,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
  resolveRecipientFullName,
} from '../../../helpers';
import { relationshipLabels, incomeTypeEarnedLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'associatedIncomes',
  nounSingular: 'financial account',
  nounPlural: 'financial accounts',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    isIncomeTypeInfoIncomplete(item) ||
    !isDefined(item.grossMonthlyIncome) ||
    !isDefined(item.accountValue) ||
    !isDefined(item.payer), // include all required fields here
  text: {
    getItemName: (item, index, formData) => {
      if (!isDefined(item?.recipientRelationship) || !isDefined(item?.payer)) {
        return undefined;
      }
      const fullName = resolveRecipientFullName(item, formData);
      const possessiveName = formatPossessiveString(fullName);
      return `${possessiveName} income from ${item.payer}`;
    },
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
    deleteDescription: props =>
      generateDeleteDescription(props, options.text.getItemName),
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
        hint: 'If yes, you’ll need to report at least one income',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more recurring income to report?',
        labels: {
          Y: 'Yes',
          N: 'No',
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
      title: 'Financial account relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who receives the income?',
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Describe their relationship to the Veteran',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Financial account recipient'),
    recipientName: fullNameNoSuffixUI(title => `Income recipient’s ${title}`),
  },
  schema: {
    type: 'object',
    properties: {
      recipientName: fullNameNoSuffixSchema,
    },
  },
};

/** @returns {PageSchema} */
const incomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Financial account type'),
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
      path: 'financial-accounts-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomeRecipientPage: pageBuilder.itemPage({
      title: 'Financial account recipient',
      path: 'financial-accounts/:index/income-recipient',
      uiSchema: incomeRecipientPage.uiSchema,
      schema: incomeRecipientPage.schema,
    }),
    associatedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: 'Financial account recipient name',
      path: 'financial-accounts/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'associatedIncomes'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    associatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Financial account type',
      path: 'financial-accounts/:index/income-type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
  }),
);
