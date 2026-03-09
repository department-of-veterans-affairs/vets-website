import React from 'react';
import { lowerCase } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  fileInputUI,
  fileInputSchema,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  formatCurrency,
  formatPossessiveString,
  fullNameUIHelper,
  generateDeleteDescription,
  isDefined,
  isRecipientInfoIncomplete,
  otherRecipientRelationshipTypeUI,
  requireExpandedArrayField,
  sharedRecipientRelationshipBase,
  shouldShowDeclinedAlert,
  sharedYesNoOptionsBase,
  recipientNameRequired,
  resolveRecipientFullName,
} from '../../../helpers';

import { SupplementaryFormsAlertUpdated } from '../../../components/FormAlerts/SupplementaryFormsAlert';
import {
  relationshipLabels,
  relationshipLabelDescriptions,
  spouseRelationshipLabels,
  spouseRelationshipLabelDescriptions,
  custodianRelationshipLabels,
  custodianRelationshipLabelDescriptions,
  parentRelationshipLabels,
  parentRelationshipLabelDescriptions,
  ownedAssetTypeLabels,
} from '../../../labels';
import {
  FILE_UPLOAD_URL,
  FORM_NUMBER,
  MAX_FILE_SIZE_BYTES,
} from '../../../constants';
import {
  DocumentMailingAddressDescription,
  AdditionalFormNeededDescription,
  DocumentUploadGuidelinesDescription,
  SummaryDescription,
} from '../../../components/OwnedAssetsDescriptions';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'ownedAssets',
  nounSingular: 'owned asset',
  nounPlural: 'owned assets',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    !isDefined(item.grossMonthlyIncome) ||
    !isDefined(item.ownedPortionValue) ||
    !isDefined(item.assetType) ||
    ((item?.assetType === 'FARM' || item?.assetType === 'BUSINESS') &&
      item?.['view:addFormQuestion'] === true &&
      (!isDefined(item?.uploadedDocuments) || !item.uploadedDocuments.name)), // include all required fields here
  text: {
    summaryDescription: form => {
      if (shouldShowDeclinedAlert(form?.formData?.ownedAssets)) {
        return <SupplementaryFormsAlertUpdated formData={form.formData} />;
      }
      return null;
    },
    summaryTitle: 'Review property and business assets',
    summaryTitleWithoutItems: 'Income and net worth from owned assets',
    summaryDescriptionWithoutItems: SummaryDescription,

    getItemName: (item, index, formData) => {
      if (
        !isDefined(item?.recipientRelationship) ||
        !isDefined(item?.assetType)
      ) {
        return undefined;
      }
      const fullName = resolveRecipientFullName(item, formData);
      const possessiveName = formatPossessiveString(fullName);
      return `${possessiveName} income from a ${lowerCase(
        ownedAssetTypeLabels[item.assetType],
      )}`;
    },
    cardDescription: item => {
      if (!item) {
        return undefined;
      }

      const baseContent = [
        <li key="income">
          Gross monthly income:{' '}
          <span className="vads-u-font-weight--bold">
            {isDefined(item?.grossMonthlyIncome) &&
              formatCurrency(item.grossMonthlyIncome)}
          </span>
        </li>,
        <li key="value">
          Owned portion value:{' '}
          <span className="vads-u-font-weight--bold">
            {isDefined(item?.grossMonthlyIncome) &&
              formatCurrency(item.ownedPortionValue)}
          </span>
        </li>,
      ];

      const uploadedContent =
        item?.assetType === 'FARM' || item?.assetType === 'BUSINESS' ? (
          <li key="upload">
            Form uploaded:{' '}
            <span className="vads-u-font-weight--bold">
              {(item?.['view:addFormQuestion'] === true &&
                item?.uploadedDocuments?.name) ||
                'No'}
            </span>
          </li>
        ) : null;

      const content = [...baseContent, uploadedContent].filter(Boolean);

      return (
        isDefined(item?.grossMonthlyIncome) &&
        isDefined(item?.ownedPortionValue) && (
          <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
            {content}
          </ul>
        )
      );
    },
    reviewAddButtonText: 'Add property or business assets',
    alertItemUpdated: 'Your owned asset information has been updated',
    alertItemDeleted: 'Your owned asset information has been deleted',
    cancelAddTitle: 'Cancel adding this owned asset',
    cancelAddButtonText: 'Cancel adding this owned asset',
    cancelAddYes: 'Yes, cancel adding this owned asset',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this owned asset',
    cancelEditYes: 'Yes, cancel editing this owned asset',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this owned asset',
    deleteYes: 'Yes, delete this owned asset',
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
  'Are you or your dependents receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?';
const titleWithItems =
  'Do you have more income from property or business assets to report?';
const summaryPageTitle = 'Income and net worth associated with owned assets';
const incomeRecipientPageTitle = 'Property and business recipient';
const yesNoOptionLabels = {
  Y: 'Yes, I have income from an owned asset to report',
  N: 'No, I don’t have income from an owned asset to report',
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  schema: {
    type: 'object',
    properties: {
      'view:supplementaryFormsAlert': {
        type: 'object',
        properties: {},
      },
      'view:isAddingOwnedAssets': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingOwnedAssets'],
  },
};

/** @returns {PageSchema} */
const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
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

/** @returns {PageSchema} */
const spouseSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: titleNoItems,
        hint: 'Your dependents include children who you financially support. ',
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

/** @returns {PageSchema} */
const childSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?',
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

/** @returns {PageSchema} */
const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
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

/** @returns {PageSchema} */
const parentSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
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

/** @returns {PageSchema} */
const veteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: relationshipLabels,
      descriptions: relationshipLabelDescriptions,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'ownedAssets',
    ),
    'ui:options': {
      ...requireExpandedArrayField('otherRecipientRelationshipType'),
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
const spouseIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: spouseRelationshipLabels,
      descriptions: spouseRelationshipLabelDescriptions,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'ownedAssets',
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
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: {
      ...radioUI({
        ...sharedRecipientRelationshipBase,
        labels: custodianRelationshipLabels,
        descriptions: custodianRelationshipLabelDescriptions,
      }),
    },
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'ownedAssets',
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
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: {
      ...radioUI({
        ...sharedRecipientRelationshipBase,
        labels: parentRelationshipLabels,
        descriptions: parentRelationshipLabelDescriptions,
      }),
    },
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'ownedAssets',
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
const recipientNamePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Person who receives this income'),
    recipientName: fullNameUIHelper(),
  },
  schema: {
    type: 'object',
    properties: {
      recipientName: fullNameNoSuffixSchema,
    },
  },
};

/** @returns {PageSchema} */
const ownedAssetTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Asset information'),
    assetType: radioUI({
      title: 'What type of asset is it?',
      labels: ownedAssetTypeLabels,
    }),
    grossMonthlyIncome: currencyUI({
      title: 'What’s the gross monthly income generated from this asset?',
      hint: 'Gross income is income before taxes and any other deductions.',
    }),
    ownedPortionValue: currencyUI({
      title: 'What is the value of your share of the asset?',
      hint:
        'If you’re the sole owner, enter the full value. If you own part of it, enter the value of the share you own.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      assetType: radioSchema(Object.keys(ownedAssetTypeLabels)),
      grossMonthlyIncome: currencySchema,
      ownedPortionValue: currencySchema,
    },
    required: ['assetType', 'grossMonthlyIncome', 'ownedPortionValue'],
  },
};

/** @returns {PageSchema} */
const ownedAssetAdditionalFormNeeded = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Additional form needed'),
    'view:addFormDescription': {
      'ui:description': AdditionalFormNeededDescription,
    },
    'view:addFormQuestion': yesNoUI({
      title: 'Do you want to upload the completed form now?',
    }),
    'ui:options': {
      updateSchema: (formData, schema, _uiSchema, index) => {
        const itemData = formData?.ownedAssets?.[index] || formData;

        if (itemData?.['view:addFormQuestion'] === false) {
          itemData.uploadedDocuments = [];
        }

        return schema;
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:addFormDescription': {
        type: 'object',
        properties: {},
      },
      'view:addFormQuestion': yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
const ownedAssetDocumentUpload = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Upload additional form'),
    'view:uploadedDocumentsDescription': {
      'ui:description': DocumentUploadGuidelinesDescription,
    },
    uploadedDocuments: {
      ...fileInputUI({
        title: 'Upload supporting form',
        fileUploadUrl: FILE_UPLOAD_URL,
        accept: '.pdf,.jpeg,.png',
        required: () => true,
        errorMessages: { required: 'Upload a supporting document' },
        maxFileSize: MAX_FILE_SIZE_BYTES,
        formNumber: FORM_NUMBER,
        skipUpload: environment.isLocalhost(),
        // server response triggers required validation.
        // skipUpload needed to bypass in local environment
      }),
      'ui:validations': [
        // Taken from the arrayBuilderPatterns
        // needed for validation to work correctly in arrays
        // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/4837
        (errors, fieldData) => {
          if (fieldData?.isEncrypted && !fieldData?.confirmationCode) {
            return;
          }

          if (!fieldData || !fieldData.name) {
            errors.addError('Upload a supporting document');
          }

          if (fieldData.errorMessage) {
            errors.addError(fieldData.errorMessage);
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    required: ['uploadedDocuments'],
    properties: {
      'view:uploadedDocumentsDescription': {
        type: 'object',
        properties: {},
      },
      uploadedDocuments: fileInputSchema(),
    },
  },
};

/** @returns {PageSchema} */
const documentMailingAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Submit additional form by mail'),
    'view:documentMailingAddress': {
      'ui:description': DocumentMailingAddressDescription,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:documentMailingAddress': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export const ownedAssetPages = arrayBuilderPages(options, pageBuilder => ({
  ownedAssetPagesVeteranSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-veteran',
    depends: formData => formData.claimantType === 'VETERAN',
    uiSchema: veteranSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesSpouseSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-spouse',
    depends: formData => formData.claimantType === 'SPOUSE',
    uiSchema: spouseSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesChildSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-child',
    depends: formData => formData.claimantType === 'CHILD',
    uiSchema: childSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesCustodianSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-custodian',
    depends: formData => formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesParentSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-parent',
    depends: formData => formData.claimantType === 'PARENT',
    uiSchema: parentSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetVeteranRecipientPage: pageBuilder.itemPage({
    title: incomeRecipientPageTitle,
    path: 'property-and-business/:index/income-recipient-veteran',
    depends: formData => formData.claimantType === 'VETERAN',
    uiSchema: veteranIncomeRecipientPage.uiSchema,
    schema: veteranIncomeRecipientPage.schema,
  }),
  ownedAssetSpouseRecipientPage: pageBuilder.itemPage({
    title: incomeRecipientPageTitle,
    path: 'property-and-business/:index/income-recipient-spouse',
    depends: formData => formData.claimantType === 'SPOUSE',
    uiSchema: spouseIncomeRecipientPage.uiSchema,
    schema: spouseIncomeRecipientPage.schema,
  }),
  ownedAssetCustodianRecipientPage: pageBuilder.itemPage({
    title: incomeRecipientPageTitle,
    path: 'property-and-business/:index/income-recipient-custodian',
    depends: formData => formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianIncomeRecipientPage.uiSchema,
    schema: custodianIncomeRecipientPage.schema,
  }),
  ownedAssetParentRecipientPage: pageBuilder.itemPage({
    title: incomeRecipientPageTitle,
    path: 'property-and-business/:index/income-recipient-parent',
    depends: formData => formData.claimantType === 'PARENT',
    uiSchema: parentIncomeRecipientPage.uiSchema,
    schema: parentIncomeRecipientPage.schema,
  }),
  // When claimantType is 'CHILD' we skip showing the recipient page entirely
  // To preserve required data, we auto-set recipientRelationship to 'CHILD'
  ownedAssetChildRecipientNamePage: pageBuilder.itemPage({
    title: incomeRecipientPageTitle,
    path: 'property-and-business/:index/recipient-name-updated',
    depends: formData => formData.claimantType === 'CHILD',
    uiSchema: {
      ...recipientNamePage.uiSchema,
      'ui:options': {
        updateSchema: (formData, formSchema, _uiSchema, index) => {
          const arrayData = formData?.ownedAssets || [];
          const item = arrayData[index];
          if (formData.claimantType === 'CHILD' && item) {
            item.recipientRelationship = 'CHILD';
          }
          return {
            ...formSchema,
          };
        },
      },
    },
    schema: recipientNamePage.schema,
  }),
  ownedAssetRecipientNamePage: pageBuilder.itemPage({
    title: 'Property and business recipient name',
    path: 'property-and-business/:index/recipient-name',
    depends: (formData, index) =>
      formData.claimantType !== 'CHILD' &&
      recipientNameRequired(formData, index, 'ownedAssets'),
    uiSchema: recipientNamePage.uiSchema,
    schema: recipientNamePage.schema,
  }),
  ownedAssetTypePage: pageBuilder.itemPage({
    title: 'Property and business type',
    path: 'property-and-business/:index/income-type',

    uiSchema: ownedAssetTypePage.uiSchema,
    schema: ownedAssetTypePage.schema,
  }),
  ownedAssetAdditionalFormNeededPage: pageBuilder.itemPage({
    title: 'Additional form needed',
    path: 'property-and-business/:index/additional-form-needed',
    depends: (formData, index) =>
      formData?.ownedAssets[index]?.assetType === 'FARM' ||
      formData?.ownedAssets[index]?.assetType === 'BUSINESS',

    uiSchema: ownedAssetAdditionalFormNeeded.uiSchema,
    schema: ownedAssetAdditionalFormNeeded.schema,
  }),
  ownedAssetDocumentUploadPage: pageBuilder.itemPage({
    title: 'Additional form needed',
    path: 'property-and-business/:index/document-upload',
    depends: (formData, index) =>
      (formData?.ownedAssets[index]?.assetType === 'FARM' ||
        formData?.ownedAssets[index]?.assetType === 'BUSINESS') &&
      formData?.ownedAssets[index]?.['view:addFormQuestion'] === true,
    uiSchema: ownedAssetDocumentUpload.uiSchema,
    schema: ownedAssetDocumentUpload.schema,
  }),
  ownedAssetDocumentMailingAddressPage: pageBuilder.itemPage({
    title: 'Additional form needed',
    path: 'property-and-business/:index/document-mailing-address',
    depends: (formData, index) =>
      (formData?.ownedAssets[index]?.assetType === 'FARM' ||
        formData?.ownedAssets[index]?.assetType === 'BUSINESS') &&
      formData?.ownedAssets[index]?.['view:addFormQuestion'] === false,
    uiSchema: documentMailingAddressPage.uiSchema,
    schema: documentMailingAddressPage.schema,
  }),
}));
