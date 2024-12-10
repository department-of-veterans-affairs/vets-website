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
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatDateShort } from 'platform/utilities/date';
import { trustTypeLabels } from '../../../labels';

import {
  annualReceivedIncomeFromTrustRequired,
  formatCurrency,
  monthlyMedicalReimbursementAmountRequired,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'trusts',
  nounSingular: 'trust',
  nounPlural: 'trusts',
  required: false,
  isItemIncomplete: item =>
    !item?.establishedDate ||
    !item.marketValueAtEstablishment ||
    !item.trustType ||
    typeof item.addedFundsAfterEstablishment !== 'boolean' ||
    typeof item.trustUsedForMedicalExpenses !== 'boolean' ||
    typeof item.trustEstablishedForVeteransChild !== 'boolean' ||
    typeof item.haveAuthorityOrControlOfTrust !== 'boolean', // include all required fields here
  maxItems: 5,
  text: {
    getItemName: () => 'Trust',
    cardDescription: item =>
      item?.marketValueAtEstablishment && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Established date:{' '}
            <span className="vads-u-font-weight--bold">
              {formatDateShort(item.establishedDate)}
            </span>
          </li>
          <li>
            Market value:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.marketValueAtEstablishment)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another trust',
    alertMaxItems:
      'You have added the maximum number of allowed trusts for this application. You may edit or delete a trust or choose to continue the application.',
    alertItemUpdated: 'Your trust information has been updated',
    alertItemDeleted: 'Your trust information has been deleted',
    cancelAddTitle: 'Cancel adding this trust',
    cancelAddButtonText: 'Cancel adding this trust',
    cancelAddYes: 'Yes, cancel adding this trust',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this trust',
    cancelEditYes: 'Yes, cancel editing this trust',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this trust',
    deleteYes: 'Yes, delete this trust',
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
    'view:isAddingTrusts': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Have you or your dependents established a trust or do you or your dependents have access to a trust?',
        labels: {
          Y: 'Yes, I have a trust to report',
          N: 'No, I don’t have a trust to report',
        },
      },
      {
        title: 'Do you or your dependents have another trust to report?',
        labels: {
          Y: 'Yes, I have another trust to report',
          N: 'No, I don’t have anymore trusts to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingTrusts': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingTrusts'],
  },
};

/** @returns {PageSchema} */
const informationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Trust',
      nounSingular: options.nounSingular,
    }),
    establishedDate: currentOrPastDateUI('When was the trust established?'),
    marketValueAtEstablishment: merge(
      {},
      currencyUI(
        'What was the market value of all assets within the trust at the time of establishment?',
      ),
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
      establishedDate: currentOrPastDateSchema,
      marketValueAtEstablishment: { type: 'number' },
    },
    required: ['establishedDate', 'marketValueAtEstablishment'],
  },
};

/** @returns {PageSchema} */
const trustTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust'),
    trustType: radioUI({
      title: 'What is the type of trust established?',
      labels: trustTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      trustType: radioSchema(Object.keys(trustTypeLabels)),
    },
    required: ['trustType'],
  },
};

/** @returns {PageSchema} */
const incomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust'),
    receivingIncomeFromTrust: yesNoUI(
      'Are you receiving income from the trust?',
    ),
    annualReceivedIncome: merge(
      {},
      currencyUI('How much is the annual amount received?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
          expandUnder: 'receivingIncomeFromTrust',
          expandUnderCondition: true,
        },
        'ui:required': annualReceivedIncomeFromTrustRequired,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      receivingIncomeFromTrust: yesNoSchema,
      annualReceivedIncome: { type: 'number' },
    },
    required: ['receivingIncomeFromTrust'],
  },
};

/** @returns {PageSchema} */
const medicalExpensePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust'),
    trustUsedForMedicalExpenses: yesNoUI(
      'Is the trust being used to pay for or to reimburse someone else for your medical expenses?',
    ),
    monthlyMedicalReimbursementAmount: merge(
      {},
      currencyUI('How much is the amount being reimbursed monthly?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
          expandUnder: 'trustUsedForMedicalExpenses',
          expandUnderCondition: true,
        },
        'ui:required': monthlyMedicalReimbursementAmountRequired,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      trustUsedForMedicalExpenses: yesNoSchema,
      monthlyMedicalReimbursementAmount: { type: 'number' },
    },
    required: ['trustUsedForMedicalExpenses'],
  },
};

/** @returns {PageSchema} */
const veteransChildPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust'),
    trustEstablishedForVeteransChild: yesNoUI(
      'Was the trust established for a child of the Veteran who was incapable of self-support prior to reaching age 18?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      trustEstablishedForVeteransChild: yesNoSchema,
    },
    required: ['trustEstablishedForVeteransChild'],
  },
};

/** @returns {PageSchema} */
const controlPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust'),
    haveAuthorityOrControlOfTrust: yesNoUI(
      'Do you have any additional authority or control of the trust?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      haveAuthorityOrControlOfTrust: yesNoSchema,
    },
    required: ['haveAuthorityOrControlOfTrust'],
  },
};

/** @returns {PageSchema} */
const hasAddedFundsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust'),
    addedFundsAfterEstablishment: yesNoUI(
      'Have you added funds to the trust after it was established?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      addedFundsAfterEstablishment: yesNoSchema,
    },
    required: ['addedFundsAfterEstablishment'],
  },
};

/** @returns {PageSchema} */
const addedFundsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Trust'),
    addedFundsDate: currentOrPastDateUI('When did you add funds?'),
    addedFundsAmount: merge({}, currencyUI('How much did you add?'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      addedFundsDate: currentOrPastDateSchema,
      addedFundsAmount: { type: 'number' },
    },
    required: ['addedFundsDate', 'addedFundsAmount'],
  },
};

export const trustPages = arrayBuilderPages(options, pageBuilder => ({
  trustPagesSummary: pageBuilder.summaryPage({
    title: 'Income not associated with accounts or assets',
    path: 'trusts-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  trustInformationPage: pageBuilder.itemPage({
    title: 'Trust information',
    path: 'trusts/:index/trust-information',
    uiSchema: informationPage.uiSchema,
    schema: informationPage.schema,
  }),
  trustTypePage: pageBuilder.itemPage({
    title: 'Trust type',
    path: 'trusts/:index/trust-type',
    uiSchema: trustTypePage.uiSchema,
    schema: trustTypePage.schema,
  }),
  trustIncomePage: pageBuilder.itemPage({
    title: 'Trust income',
    path: 'trusts/:index/trust-income',
    uiSchema: incomePage.uiSchema,
    schema: incomePage.schema,
  }),
  trustMedicalExpensePage: pageBuilder.itemPage({
    title: 'Trust medical expenses',
    path: 'trusts/:index/trust-medical-expenses',
    uiSchema: medicalExpensePage.uiSchema,
    schema: medicalExpensePage.schema,
  }),
  trustVeteransChildPage: pageBuilder.itemPage({
    title: 'Trust established for child',
    path: 'trusts/:index/trust-veterans-child',
    uiSchema: veteransChildPage.uiSchema,
    schema: veteransChildPage.schema,
  }),
  trustControlPage: pageBuilder.itemPage({
    title: 'Trust control',
    path: 'trusts/:index/trust-control',
    uiSchema: controlPage.uiSchema,
    schema: controlPage.schema,
  }),
  trustHasAddedFundsPage: pageBuilder.itemPage({
    title: 'Trust has added funds',
    path: 'trusts/:index/has-added-funds',
    uiSchema: hasAddedFundsPage.uiSchema,
    schema: hasAddedFundsPage.schema,
  }),
  trustAddedFundsPage: pageBuilder.itemPage({
    title: 'Trust added funds',
    path: 'trusts/:index/added-funds',
    depends: (formData, index) =>
      formData?.[options.arrayPath]?.[index]?.addedFundsAfterEstablishment,
    uiSchema: addedFundsPage.uiSchema,
    schema: addedFundsPage.schema,
  }),
}));
