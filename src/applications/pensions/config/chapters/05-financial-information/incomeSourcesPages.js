import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { recipientTypeLabels, typeOfIncomeLabels } from '../../../labels';
import {
  dependentNameRequired,
  IncomeSourceDescription,
  otherExplanationRequired,
} from './helpers';
import { formatCurrency, showMultiplePageResponse } from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'incomeSources',
  nounSingular: 'income source',
  nounPlural: 'income sources',
  required: false,
  isItemIncomplete: item =>
    !item?.typeOfIncome ||
    !item.receiver ||
    !item.payer ||
    !item.amount ||
    (item.receiver === 'DEPENDENT' && !item.dependentName) ||
    (item.typeOfIncome === 'OTHER' && !item.otherTypeExplanation), // include all required fields here
  text: {
    summaryTitleWithoutItems: 'Gross monthly income',
    getItemName: item => typeOfIncomeLabels[item.typeOfIncome],
    cardDescription: item =>
      item?.amount && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Income recipient:{' '}
            <span className="vads-u-font-weight--bold">
              {recipientTypeLabels[item.receiver]}
            </span>
          </li>
          <li>
            Income provider:{' '}
            <span className="vads-u-font-weight--bold">{item.payer}</span>
          </li>
          <li>
            Monthly amount of income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.amount)}
            </span>
          </li>
        </ul>
      ),
    alertItemUpdated: 'Your income source information has been updated',
    alertItemDeleted: 'Your income source information has been deleted',
    cancelAddTitle: 'Cancel adding this income source',
    cancelAddYes: 'Yes, cancel adding this income source',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this income source',
    cancelEditYes: 'Yes, cancel editing this income source',
    cancelEditNo: 'No',
    cancelNo: 'No',
    deleteTitle: 'Delete this income source',
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
    'view:isAddingIncomeSources': arrayBuilderYesNoUI(options, {
      title: 'Do you, your spouse, or your dependents receive income?',
      labelHeaderLevel: ' ',
      hint: 'Your income is how much you earn. It includes your Social Security benefits, investment and retirement payments, and any income your spouse and dependents receive.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingIncomeSources': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingIncomeSources'],
  },
};

/** @returns {PageSchema} */
const incomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Income source type',
      nounSingular: options.nounSingular,
    }),
    'view:information': {
      'ui:description': IncomeSourceDescription,
    },
    typeOfIncome: radioUI({
      title: 'What type of income?',
      labels: typeOfIncomeLabels,
    }),
    otherTypeExplanation: textUI({
      title: 'Tell us the type of income',
      expandUnder: 'typeOfIncome',
      expandUnderCondition: 'OTHER',
      required: otherExplanationRequired,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:information': {
        type: 'object',
        properties: {},
      },
      typeOfIncome: radioSchema(Object.keys(typeOfIncomeLabels)),
      otherTypeExplanation: textSchema,
    },
    required: ['typeOfIncome'],
  },
};

/** @returns {PageSchema} */
const incomeReceiverPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income source recipient'),
    'view:information': {
      'ui:description': IncomeSourceDescription,
    },
    receiver: radioUI({
      title: 'Who receives this income?',
      hint: 'You’ll be able to add individual incomes separately',
      labels: recipientTypeLabels,
    }),
    dependentName: textUI({
      title: 'Which dependent?',
      expandUnder: 'receiver',
      expandUnderCondition: 'DEPENDENT',
      required: dependentNameRequired,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:information': {
        type: 'object',
        properties: {},
      },
      receiver: radioSchema(Object.keys(recipientTypeLabels)),
      dependentName: textSchema,
    },
    required: ['receiver'],
  },
};

/** @returns {PageSchema} */
const incomePayerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income source provider'),
    'view:information': {
      'ui:description': IncomeSourceDescription,
    },
    payer: textUI({
      title: 'Who pays this income?',
      hint: 'Enter the name of a government agency, a company, or another organization.',
    }),
    amount: currencyUI('What’s the monthly amount of income?'),
  },
  schema: {
    type: 'object',
    properties: {
      'view:information': {
        type: 'object',
        properties: {},
      },
      payer: textSchema,
      amount: currencySchema,
    },
    required: ['payer', 'amount'],
  },
};

export const incomeSourcesPages = arrayBuilderPages(options, pageBuilder => ({
  incomeSourcesSummary: pageBuilder.summaryPage({
    title: 'Income sources',
    path: 'financial/income-sources/summary',
    depends: () => showMultiplePageResponse(),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  incomeTypePage: pageBuilder.itemPage({
    title: 'Income source type',
    path: 'financial/income-sources/:index/income-type',
    depends: () => showMultiplePageResponse(),
    uiSchema: incomeTypePage.uiSchema,
    schema: incomeTypePage.schema,
  }),
  incomeReceiverPage: pageBuilder.itemPage({
    title: 'Income source recipient',
    path: 'financial/income-sources/:index/income-recipient',
    depends: () => showMultiplePageResponse(),
    uiSchema: incomeReceiverPage.uiSchema,
    schema: incomeReceiverPage.schema,
  }),
  incomePayerPage: pageBuilder.itemPage({
    title: 'Income source provider',
    path: 'financial/income-sources/:index/income-provider',
    depends: () => showMultiplePageResponse(),
    uiSchema: incomePayerPage.uiSchema,
    schema: incomePayerPage.schema,
  }),
}));
