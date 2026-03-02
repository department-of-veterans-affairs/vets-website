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
  otherRecipientRelationshipExplanationRequired,
  requireExpandedArrayField,
  sharedRecipientRelationshipBase,
  sharedYesNoOptionsBase,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  parentRelationshipLabels,
  relationshipLabels,
  relationshipLabelDescriptions,
  spouseRelationshipLabels,
} from '../../../labels';
import { UnreportedAssetsSummaryDescription } from '../../../components/SummaryDescriptions';
import { DependentDescription } from '../../../components/DependentDescription';

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
    summaryTitleWithoutItems: 'Other assets',
    summaryDescriptionWithoutItems: UnreportedAssetsSummaryDescription,
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
    reviewAddButtonText: 'Add unreported asset',
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
const titleNoItems =
  'Do you or your dependents have any assets you haven’t already reported?';
const titleWithItems = 'Do you have more assets to report?';
const summaryPageTitle = 'Other Assets';
const incomeRecipientPageTitle = 'Unreported asset relationship information';
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
        title: titleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: titleWithItems,
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
        title: titleNoItems,
        hint: 'Your dependents include children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: titleWithItems,
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
        title: 'Do you have any assets you haven’t already reported?',
        hint: null,
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: titleWithItems,
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
        title: titleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and the Veteran’s children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: titleWithItems,
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
        title: titleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      {
        title: titleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
};

const otherRecipientRelationshipTypeUI = {
  'ui:title':
    'Describe who owned the asset and how are they related to the Veteran',
  'ui:webComponentField': VaTextInputField,
  'ui:options': {
    expandUnder: 'assetOwnerRelationship',
    expandUnderCondition: 'OTHER',
    expandedContentFocus: true,
  },
  'ui:required': (formData, index) =>
    otherRecipientRelationshipExplanationRequired(
      formData,
      index,
      'unreportedAssets',
    ),
};

/** @returns {PageSchema} */
const veteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Asset owner relationship',
      nounSingular: options.nounSingular,
    }),
    assetOwnerRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: Object.fromEntries(
        Object.entries(relationshipLabels).filter(
          ([key]) => key !== 'PARENT' && key !== 'CUSTODIAN',
        ),
      ),
      descriptions: relationshipLabelDescriptions,
    }),
    otherAssetOwnerRelationshipType: otherRecipientRelationshipTypeUI,
    'ui:options': {
      ...requireExpandedArrayField('otherAssetOwnerRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      assetOwnerRelationship: radioSchema(
        Object.keys(relationshipLabels).filter(
          key => key !== 'PARENT' && key !== 'CUSTODIAN',
        ),
      ),
      otherAssetOwnerRelationshipType: { type: 'string' },
    },
    required: ['assetOwnerRelationship'],
  },
};

/** @returns {PageSchema} */
const spouseIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Asset owner relationship',
      nounSingular: options.nounSingular,
    }),
    assetOwnerRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: spouseRelationshipLabels,
      descriptions: Object.fromEntries(
        Object.entries(relationshipLabelDescriptions).filter(
          ([key]) => key === 'CHILD',
        ),
      ),
    }),
    otherAssetOwnerRelationshipType: otherRecipientRelationshipTypeUI,
    'ui:options': {
      ...requireExpandedArrayField('otherAssetOwnerRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      assetOwnerRelationship: radioSchema(
        Object.keys(spouseRelationshipLabels),
      ),
      otherAssetOwnerRelationshipType: { type: 'string' },
    },
    required: ['assetOwnerRelationship'],
  },
};

/** @returns {PageSchema} */
const custodianIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Asset owner relationship',
      nounSingular: options.nounSingular,
    }),
    assetOwnerRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: custodianRelationshipLabels,
      descriptions: Object.fromEntries(
        Object.entries(relationshipLabelDescriptions).filter(
          ([key]) => key !== 'CHILD',
        ),
      ),
    }),
    otherAssetOwnerRelationshipType: otherRecipientRelationshipTypeUI,
    'ui:options': {
      ...requireExpandedArrayField('otherAssetOwnerRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      assetOwnerRelationship: radioSchema(
        Object.keys(custodianRelationshipLabels),
      ),
      otherAssetOwnerRelationshipType: { type: 'string' },
    },
    required: ['assetOwnerRelationship'],
  },
};

/** @returns {PageSchema} */
const parentIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Asset owner relationship',
      nounSingular: options.nounSingular,
    }),
    assetOwnerRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: parentRelationshipLabels,
      descriptions: {
        SPOUSE: 'The Veteran’s other parent should file a separate claim',
      },
    }),
    otherAssetOwnerRelationshipType: otherRecipientRelationshipTypeUI,
    'ui:options': {
      ...requireExpandedArrayField('otherAssetOwnerRelationshipType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      assetOwnerRelationship: radioSchema(
        Object.keys(parentRelationshipLabels),
      ),
      otherAssetOwnerRelationshipType: { type: 'string' },
    },
    required: ['assetOwnerRelationship'],
  },
};

/** @returns {PageSchema} */
const informationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Asset information'),
    assetType: textUI({
      title: 'What type of asset is it?',
      hint: 'Examples: Cash, art',
    }),
    ownedPortionValue: currencyUI(
      'How much is your portion of this asset worth?',
    ),
    assetLocation: textUI({
      title: 'Asset’s location?',
      hint:
        'Name of the financial institution or the property address of the asset location',
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
    depends: formData => formData.claimantType === 'VETERAN',
    uiSchema: veteranSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesSpouseSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-spouse',
    depends: formData => formData.claimantType === 'SPOUSE',
    uiSchema: spouseSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesChildSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-child',
    depends: formData => formData.claimantType === 'CHILD',
    uiSchema: childSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesCustodianSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-custodian',
    depends: formData => formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetPagesParentSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'unreported-assets-summary-parent',
    depends: formData => formData.claimantType === 'PARENT',
    uiSchema: parentSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  unreportedAssetVeteranRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: <DependentDescription claimantType="VETERAN" />,
    title: incomeRecipientPageTitle,
    path: 'unreported-assets/:index/veteran-income-recipient',
    depends: formData => formData.claimantType === 'VETERAN',
    uiSchema: veteranIncomeRecipientPage.uiSchema,
    schema: veteranIncomeRecipientPage.schema,
  }),
  unreportedAssetSpouseRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: <DependentDescription claimantType="SPOUSE" />,
    title: incomeRecipientPageTitle,
    path: 'unreported-assets/:index/spouse-income-recipient',
    depends: formData => formData.claimantType === 'SPOUSE',
    uiSchema: spouseIncomeRecipientPage.uiSchema,
    schema: spouseIncomeRecipientPage.schema,
  }),
  unreportedAssetCustodianRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: <DependentDescription claimantType="CUSTODIAN" />,
    title: incomeRecipientPageTitle,
    path: 'unreported-assets/:index/custodian-income-recipient',
    depends: formData => formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianIncomeRecipientPage.uiSchema,
    schema: custodianIncomeRecipientPage.schema,
  }),
  unreportedAssetParentRecipientPage: pageBuilder.itemPage({
    ContentBeforeButtons: <DependentDescription claimantType="PARENT" />,
    title: incomeRecipientPageTitle,
    path: 'unreported-assets/:index/parent-income-recipient',
    depends: formData => formData.claimantType === 'PARENT',
    uiSchema: parentIncomeRecipientPage.uiSchema,
    schema: parentIncomeRecipientPage.schema,
  }),
  // When claimantType is 'CHILD' we skip showing the recipient page entirely
  // To preserve required data, we auto-set assetOwnerRelationship to 'CHILD'
  unreportedAssetInformationPage: pageBuilder.itemPage({
    title: 'Unreported asset information',
    path: 'unreported-assets/:index/information',
    uiSchema: {
      ...informationPage.uiSchema,
      'ui:options': {
        updateSchema: (formData, formSchema, _uiSchema, index) => {
          const arrayData = formData?.unreportedAssets || [];
          const item = arrayData[index];
          if (formData.claimantType === 'CHILD' && item) {
            item.assetOwnerRelationship = 'CHILD';
          }
          return {
            ...formSchema,
          };
        },
      },
    },
    schema: informationPage.schema,
  }),
}));
