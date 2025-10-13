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
import { AssetTransfersSummaryDescription } from '../../../components/SummaryDescriptions';
import { DependentDescription } from '../../../components/DependentDescription';

import {
  formatCurrency,
  formatFullNameNoSuffix,
  generateDeleteDescription,
  isDefined,
  otherRecipientRelationshipTypeUI,
  otherTransferMethodExplanationRequired,
  requireExpandedArrayField,
  sharedRecipientRelationshipBase,
  showUpdatedContent,
  sharedYesNoOptionsBase,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  parentRelationshipLabels,
  relationshipLabelDescriptions,
  relationshipLabels,
  spouseRelationshipLabels,
  transferMethodLabels,
} from '../../../labels';

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
    summaryTitle: 'Review asset transfers',
    summaryTitleWithoutItems: showUpdatedContent()
      ? 'Asset transfers and sales'
      : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? AssetTransfersSummaryDescription
      : null,
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

// We support multiple summary pages (one per claimant type).
// These constants centralize shared text so each summary page stays consistent.
// Important: only one summary page should ever be displayed at a time.

// Shared summary page text
const updatedTitleNoItems =
  'Did you or your dependents transfer any assets this year or in the past 3 years?';
const updatedTitleWithItems = 'Do you have more asset transfers to report?';
const summaryPageTitle = 'Asset transfers and other sales';
const incomeRecipientPageTitle = 'Asset owner relationship information';
const yesNoOptionLabels = {
  Y: 'Yes, I have an asset transfer to report',
  N: 'No, I don’t have an asset transfer to report',
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
        ...sharedYesNoOptionsBase,
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

const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingAssetTransfers': arrayBuilderYesNoUI(
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
    'view:isAddingAssetTransfers': arrayBuilderYesNoUI(
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
    'view:isAddingAssetTransfers': arrayBuilderYesNoUI(
      options,
      {
        title: 'Did you transfer any assets this year or in the past 3 years?',
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

const parentSummaryPage = {
  uiSchema: {
    'view:isAddingAssetTransfers': arrayBuilderYesNoUI(
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

const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingAssetTransfers': arrayBuilderYesNoUI(
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

/** @returns {PageSchema} */
const veteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Royalty relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: Object.fromEntries(
        Object.entries(relationshipLabels).filter(
          ([key]) => key !== 'PARENT' && key !== 'CUSTODIAN',
        ),
      ),
      descriptions: relationshipLabelDescriptions,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'assetTransfers',
    ),
    'ui:options': {
      ...requireExpandedArrayField('otherRecipientRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(
        Object.keys(relationshipLabels).filter(
          key => key !== 'PARENT' && key !== 'CUSTODIAN',
        ),
      ),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const spouseIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Royalty relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: spouseRelationshipLabels,
      descriptions: Object.fromEntries(
        Object.entries(relationshipLabelDescriptions).filter(
          ([key]) => key === 'CHILD',
        ),
      ),
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'assetTransfers',
    ),
    'ui:options': {
      ...requireExpandedArrayField('otherRecipientRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(Object.keys(spouseRelationshipLabels)),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const custodianIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Royalty relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: custodianRelationshipLabels,
      descriptions: Object.fromEntries(
        Object.entries(relationshipLabelDescriptions).filter(
          ([key]) => key !== 'CHILD',
        ),
      ),
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'assetTransfers',
    ),
    'ui:options': {
      ...requireExpandedArrayField('otherRecipientRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(
        Object.keys(custodianRelationshipLabels),
      ),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const parentIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Royalty relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: parentRelationshipLabels,
      descriptions: {
        SPOUSE: 'The Veteran’s other parent should file a separate claim',
      },
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'assetTransfers',
    ),
    'ui:options': {
      ...requireExpandedArrayField('otherRecipientRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(Object.keys(parentRelationshipLabels)),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const nonVeteranIncomeRecipientPage = {
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
    otherOriginalOwnerRelationshipType: otherRecipientRelationshipTypeUI(
      'assetTransfers',
    ),
    'ui:options': {
      ...requireExpandedArrayField('otherOriginalOwnerRelationshipType'),
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
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        otherTransferMethodExplanationRequired(formData, index),
    },
    assetType: textUI({
      title: 'What asset was transferred?',
      hint: 'Real estate, Vehicle, etc.',
    }),
    'ui:options': {
      ...requireExpandedArrayField('otherTransferMethod'),
    },
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
  assetTransferVeteranSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'asset-transfers-summary-veteran',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'VETERAN',
    uiSchema: veteranSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  assetTransferPagesSpouseSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'asset-transfers-summary-spouse',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'SPOUSE',
    uiSchema: spouseSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  assetTransferPagesChildSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'asset-transfers-summary-child',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CHILD',
    uiSchema: childSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  assetTransferPagesCustodianSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'asset-transfers-summary-custodian',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  assetTransferPagesParentSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'asset-transfers-summary-parent',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'PARENT',
    uiSchema: parentSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
  assetTransferPagesSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'asset-transfers-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  assetTransferVeteranRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: showUpdatedContent() ? (
      <DependentDescription claimantType="VETERAN" />
    ) : null,
    title: incomeRecipientPageTitle,
    path: 'asset-transfers/:index/veteran-income-recipient',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'VETERAN',
    uiSchema: veteranIncomeRecipientPage.uiSchema,
    schema: veteranIncomeRecipientPage.schema,
  }),
  assetTransferSpouseRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: showUpdatedContent() ? (
      <DependentDescription claimantType="SPOUSE" />
    ) : null,
    title: incomeRecipientPageTitle,
    path: 'asset-transfers/:index/spouse-income-recipient',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'SPOUSE',
    uiSchema: spouseIncomeRecipientPage.uiSchema,
    schema: spouseIncomeRecipientPage.schema,
  }),
  assetTransferCustodianRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: showUpdatedContent() ? (
      <DependentDescription claimantType="CUSTODIAN" />
    ) : null,
    title: incomeRecipientPageTitle,
    path: 'asset-transfers/:index/custodian-income-recipient',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianIncomeRecipientPage.uiSchema,
    schema: custodianIncomeRecipientPage.schema,
  }),
  assetTransferParentRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: showUpdatedContent() ? (
      <DependentDescription claimantType="PARENT" />
    ) : null,
    title: incomeRecipientPageTitle,
    path: 'asset-transfers/:index/parent-income-recipient',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'PARENT',
    uiSchema: parentIncomeRecipientPage.uiSchema,
    schema: parentIncomeRecipientPage.schema,
  }),
  assetTransferNonVeteranRecipientPage: pageBuilder.itemPage({
    title: 'Asset transfer relationship information',
    path: 'asset-transfers/:index/income-recipient',
    depends: () => !showUpdatedContent(),
    uiSchema: nonVeteranIncomeRecipientPage.uiSchema,
    schema: nonVeteranIncomeRecipientPage.schema,
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
