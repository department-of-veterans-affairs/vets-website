import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  currentOrPastDateSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateDate } from 'platform/forms-system/src/js/validation';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  formatFullNameNoSuffix,
  generateDeleteDescription,
  isDefined,
  isRecipientInfoIncomplete,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
} from '../../../helpers';
import { relationshipLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'incomeReceiptWaivers',
  nounSingular: 'waived income',
  nounPlural: 'waived income',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    !isDefined(item.payer) ||
    !isDefined(item.waivedGrossMonthlyIncome), // include all required fields here
  text: {
    getItemName: (item, index, formData) =>
      isDefined(item?.recipientRelationship) &&
      `${
        item?.recipientRelationship === 'VETERAN'
          ? formatFullNameNoSuffix(formData?.veteranFullName)
          : formatFullNameNoSuffix(item?.recipientName)
      }’s waived income`,
    cardDescription: item =>
      isDefined(item?.waivedGrossMonthlyIncome) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
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
    reviewAddButtonText: 'Add another waived income',
    alertItemUpdated: 'Your waived income information has been updated',
    alertItemDeleted: 'Your waived income information has been deleted',
    cancelAddTitle: 'Cancel adding this waived income',
    cancelAddButtonText: 'Cancel adding this waived income',
    cancelAddYes: 'Yes, cancel adding this waived income',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this waived income',
    cancelEditYes: 'Yes, cancel editing this waived income',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this waived income',
    deleteYes: 'Yes, delete this waived income',
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
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Did you or your dependents waive or expect to waive any receipt of income in the next 12 months?',
        hint: 'If yes, you’ll need to report at least one waived income',
        labels: {
          Y: 'Yes, I have a waived income to report',
          N: 'No, I don’t have a waived income to report',
        },
      },
      {
        title: 'Do you have any more waived income to report?',
        labels: {
          Y: 'Yes, I have another waived income to report',
          N: 'No, I don’t have any more waived income to report',
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
      title: 'Waived income relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who received the income?',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income recipient name'),
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
const incomePayerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income payer'),
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
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income amount'),
    waivedGrossMonthlyIncome: currencyUI(
      'What is the gross monthly income amount?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      waivedGrossMonthlyIncome: currencySchema,
    },
    required: ['waivedGrossMonthlyIncome'],
  },
};

/** @returns {PageSchema} */
const paymentsWillResumePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income payments'),
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
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income date'),
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
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income amount'),
    expectedIncome: currencyUI('What amount do you expect to receive?'),
  },
  schema: {
    type: 'object',
    properties: {
      expectedIncome: currencySchema,
    },
    required: ['expectedIncome'],
  },
};

export const incomeReceiptWaiverPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    incomeReceiptWaiverPagesSummary: pageBuilder.summaryPage({
      title: 'Waived income',
      path: 'waived-income-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    incomeReceiptWaiverRelationshipPage: pageBuilder.itemPage({
      title: 'Waived income relationship',
      path: 'waived-income/:index/relationship',
      uiSchema: relationshipPage.uiSchema,
      schema: relationshipPage.schema,
    }),
    incomeReceiptWaiverRecipientNamePage: pageBuilder.itemPage({
      title: 'Waived income recipient name',
      path: 'waived-income/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'incomeReceiptWaivers'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    incomeReceiptWaiverPayerPage: pageBuilder.itemPage({
      title: 'Waived income payer',
      path: 'waived-income/:index/payer',
      uiSchema: incomePayerPage.uiSchema,
      schema: incomePayerPage.schema,
    }),
    incomeReceiptWaiverGrossAmountPage: pageBuilder.itemPage({
      title: 'Waived income gross amount',
      path: 'waived-income/:index/gross-amount',
      uiSchema: incomeAmountPage.uiSchema,
      schema: incomeAmountPage.schema,
    }),
    incomeReceiptWaiverPaymentsPage: pageBuilder.itemPage({
      title: 'Waived income payments',
      path: 'waived-income/:index/payments',
      uiSchema: paymentsWillResumePage.uiSchema,
      schema: paymentsWillResumePage.schema,
    }),
    incomeReceiptWaiverDatePage: pageBuilder.itemPage({
      title: 'Waived income date',
      path: 'waived-income/:index/date',
      depends: (formData, index) =>
        formData.incomeReceiptWaivers?.[index]?.['view:paymentsWillResume'],
      uiSchema: incomeDatePage.uiSchema,
      schema: incomeDatePage.schema,
    }),
    incomeReceiptWaiverExpectedAmountPage: pageBuilder.itemPage({
      title: 'Waived income expected amount',
      path: 'waived-income/:index/expected-amount',
      depends: (formData, index) =>
        formData.incomeReceiptWaivers?.[index]?.['view:paymentsWillResume'],
      uiSchema: expectedIncomePage.uiSchema,
      schema: expectedIncomePage.schema,
    }),
  }),
);
