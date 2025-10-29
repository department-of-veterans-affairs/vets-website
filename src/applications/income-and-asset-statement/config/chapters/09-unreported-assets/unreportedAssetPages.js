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
  requireExpandedArrayField,
  showUpdatedContent,
  sharedYesNoOptionsBase,
} from '../../../helpers';
import { relationshipLabels } from '../../../labels';
import { UnreportedAssetsSummaryDescription } from '../../../components/SummaryDescriptions';

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
    summaryTitle: 'Review assets',
    summaryTitleWithoutItems: showUpdatedContent() ? 'Other assets' : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? UnreportedAssetsSummaryDescription
      : null,
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

// We support multiple summary pages (one per claimant type).
// These constants centralize shared text so each summary page stays consistent.
// Important: only one summary page should ever be displayed at a time.

// Shared summary page text
const updatedTitleNoItems =
  'Did you or your dependents have any assets you haven’t already reported?';
const updatedTitleWithItems = 'Do you have more assets to report?';
const summaryPageTitle = 'Other Assets';
const yesNoOptionLabels = {
  Y: 'Yes, I have an asset to report',
  N: 'No, I don’t have an asset to report',
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
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more assets to report?',
        ...sharedYesNoOptionsBase,
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

const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingUnreportedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

const spouseSummaryPage = {
  uiSchema: {
    'view:isAddingUnreportedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint: 'Your dependents include children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

const childSummaryPage = {
  uiSchema: {
    'view:isAddingUnreportedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: 'Did you have any assets you haven’t already reported?',
        hint: null,
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingUnreportedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and the Veteran’s children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

const parentSummaryPage = {
  uiSchema: {
    'view:isAddingUnreportedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
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
      'ui:title': 'Describe their relationship to the Veteran',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'assetOwnerRelationship',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        otherAssetOwnerRelationshipExplanationRequired(formData, index),
    },
    'ui:options': {
      ...requireExpandedArrayField('otherAssetOwnerRelationshipType'),
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
  unreportedAssetPagesVeteranSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-veteran',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'VETERAN',
    uiSchema: veteranSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesSpouseSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-spouse',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'SPOUSE',
    uiSchema: spouseSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesChildSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-child',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CHILD',
    uiSchema: childSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesCustodianSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-custodian',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesParentSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-parent',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'PARENT',
    uiSchema: parentSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
  unreportedAssetPagesSummary: pageBuilder.summaryPage({
    title: 'Unreported assets',
    path: 'unreported-assets-summary',
    depends: () => !showUpdatedContent(),
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
