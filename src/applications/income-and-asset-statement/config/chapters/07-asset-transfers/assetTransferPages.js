import React from 'react';
import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  fullNameUI,
  fullNameSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatDateShort } from 'platform/utilities/date';
import { relationshipLabels, transferMethodLabels } from '../../../labels';

import {
  formatCurrency,
  otherNewOwnerRelationshipExplanationRequired,
  otherTransferMethodExplanationRequired,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'assetTransfers',
  nounSingular: 'asset transfer',
  nounPlural: 'asset transfers',
  required: false,
  isItemIncomplete: item =>
    !item?.originalOwnerRelationship ||
    !item.transferMethod ||
    !item.assetType ||
    !item.newOwnerName ||
    !item.newOwnerRelationship ||
    typeof item.saleReportedToIrs !== 'boolean' ||
    !item.transferDate ||
    typeof item.assetTransferredUnderFairMarketValue !== 'boolean' ||
    !item.fairMarketValue ||
    !item.capitalGainValue, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: item => item.assetType,
    cardDescription: item =>
      item?.fairMarketValue &&
      item?.capitalGainValue && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Transfer Method:{' '}
            <span className="vads-u-font-weight--bold">
              {transferMethodLabels[item.transferMethod]}
            </span>
          </li>
          <li>
            Transfer Date:{' '}
            <span className="vads-u-font-weight--bold">
              {formatDateShort(item.transferDate)}
            </span>
          </li>
          <li>
            Fair Market Value:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.fairMarketValue)}
            </span>
          </li>
          <li>
            Gain value:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.capitalGainValue)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another asset transfer',
    alertMaxItems:
      'You have added the maximum number of allowed asset transfers for this application. You may edit or delete an asset transfer or choose to continue the application.',
    alertItemUpdated: 'Your asset transfer information has been updated',
    alertItemDeleted: 'Your asset transfer information has been deleted',
    cancelAddTitle: 'Cancel adding this asset transfer',
    cancelAddButtonText: 'Cancel adding this asset transfer',
    cancelAddYes: 'Yes, cancel adding this asset transfer',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this asset transfer',
    cancelEditYes: 'Yes, cancel editing this asset transfer',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this asset transfer',
    deleteYes: 'Yes, delete this asset transfer',
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
    'view:isAddingAssetTransfers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'In the current year and/or prior 3 tax years, did you or your dependents sell, convey, trade, or give away any assets?',
        labels: {
          Y: 'Yes, I have an asset transfer to report',
          N: 'No, I don’t have an asset transfer to report',
        },
      },
      {
        title: 'Do you have any more asset transfers to report?',
        labels: {
          Y: 'Yes, I have another asset transfer to report',
          N: 'No, I don’t have anymore asset transfers to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingAssetTransfers': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingAssetTransfers'],
  },
};

/** @returns {PageSchema} */
const relationshipPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Asset owner relationship information',
      nounSingular: options.nounSingular,
    }),
    originalOwnerRelationship: radioUI({
      title:
        'What is the asset’s original owner’s relationship to the Veteran?',
      labels: relationshipLabels,
    }),
    otherOriginalOwnerRelationshipType: {
      'ui:title': 'Tell us the type of relationship',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'originalOwnerRelationship',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': (formData, index) =>
        otherNewOwnerRelationshipExplanationRequired(formData, index),
    },
  },
  schema: {
    type: 'object',
    properties: {
      originalOwnerRelationship: radioSchema(Object.keys(relationshipLabels)),
      otherOriginalOwnerRelationshipType: textSchema,
    },
    required: ['originalOwnerRelationship'],
  },
};

/** @returns {PageSchema} */
const typePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Asset transfer information'),
    transferMethod: radioUI({
      title: 'How was the asset transferred?',
      labels: transferMethodLabels,
    }),
    otherTransferMethod: {
      'ui:title': 'Tell us how the asset was transferred',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'transferMethod',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': (formData, index) =>
        otherTransferMethodExplanationRequired(formData, index),
    },
    assetType: textUI({
      title: 'What asset was transferred?',
      hint: 'Real estate, Vehicle, etc.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      transferMethod: radioSchema(Object.keys(transferMethodLabels)),
      otherTransferMethod: textSchema,
      assetType: textSchema,
    },
    required: ['transferMethod', 'assetType'],
  },
};

/** @returns {PageSchema} */
const newOwnerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Asset transfer new owner information',
    ),
    newOwnerName: merge(
      {},
      {
        'ui:title': 'Who received the asset?',
      },
      fullNameUI(),
    ),
    newOwnerRelationship: textUI({
      title: 'What is the relationship to the new owner?',
      hint: 'Child, Friend, etc.',
    }),
    saleReportedToIrs: yesNoUI(
      'Was the sale of the asset reported to the IRS?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      newOwnerName: fullNameSchema,
      newOwnerRelationship: textSchema,
      saleReportedToIrs: yesNoSchema,
    },
    required: ['newOwnerName', 'newOwnerRelationship', 'saleReportedToIrs'],
  },
};

/** @returns {PageSchema} */
const transferDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Asset transfer date information'),
    transferDate: currentOrPastDateUI('When was the asset transferred?'),
  },
  schema: {
    type: 'object',
    properties: {
      transferDate: currentOrPastDateSchema,
    },
    required: ['transferDate'],
  },
};

/** @returns {PageSchema} */
const underFairMarketValuePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Asset transfer fair value information',
    ),
    assetTransferredUnderFairMarketValue: yesNoUI(
      'Was the asset transferred for less than fair market value?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      assetTransferredUnderFairMarketValue: yesNoSchema,
    },
    required: ['assetTransferredUnderFairMarketValue'],
  },
};

/** @returns {PageSchema} */
const valuePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Asset transfer value information',
    ),
    fairMarketValue: merge(
      {},
      currencyUI('What was the fair market value when transferred?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
    saleValue: merge({}, currencyUI('What was the sale price?'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
      },
    }),
    capitalGainValue: merge({}, currencyUI('What was the gain?'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      fairMarketValue: { type: 'number' },
      saleValue: { type: 'number' },
      capitalGainValue: { type: 'number' },
    },
    required: ['fairMarketValue', 'capitalGainValue'],
  },
};

export const assetTransferPages = arrayBuilderPages(options, pageBuilder => ({
  assetTransferPagesSummary: pageBuilder.summaryPage({
    title: 'Annuities summary',
    path: 'asset-transfers-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  assetTransferRelationshipPage: pageBuilder.itemPage({
    title: 'Asset transfer relationship information',
    path: 'asset-transfers/:index/relationship',
    uiSchema: relationshipPage.uiSchema,
    schema: relationshipPage.schema,
  }),
  assetTransferTypePage: pageBuilder.itemPage({
    title: 'Asset transfer type information',
    path: 'asset-transfers/:index/type',
    uiSchema: typePage.uiSchema,
    schema: typePage.schema,
  }),
  assetTransferNewOwnerPage: pageBuilder.itemPage({
    title: 'Asset transfer new owner information',
    path: 'asset-transfers/:index/new-owner',
    uiSchema: newOwnerPage.uiSchema,
    schema: newOwnerPage.schema,
  }),
  assetTransferDatePage: pageBuilder.itemPage({
    title: 'Asset transfer date information',
    path: 'asset-transfers/:index/transfer-date',
    uiSchema: transferDatePage.uiSchema,
    schema: transferDatePage.schema,
  }),
  assetTransferUnderFairMarketValuePage: pageBuilder.itemPage({
    title: 'Asset transfer fair value information',
    path: 'asset-transfers/:index/fair-value',
    uiSchema: underFairMarketValuePage.uiSchema,
    schema: underFairMarketValuePage.schema,
  }),
  assetTransferMarketValuePage: pageBuilder.itemPage({
    title: 'Asset transfer market value information',
    path: 'asset-transfers/:index/market-value',
    uiSchema: valuePage.uiSchema,
    schema: valuePage.schema,
  }),
}));
