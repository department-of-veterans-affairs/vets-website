import React from 'react';
import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { recipientTypeLabels, careFrequencyLabels } from '../../../labels';
import { childNameRequired, MedicalExpenseDescription } from './helpers';
import { formatCurrency, showMultiplePageResponse } from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'medicalExpenses',
  nounSingular: 'Medical expense',
  nounPlural: 'Medical expenses',
  required: false,
  isItemIncomplete: item =>
    !item?.recipients ||
    !item.provider ||
    !item.purpose ||
    !item.paymentDate ||
    !item.paymentFrequency ||
    !item.paymentAmount ||
    (item.recipients === 'DEPENDENT' && !item.childName), // include all required fields here
  text: {
    summaryTitleWithoutItems:
      'Medical expenses and other unreimbursed expenses',
    summaryDescriptionWithoutItems: MedicalExpenseDescription,
    getItemName: item => recipientTypeLabels[item.recipients],
    cardDescription: item =>
      item?.paymentAmount && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Care provider:{' '}
            <span className="vads-u-font-weight--bold">{item.provider}</span>
          </li>
          <li>
            Care purpose:{' '}
            <span className="vads-u-font-weight--bold">{item.purpose}</span>
          </li>
          <li>
            Payment frequency:{' '}
            <span className="vads-u-font-weight--bold">
              {careFrequencyLabels[item.paymentFrequency]}
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
    'view:isAddingMedicalExpenses': arrayBuilderYesNoUI(options, {
      title:
        'Do you, your spouse, or your dependents pay medical or other expenses that aren’t reimbursed?',
      labelHeaderLevel: ' ',
      hint: null,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingMedicalExpenses': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingMedicalExpenses'],
  },
};

/** @returns {PageSchema} */
const medicalExpenseRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Medical expense recipient',
      nounSingular: options.nounSingular,
    }),
    recipients: radioUI({
      title: 'Who is the expense for?',
      labels: recipientTypeLabels,
      classNames: 'vads-u-margin-bottom--2',
    }),
    childName: textUI({
      title: 'Enter the child’s name',
      expandUnder: 'recipients',
      expandUnderCondition: 'DEPENDENT',
      required: (formData, index) =>
        childNameRequired('medicalExpenses', formData, index),
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
const medicalExpenseProviderPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Medical expense provider'),
    provider: textUI('Who receives the payment?'),
    purpose: textUI('Whats the payment for?'),
  },
  schema: {
    type: 'object',
    properties: {
      provider: textSchema,
      purpose: textSchema,
    },
    required: ['provider', 'purpose'],
  },
};

/** @returns {PageSchema} */
const medicalExpensePaymentPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Medical expense payment'),
    paymentDate: currentOrPastDateUI('What’s the date of the payment?'),
    paymentFrequency: radioUI({
      title: 'How often are the payments?',
      labels: careFrequencyLabels,
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
      paymentDate: currentOrPastDateSchema,
      paymentFrequency: radioSchema(Object.keys(careFrequencyLabels)),
      paymentAmount: {
        type: 'number',
      },
    },
    required: ['paymentDate', 'paymentFrequency', 'paymentAmount'],
  },
};

export const medicalExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  summaryPage: pageBuilder.summaryPage({
    title: 'Medical expenses and other unreimbursed expenses',
    path: 'financial/medical-expenses/summary',
    depends: () => showMultiplePageResponse(),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  medicalExpenseRecipientPage: pageBuilder.itemPage({
    title: 'Medical expense recipient',
    path: 'financial/medical-expenses/:index/recipient',
    depends: () => showMultiplePageResponse(),
    uiSchema: medicalExpenseRecipientPage.uiSchema,
    schema: medicalExpenseRecipientPage.schema,
  }),
  medicalExpenseProviderPage: pageBuilder.itemPage({
    title: 'Medical expense provider',
    path: 'financial/medical-expenses/:index/provider',
    depends: () => showMultiplePageResponse(),
    uiSchema: medicalExpenseProviderPage.uiSchema,
    schema: medicalExpenseProviderPage.schema,
  }),
  medicalExpensePaymentPage: pageBuilder.itemPage({
    title: 'Medical expense payment',
    path: 'financial/medical-expenses/:index/payment',
    depends: () => showMultiplePageResponse(),
    uiSchema: medicalExpensePaymentPage.uiSchema,
    schema: medicalExpensePaymentPage.schema,
  }),
}));
