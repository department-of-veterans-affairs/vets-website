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
import { relationshipLabels, ownedAssetTypeLabels } from '../../../labels';
import SupplementaryFormsAlert, {
  SupplementaryFormsAlertUpdated,
} from '../../../components/FormAlerts/SupplementaryFormsAlert';

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
      const shouldShowDeclinedAlert =
        showUpdatedContent() &&
        form?.formData?.ownedAssets?.some(item => {
          const isFarmOrBusiness =
            item?.assetType === 'FARM' || item?.assetType === 'BUSINESS';
          const declinedUpload = item?.['view:addFormQuestion'] === false;
          const saidYesButEmptyArray =
            item?.['view:addFormQuestion'] === true &&
            (!item?.uploadedDocuments || !item.uploadedDocuments.name);

          return isFarmOrBusiness && (declinedUpload || saidYesButEmptyArray);
        });

      if (shouldShowDeclinedAlert) {
        return <SupplementaryFormsAlertUpdated formData={form.formData} />;
      }

      if (showUpdatedContent()) {
        return null;
      }

      return <SupplementaryFormsAlert formData={form.formData} />;
    },
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
        (item?.assetType === 'FARM' || item?.assetType === 'BUSINESS') &&
        item?.['view:addFormQuestion'] === true &&
        isDefined(item?.uploadedDocuments) &&
        item.uploadedDocuments.name ? (
          <li key="upload">
            Form uploaded:{' '}
            <span className="vads-u-font-weight--bold">
              {item.uploadedDocuments.name}
            </span>
          </li>
        ) : null;

      const content = [...mvpContent, updatedContent].filter(Boolean); // Removed spread

      return (
        isDefined(item?.grossMonthlyIncome) &&
        isDefined(item?.ownedPortionValue) && (
          <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
            {content}
          </ul>
        )
      );
    },
    reviewAddButtonText: 'Add another owned asset',
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
        title:
          'Are you or your dependents receiving or expecting to receive any income in the next 12 months generated by owned property or other physical assets?',
        hint: 'If yes, you’ll need to report at least one owned asset',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more owned assets to report?',
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
      'ui:description': (
        <>
          <p>
            Since you added a farm, you’ll need to submit a Pension Claim
            Questionnaire for Farm Income (VA Form 21P-4165).
          </p>
          <va-link
            external
            text="Get VA Form 21P-4165 to download"
            href="/find-forms/about-form-21p-4165/"
          />
        </>
      ),
    },
    'view:addFormQuestion': yesNoUI({
      title: 'Do you want to upload the completed form now?',
    }),
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
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

/** @returns {PageSchema} */
const ownedAssetDocumentUpload = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Property and business type'),
    'view:uploadedDocumentsDescription': {
      'ui:description': (
        <>
          <p>
            Be sure that the Pension Claim Questionnaire for Farm Income (VA
            Form 21P-4165) you submit follow these guidelines:
          </p>
          <ul>
            <li>The document is a .pdf, .jpeg, or .png file</li>
            <li>
              The document isn’t larger than {MAX_FILE_SIZE_MB}
              MB
            </li>
          </ul>
        </>
      ),
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
        (errors, fieldData) => {
          if (fieldData?.isEncrypted && !fieldData?.confirmationCode) {
            return;
          }

          const hasValidFile = fieldData?.name && fieldData?.confirmationCode;

          if (!hasValidFile) {
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

export const ownedAssetPages = arrayBuilderPages(options, pageBuilder => ({
  ownedAssetPagesSummary: pageBuilder.summaryPage({
    title: 'Income and net worth associated with owned assets',
    path: 'property-and-business-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetRecipientPage: pageBuilder.itemPage({
    title: 'Person who receives this income',
    path: 'property-and-business/:index/income-recipient',
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
}));
