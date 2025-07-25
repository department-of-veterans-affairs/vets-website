import React from 'react';
import { lowercase } from 'lodash';

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
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  formatCurrency,
  formatPossessiveString,
  generateDeleteDescription,
  isDefined,
  isRecipientInfoIncomplete,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
  resolveRecipientFullName,
} from '../../../helpers';
import { relationshipLabels, ownedAssetTypeLabels } from '../../../labels';
import SupplementaryFormsAlert from '../../../components/FormAlerts/SupplementaryFormsAlert';

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
    !isDefined(item.assetType), // include all required fields here
  text: {
    summaryDescription: SupplementaryFormsAlert,
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
    cardDescription: item =>
      isDefined(item?.grossMonthlyIncome) &&
      isDefined(item?.ownedPortionValue) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Gross monthly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.grossMonthlyIncome)}
            </span>
          </li>
          <li>
            Owned portion value:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.ownedPortionValue)}
            </span>
          </li>
        </ul>
      ),
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
    ...arrayBuilderItemSubsequentPageTitleUI('Property and business recipient'),
    recipientName: fullNameNoSuffixUI(title => `Income recipient’s ${title}`),
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

export const ownedAssetPages = arrayBuilderPages(options, pageBuilder => ({
  ownedAssetPagesSummary: pageBuilder.summaryPage({
    title: 'Income and net worth associated with owned assets',
    path: 'property-and-business-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  ownedAssetRecipientPage: pageBuilder.itemPage({
    title: 'Property and business recipient',
    path: 'property-and-business/:index/income-recipient',
    uiSchema: ownedAssetRecipientPage.uiSchema,
    schema: ownedAssetRecipientPage.schema,
  }),
  ownedAssetRecipientNamePage: pageBuilder.itemPage({
    title: 'Property and business recipient name',
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
}));
