import React from 'react';
import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateDate } from 'platform/forms-system/src/js/validation';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
} from '../../../helpers';
import { relationshipLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'incomeReceiptWaivers',
  nounSingular: 'income receipt waiver',
  nounPlural: 'income receipt waivers',
  required: false,
  isItemIncomplete: item =>
    !item?.recipientRelationship ||
    !item.payer ||
    !item.waivedGrossMonthlyIncome, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: () => 'Income receipt waiver',
    cardDescription: item =>
      item?.waivedGrossMonthlyIncome && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Recipient relationship:{' '}
            <span className="vads-u-font-weight--bold">
              {relationshipLabels[item.recipientRelationship]}
            </span>
          </li>
          <li>
            Income payer:{' '}
            <span className="vads-u-font-weight--bold">{item.payer}</span>
          </li>
          <li>
            Waived gross monthly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.waivedGrossMonthlyIncome)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another income receipt waiver',
    alertMaxItems:
      'You have added the maximum number of allowed income receipt waivers for this application. You may edit or delete an income receipt waiver or choose to continue the application.',
    alertItemUpdated: 'Your income receipt waiver information has been updated',
    alertItemDeleted: 'Your income receipt waiver information has been deleted',
    cancelAddTitle: 'Cancel adding this income receipt waiver',
    cancelAddButtonText: 'Cancel adding this income receipt waiver',
    cancelAddYes: 'Yes, cancel adding this income receipt waiver',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this income receipt waiver',
    cancelEditYes: 'Yes, cancel editing this income receipt waiver',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this income receipt waiver',
    deleteYes: 'Yes, delete this income receipt waiver',
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
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Did you or your dependents waive or expect to waive any receipt of income in the next 12 months?',
        labels: {
          Y: 'Yes, I have an income receipt waiver to report',
          N: 'No, I don’t have any income receipt waivers to report',
        },
      },
      {
        title: 'Do you have any more income receipt waivers to report?',
        labels: {
          Y: 'Yes, I have another income receipt waiver to report',
          N: 'No, I don’t have anymore income receipt waivers to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingIncomeReceiptWaivers'],
  },
};

/** @returns {PageSchema} */
const relationshipPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Income receipt waiver relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'What is the income recipient’s relationship to the Veteran?',
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
          'incomeReceiptWaivers',
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
      'Income receipt waiver recipient name',
    ),
    recipientName: textUI({
      title: 'Tell us the income recipient’s name',
      hint: 'Only needed if child, parent, custodian of child, or other',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recipientName: textSchema,
    },
    required: ['recipientName'],
  },
};

/** @returns {PageSchema} */
const incomePayerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income receipt waiver payer'),
    payer: textUI({
      title: 'Income payer name',
      hint: 'Name of business, financial institution, etc.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      payer: textSchema,
    },
    required: ['payer'],
  },
};

/** @returns {PageSchema} */
const incomeAmountPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income receipt waiver amount'),
    waivedGrossMonthlyIncome: merge(
      {},
      currencyUI('What is the gross monthly income amount?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      waivedGrossMonthlyIncome: { type: 'number' },
    },
    required: ['waivedGrossMonthlyIncome'],
  },
};

/** @returns {PageSchema} */
const paymentsWillResumePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income receipt waiver payments'),
    'view:paymentsWillResume': yesNoUI('Do you expect the payments to resume?'),
  },
  schema: {
    type: 'object',
    properties: {
      'view:paymentsWillResume': yesNoSchema,
    },
    required: ['view:paymentsWillResume'],
  },
};

/** @returns {PageSchema} */
const incomeDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income receipt waiver date'),
    paymentResumeDate: {
      'ui:title': 'When will the payments resume?',
      'ui:webComponentField': VaMemorableDateField,
      'ui:validations': [validateDate],
      'ui:errorMessages': {
        pattern: 'Please enter a valid date',
        required: 'Please enter a date',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      paymentResumeDate: currentOrPastDateSchema,
    },
    required: ['paymentResumeDate'],
  },
};

/** @returns {PageSchema} */
const expectedIncomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income receipt waiver amount'),
    expectedIncome: merge(
      {},
      currencyUI('What amount do you expect to receive?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      expectedIncome: { type: 'number' },
    },
    required: ['expectedIncome'],
  },
};

export const incomeReceiptWaiverPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    incomeReceiptWaiverPagesSummary: pageBuilder.summaryPage({
      title: 'Income receipt waivers',
      path: 'income-receipt-waivers-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    incomeReceiptWaiverRelationshipPage: pageBuilder.itemPage({
      title: 'Income receipt waiver relationship',
      path: 'income-receipt-waivers/:index/relationship',
      uiSchema: relationshipPage.uiSchema,
      schema: relationshipPage.schema,
    }),
    incomeReceiptWaiverRecipientNamePage: pageBuilder.itemPage({
      title: 'Income receipt waiver recipient name',
      path: 'income-receipt-waivers/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'incomeReceiptWaivers'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    incomeReceiptWaiverPayerPage: pageBuilder.itemPage({
      title: 'Income receipt waiver payer',
      path: 'income-receipt-waivers/:index/payer',
      uiSchema: incomePayerPage.uiSchema,
      schema: incomePayerPage.schema,
    }),
    incomeReceiptWaiverGrossAmountPage: pageBuilder.itemPage({
      title: 'Income receipt waiver gross amount',
      path: 'income-receipt-waivers/:index/gross-amount',
      uiSchema: incomeAmountPage.uiSchema,
      schema: incomeAmountPage.schema,
    }),
    incomeReceiptWaiverPaymentsPage: pageBuilder.itemPage({
      title: 'Income receipt waiver payments',
      path: 'income-receipt-waivers/:index/payments',
      uiSchema: paymentsWillResumePage.uiSchema,
      schema: paymentsWillResumePage.schema,
    }),
    incomeReceiptWaiverDatePage: pageBuilder.itemPage({
      title: 'Income receipt waiver date',
      path: 'income-receipt-waivers/:index/date',
      depends: (formData, index) =>
        formData.incomeReceiptWaivers?.[index]?.['view:paymentsWillResume'],
      uiSchema: incomeDatePage.uiSchema,
      schema: incomeDatePage.schema,
    }),
    incomeReceiptWaiverExpectedAmountPage: pageBuilder.itemPage({
      title: 'Income receipt waiver expected amount',
      path: 'income-receipt-waivers/:index/expected-amount',
      depends: (formData, index) =>
        formData.incomeReceiptWaivers?.[index]?.['view:paymentsWillResume'],
      uiSchema: expectedIncomePage.uiSchema,
      schema: expectedIncomePage.schema,
    }),
  }),
);
