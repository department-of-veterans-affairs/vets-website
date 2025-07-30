import React from 'react';
import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
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
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatDateLong } from 'platform/utilities/date';
import { relationshipLabels, transferMethodLabels } from '../../../labels';

import {
  formatCurrency,
  formatFullNameNoSuffix,
  generateDeleteDescription,
  isDefined,
  otherNewOwnerRelationshipExplanationRequired,
  otherTransferMethodExplanationRequired,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'assetTransfers',
  nounSingular: 'asset transfer',
  nounPlural: 'asset transfers',
  required: false,
  isItemIncomplete: item =>
    !isDefined(item?.originalOwnerRelationship) ||
    !isDefined(item.transferMethod) ||
    !isDefined(item.assetType) ||
    !isDefined(item.newOwnerName) ||
    !isDefined(item.newOwnerRelationship) ||
    typeof item.saleReportedToIrs !== 'boolean' ||
    !isDefined(item.transferDate) ||
    typeof item.assetTransferredUnderFairMarketValue !== 'boolean' ||
    !isDefined(item.fairMarketValue) ||
    !isDefined(item.capitalGainValue), // include all required fields here
  text: {
    getItemName: item =>
      isDefined(item?.newOwnerName) &&
      `Asset transferred to ${formatFullNameNoSuffix(item?.newOwnerName)}`,
    cardDescription: item =>
      isDefined(item?.fairMarketValue) &&
      isDefined(item?.capitalGainValue) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Transfer method:{' '}
            <span className="vads-u-font-weight--bold">
              {transferMethodLabels[item.transferMethod]}
            </span>
          </li>
          <li>
            Asset transferred:{' '}
            <span className="vads-u-font-weight--bold">{item.assetType}</span>
          </li>
          <li>
            Transfer date:{' '}
            <span className="vads-u-font-weight--bold">
              {formatDateLong(item.transferDate)}
            </span>
          </li>
          <li>
            Fair market value:{' '}
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
    'view:isAddingAssetTransfers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'In this year or in the past 3 tax years, did you or your dependents transfer any assets?',
        hint: 'If yes, you’ll need to report at least one asset transfer',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more asset transfers to report?',
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
      fullNameNoSuffixUI(),
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
      newOwnerName: fullNameNoSuffixSchema,
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
    fairMarketValue: currencyUI(
      'What was the fair market value when transferred?',
    ),
    saleValue: currencyUI('What was the sale price?'),
    capitalGainValue: currencyUI('What was the gain?'),
  },
  schema: {
    type: 'object',
    properties: {
      fairMarketValue: currencySchema,
      saleValue: currencySchema,
      capitalGainValue: currencySchema,
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
