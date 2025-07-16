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
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  generateDeleteDescription,
  isDefined,
  otherAssetOwnerRelationshipExplanationRequired,
} from '../../../helpers';
import { relationshipLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'unreportedAssets',
  nounSingular: 'asset previously not reported',
  nounPlural: 'assets previously not reported',
  required: false,
  isItemIncomplete: item =>
    !isDefined(item?.assetOwnerRelationship) ||
    !isDefined(item.ownedPortionValue) ||
    !isDefined(item.assetType) ||
    !isDefined(item.assetLocation), // include all required fields here
  text: {
    getItemName: item => isDefined(item?.assetType) && `${item.assetType}`,
    cardDescription: item =>
      isDefined(item?.ownedPortionValue) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Owned portion value:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.ownedPortionValue)}
            </span>
          </li>
          <li>
            Location:{' '}
            <span className="vads-u-font-weight--bold">
              {item.assetLocation}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another unreported asset',
    alertItemUpdated: 'Your unreported asset information has been updated',
    alertItemDeleted: 'Your unreported asset information has been deleted',
    cancelAddTitle: 'Cancel adding this unreported asset',
    cancelAddButtonText: 'Cancel adding this unreported asset',
    cancelAddYes: 'Yes, cancel adding this unreported asset',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this unreported asset',
    cancelEditYes: 'Yes, cancel editing this unreported asset',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this unreported asset',
    deleteYes: 'Yes, delete this unreported asset',
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
    'view:isAddingUnreportedAssets': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Do you or your dependents have any assets not already reported?',
        hint: 'If yes, you’ll need to report at least one asset',
        labels: {
          Y: 'Yes, I have an asset to report',
          N: 'No, I don’t have an asset to report',
        },
      },
      {
        title: 'Do you have any more assets to report?',
        labels: {
          Y: 'Yes, I have more assets to report',
          N: 'No, I don’t have more assets to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingUnreportedAssets': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingUnreportedAssets'],
  },
};

/** @returns {PageSchema} */
const relationshipPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Unreported asset owner relationship',
      nounSingular: options.nounSingular,
    }),
    assetOwnerRelationship: radioUI({
      title: 'What is the asset owner’s relationship to the Veteran?',
      labels: relationshipLabels,
    }),
    otherAssetOwnerRelationshipType: {
      'ui:title': 'Tell us the type of relationship',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'assetOwnerRelationship',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': (formData, index) =>
        otherAssetOwnerRelationshipExplanationRequired(formData, index),
    },
  },
  schema: {
    type: 'object',
    properties: {
      assetOwnerRelationship: radioSchema(Object.keys(relationshipLabels)),
      otherAssetOwnerRelationshipType: { type: 'string' },
    },
    required: ['assetOwnerRelationship'],
  },
};

/** @returns {PageSchema} */
const assetTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Unreported asset type'),
    assetType: textUI({
      title: 'What is the type of asset?',
      hint: 'Cash, art, etc',
    }),
    ownedPortionValue: currencyUI(
      'What is the value of your portion of the property?',
    ),
    assetLocation: textUI({
      title: 'Where is the asset located?',
      hint: 'Financial institution, property address, etc.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      assetType: textSchema,
      ownedPortionValue: currencySchema,
      assetLocation: textSchema,
    },
    required: ['assetType', 'ownedPortionValue', 'assetLocation'],
  },
};

export const unreportedAssetPages = arrayBuilderPages(options, pageBuilder => ({
  unreportedAssetPagesSummary: pageBuilder.summaryPage({
    title: 'Unreported assets',
    path: 'unreported-assets-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetRelationshipPage: pageBuilder.itemPage({
    title: 'Unreported asset owner relationship',
    path: 'unreported-assets/:index/relationship',
    uiSchema: relationshipPage.uiSchema,
    schema: relationshipPage.schema,
  }),
  unreportedAssetTypePage: pageBuilder.itemPage({
    title: 'Unreported asset type',
    path: 'unreported-assets/:index/asset-type',
    uiSchema: assetTypePage.uiSchema,
    schema: assetTypePage.schema,
  }),
}));
