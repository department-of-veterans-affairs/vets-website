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
import { relationshipLabels, incomeTypeLabels } from '../../../labels';
import {
  otherExplanationRequired,
  otherIncomeTypeExplanationRequired,
  recipientNameRequired,
  showRecipientName,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'unassociatedIncomes',
  nounSingular: 'recurring income not associated with accounts or assets',
  nounPlural: 'recurring incomes not associated with accounts or assets',
  required: false,
  isItemIncomplete: item =>
    !item?.recipientRelationship ||
    !item.incomeType ||
    !item.grossMonthlyIncome ||
    !item.payer, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: item => relationshipLabels[item.recipientRelationship],
    reviewAddButtonText: 'Add another unassociated income',
    alertMaxItems:
      'You have added the maximum number of allowed unassociated incomes for this application. You may edit or delete an unassociated income or choose to continue the application.',
    alertItemUpdated: 'Your unassociated income information has been updated',
    alertItemDeleted: 'Your unassociated income information has been deleted',
    cancelAddTitle: 'Cancel adding this unassociated income',
    cancelAddButtonText: 'Cancel adding this unassociated income',
    cancelAddYes: 'Yes, cancel adding this unassociated income',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this unassociated income',
    cancelEditYes: 'Yes, cancel editing this unassociated income',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this unassociated income',
    deleteYes: 'Yes, delete this unassociated income',
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
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you or your dependents receiving or expecting to receive any income in the next 12 months from sources not related to an account or your assets?',
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
      'view:isAddingUnassociatedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingUnassociatedIncomes'],
  },
};

/** @returns {PageSchema} */
const incomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Recurring income not associated with accounts or assets',
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
      'Recurring income not associated with accounts or assets',
    ),
    incomeType: radioUI({
      title: 'What is the type of income?',
      labels: incomeTypeLabels,
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
    payer: textUI({
      title: 'Income payer name',
      hint: 'Name of business, financial institution, or program, etc.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeType: radioSchema(Object.keys(incomeTypeLabels)),
      otherIncomeType: { type: 'string' },
      grossMonthlyIncome: { type: 'number' },
      payer: textSchema,
    },
    required: ['incomeType', 'grossMonthlyIncome', 'payer'],
  },
};

export const unassociatedIncomePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    unassociatedIncomePagesSummary: pageBuilder.summaryPage({
      title: 'Income not associated with accounts or assets',
      path: 'unassociated-incomes-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomeRecipientPage: pageBuilder.itemPage({
      title: 'Unassociated income recipient',
      path: 'unassociated-incomes/:index/income-recipient',
      uiSchema: incomeRecipientPage.uiSchema,
      schema: incomeRecipientPage.schema,
    }),
    unassociatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Unassociated income type',
      path: 'unassociated-incomes/:index/income-type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
  }),
);
