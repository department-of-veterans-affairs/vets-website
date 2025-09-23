import React from 'react';
import { lowercase } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
  fileInputUI,
  fileInputSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  formatCurrency,
  formatPossessiveString,
  fullNameUIHelper,
  generateDeleteDescription,
  isDefined,
  isRecipientInfoIncomplete,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
  resolveRecipientFullName,
  showUpdatedContent,
} from '../../../helpers';

import SupplementaryFormsAlert, {
  SupplementaryFormsAlertUpdated,
} from '../../../components/FormAlerts/SupplementaryFormsAlert';
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
    (showUpdatedContent() &&
      (item?.assetType === 'FARM' || item?.assetType === 'BUSINESS') &&
      item?.['view:addFormQuestion'] === true &&
      (!isDefined(item?.uploadedDocuments) || !item.uploadedDocuments.name)), // include all required fields here
  text: {
    summaryDescription: form => {
      if (!showUpdatedContent()) {
        return <SupplementaryFormsAlert formData={form.formData} />;
      }

      const shouldShowDeclinedAlert = form?.formData?.ownedAssets?.some(
        item => {
          const isFarmOrBusiness =
            item?.assetType === 'FARM' || item?.assetType === 'BUSINESS';
          const declinedUpload = item?.['view:addFormQuestion'] === false;
          const saidYesButEmptyArray =
            item?.['view:addFormQuestion'] === true &&
            (!item?.uploadedDocuments || !item.uploadedDocuments.name);

          return isFarmOrBusiness && (declinedUpload || saidYesButEmptyArray);
        },
      );

      if (shouldShowDeclinedAlert) {
        return <SupplementaryFormsAlertUpdated formData={form.formData} />;
      }

      return null;
    },
    summaryTitle: props => {
      if (showUpdatedContent()) {
        return 'Review property and business assets';
      }
      return `Review your ${props.nounPlural}`;
    },
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? SummaryDescription
      : null,

    getItemName: (item, index, formData) => {
      if (
        !isDefined(item?.recipientRelationship) ||
        !isDefined(item?.assetType)
      ) {
        return undefined;
      }
      const fullName = resolveRecipientFullName(item, formData);
      const possessiveName = formatPossessiveString(fullName);
      return `${possessiveName} income from a ${lowercase(
        ownedAssetTypeLabels[item.assetType],
      )}`;
    },
    cardDescription: item => {
      const mvpContent = [
        <li key="income">
          Gross monthly income:{' '}
          <span className="vads-u-font-weight--bold">
            {formatCurrency(item.grossMonthlyIncome)}
          </span>
        </li>,
        <li key="value">
          Owned portion value:{' '}
          <span className="vads-u-font-weight--bold">
            {formatCurrency(item.ownedPortionValue)}
          </span>
        </li>,
      ];

      const updatedContent =
        showUpdatedContent() &&
        (item?.assetType === 'FARM' || item?.assetType === 'BUSINESS') ? (
          <li key="upload">
            Form uploaded:{' '}
            <span className="vads-u-font-weight--bold">
              {item?.['view:addFormQuestion'] === true &&
              isDefined(item?.uploadedDocuments) &&
              item.uploadedDocuments.name
                ? item.uploadedDocuments.name
                : 'No'}
            </span>
          </li>
        ) : null;

      const content = [...mvpContent, updatedContent].filter(Boolean);

      return (
        isDefined(item?.grossMonthlyIncome) &&
        isDefined(item?.ownedPortionValue) && (
          <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
            {content}
          </ul>
        )
      );
    },
    reviewAddButtonText: props => {
      if (showUpdatedContent()) {
        return 'Add more property or business assets';
      }
      return `Add another ${props.nounSingular}`;
    },
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

const summaryPageTitle = 'Income and net worth associated with owned assets';

const genericTitle =
  'Are you or your dependents receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?';
const genericHint =
  'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.';

const yesNoOptionLabels = {
  Y: 'Yes, I have income from an owned asset to report',
  N: 'No, I don’t have income from an owned asset to report',
};

const sharedYesNoOptionsBase = {
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '3',
};

const yesNoOptionsMore = {
  title: 'Do you have more income from property or business assets to report?',
  ...sharedYesNoOptionsBase,
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: genericTitle,
        hint: 'If yes, you’ll need to report at least one owned asset',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: showUpdatedContent()
          ? 'Do you have more income from property or business assets to report?'
          : 'Do you have more owned assets to report?',
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
const updatedSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: genericTitle,
        hint: genericHint,
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      yesNoOptionsMore,
    ),
  },
};

/** @returns {PageSchema} */
const updatedSpouseSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: genericTitle,
        hint: 'Your dependents include children who you financially support. ',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      yesNoOptionsMore,
    ),
  },
};

/** @returns {PageSchema} */
const updatedChildSummaryPage = {
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
      yesNoOptionsMore,
    ),
  },
};

/** @returns {PageSchema} */
const updatedCustodianSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: genericTitle,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and the Veteran’s children who you financially support.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      yesNoOptionsMore,
    ),
  },
};

/** @returns {PageSchema} */
const updatedParentSummaryPage = {
  uiSchema: {
    'view:isAddingOwnedAssets': arrayBuilderYesNoUI(
      options,
      {
        title: genericTitle,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner.',
        ...sharedYesNoOptionsBase,
        labels: yesNoOptionLabels,
      },
      yesNoOptionsMore,
    ),
  },
};

/** @returns {PageSchema} */
const ownedAssetRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who receives the income?',
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
          'ownedAssets',
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
const ownedAssetRecipientUpdatedPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who receives the income?',
      hint: 'You’ll be able to add individual incomes separately',
      labels: relationshipLabels,
      descriptions: relationshipLabelDescriptions,
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Describe their relationship to the Veteran',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'recipientRelationship',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (
          formSchema.properties.otherRecipientRelationshipType['ui:collapsed']
        ) {
          return { ...formSchema, required: ['recipientRelationship'] };
        }
        return {
          ...formSchema,
          required: ['recipientRelationship', 'otherRecipientRelationshipType'],
        };
      },
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
const ownedAssetRecipientUpdatedSpousePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who receives the income?',
      hint: 'You’ll be able to add individual incomes separately',
      labels: spouseRelationshipLabels,
      descriptions: spouseRelationshipLabelDescriptions,
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Describe their relationship to the Veteran',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'recipientRelationship',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        otherRecipientRelationshipExplanationRequired(
          formData,
          index,
          'ownedAssets',
        ),
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (
          formSchema.properties.otherRecipientRelationshipType['ui:collapsed']
        ) {
          return { ...formSchema, required: ['recipientRelationship'] };
        }
        return {
          ...formSchema,
          required: ['recipientRelationship', 'otherRecipientRelationshipType'],
        };
      },
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

const ownedAssetRecipientUpdatedChildPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who receives the income?',
      hint: 'You’ll be able to add individual incomes separately',
      labels: relationshipLabels,
      descriptions: relationshipLabelDescriptions,
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Describe their relationship to the Veteran',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'recipientRelationship',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        otherRecipientRelationshipExplanationRequired(
          formData,
          index,
          'ownedAssets',
        ),
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (
          formSchema.properties.otherRecipientRelationshipType['ui:collapsed']
        ) {
          return { ...formSchema, required: ['recipientRelationship'] };
        }
        return {
          ...formSchema,
          required: ['recipientRelationship', 'otherRecipientRelationshipType'],
        };
      },
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
const ownedAssetRecipientUpdatedCustodianPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: {
      ...radioUI({
        title: 'Who receives the income?',
        hint: 'You’ll be able to add individual incomes separately',
        labels: custodianRelationshipLabels,
        descriptions: custodianRelationshipLabelDescriptions,
        labelHeaderLevel: '2',
        labelHeaderLevelStyle: '3',
      }),
    },
    otherRecipientRelationshipType: {
      'ui:title': 'Describe their relationship to the Veteran',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'recipientRelationship',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        otherRecipientRelationshipExplanationRequired(
          formData,
          index,
          'ownedAssets',
        ),
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (
          formSchema.properties.otherRecipientRelationshipType['ui:collapsed']
        ) {
          return { ...formSchema, required: ['recipientRelationship'] };
        }
        return {
          ...formSchema,
          required: ['recipientRelationship', 'otherRecipientRelationshipType'],
        };
      },
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
const ownedAssetRecipientUpdatedParentPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property and business relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: {
      ...radioUI({
        title: 'Who receives the income?',
        hint: 'You’ll be able to add individual incomes separately',
        labels: parentRelationshipLabels,
        descriptions: parentRelationshipLabelDescriptions,
        labelHeaderLevel: '2',
        labelHeaderLevelStyle: '3',
      }),
    },
    otherRecipientRelationshipType: {
      'ui:title': 'Describe their relationship to the Veteran',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'recipientRelationship',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        otherRecipientRelationshipExplanationRequired(
          formData,
          index,
          'ownedAssets',
        ),
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (
          formSchema.properties.otherRecipientRelationshipType['ui:collapsed']
        ) {
          return { ...formSchema, required: ['recipientRelationship'] };
        }
        return {
          ...formSchema,
          required: ['recipientRelationship', 'otherRecipientRelationshipType'],
        };
      },
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      showUpdatedContent()
        ? 'Person who receives this income'
        : 'Property and business recipient',
    ),
    recipientName: showUpdatedContent()
      ? fullNameUIHelper()
      : fullNameNoSuffixUI(title => `Income recipient’s ${title}`),
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
    ...arrayBuilderItemSubsequentPageTitleUI('Property and business type'),
    assetType: radioUI({
      title: 'What is the type of the owned asset?',
      labels: ownedAssetTypeLabels,
    }),
    grossMonthlyIncome: currencyUI('Gross monthly income'),
    ownedPortionValue: currencyUI('Value of your portion of the property'),
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

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2;

/** @returns {PageSchema} */
const ownedAssetDocumentUpload = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Property and business type'),
    'view:uploadedDocumentsDescription': {
      'ui:description': DocumentUploadGuidelinesDescription,
    },
    uploadedDocuments: {
      ...fileInputUI({
        title: 'Upload supporting form',
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
        accept: '.pdf,.jpeg,.png',
        required: () => true,
        errorMessages: { required: 'Upload a supporting document' },
        maxFileSize: MAX_FILE_SIZE_BYTES,
        formNumber: '21P-0969',
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
  ownedAssetPagesUpdatedSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-updated',
    depends: formData =>
      showUpdatedContent() &&
      formData.claimantType !== 'SPOUSE' &&
      formData.claimantType !== 'CHILD' &&
      formData.claimantType !== 'CUSTODIAN' &&
      formData.claimantType !== 'PARENT',
    uiSchema: updatedSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesUpdatedSpouseSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-spouse',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'SPOUSE',
    uiSchema: updatedSpouseSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesUpdatedChildSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-child',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CHILD',
    uiSchema: updatedChildSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesUpdatedCustodianSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-custodian',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
    uiSchema: updatedCustodianSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetPagesUpdatedParentSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary-parent',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'PARENT',
    uiSchema: updatedParentSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
  ownedAssetPagesSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'property-and-business-summary',
    depends: () => !showUpdatedContent(),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetRecipientUpdatedPage: pageBuilder.itemPage({
    title: 'Property and business recipient',
    path: 'property-and-business/:index/income-recipient-updated',
    depends: formData =>
      showUpdatedContent() &&
      formData.claimantType !== 'SPOUSE' &&
      formData.claimantType !== 'CHILD' &&
      formData.claimantType !== 'CUSTODIAN' &&
      formData.claimantType !== 'PARENT',
    uiSchema: ownedAssetRecipientUpdatedPage.uiSchema,
    schema: ownedAssetRecipientPage.schema,
  }),
  ownedAssetRecipientUpdatedSpousePage: pageBuilder.itemPage({
    title: 'Property and business recipient',
    path: 'property-and-business/:index/income-recipient-spouse',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'SPOUSE',
    uiSchema: ownedAssetRecipientUpdatedSpousePage.uiSchema,
    schema: ownedAssetRecipientUpdatedSpousePage.schema,
  }),
  ownedAssetRecipientUpdatedChildPage: pageBuilder.itemPage({
    title: 'Property and business recipient',
    path: 'property-and-business/:index/income-recipient-child',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CHILD',
    uiSchema: ownedAssetRecipientUpdatedChildPage.uiSchema,
    schema: ownedAssetRecipientUpdatedChildPage.schema,
  }),
  ownedAssetRecipientUpdatedCustodianPage: pageBuilder.itemPage({
    title: 'Property and business recipient',
    path: 'property-and-business/:index/income-recipient-custodian',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
    uiSchema: ownedAssetRecipientUpdatedCustodianPage.uiSchema,
    schema: ownedAssetRecipientUpdatedCustodianPage.schema,
  }),
  ownedAssetRecipientUpdatedParentPage: pageBuilder.itemPage({
    title: 'Property and business recipient',
    path: 'property-and-business/:index/income-recipient-parent',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'PARENT',
    uiSchema: ownedAssetRecipientUpdatedParentPage.uiSchema,
    schema: ownedAssetRecipientUpdatedParentPage.schema,
  }),
  // Page 1 MVP
  ownedAssetRecipientPage: pageBuilder.itemPage({
    title: 'Person who receives this income',
    path: 'property-and-business/:index/income-recipient',
    depends: () => !showUpdatedContent(),
    uiSchema: ownedAssetRecipientPage.uiSchema,
    schema: ownedAssetRecipientPage.schema,
  }),
  ownedAssetRecipientNamePage: pageBuilder.itemPage({
    title: 'Person who receives this income name',
    path: 'property-and-business/:index/recipient-name',
    depends: (formData, index) =>
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
      showUpdatedContent() &&
      (formData?.ownedAssets[index]?.assetType === 'FARM' ||
        formData?.ownedAssets[index]?.assetType === 'BUSINESS'),

    uiSchema: ownedAssetAdditionalFormNeeded.uiSchema,
    schema: ownedAssetAdditionalFormNeeded.schema,
  }),
  ownedAssetDocumentUploadPage: pageBuilder.itemPage({
    title: 'Additional form needed',
    path: 'property-and-business/:index/document-upload',
    depends: (formData, index) =>
      showUpdatedContent() &&
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
      showUpdatedContent() &&
      (formData?.ownedAssets[index]?.assetType === 'FARM' ||
        formData?.ownedAssets[index]?.assetType === 'BUSINESS') &&
      formData?.ownedAssets[index]?.['view:addFormQuestion'] === false,
    uiSchema: documentMailingAddressPage.uiSchema,
    schema: documentMailingAddressPage.schema,
  }),
}));
