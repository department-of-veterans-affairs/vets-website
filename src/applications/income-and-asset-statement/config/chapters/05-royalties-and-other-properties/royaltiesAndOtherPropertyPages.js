import React from 'react';

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
  textareaUI,
  textareaSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  generateDeleteDescription,
  isDefined,
  isRecipientInfoIncomplete,
  otherGeneratedIncomeTypeExplanationRequired,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
  resolveRecipientFullName,
} from '../../../helpers';
import { relationshipLabels, generatedIncomeTypeLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'royaltiesAndOtherProperties',
  nounSingular: 'royalty',
  nounPlural: 'royalties',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    typeof item.canBeSold !== 'boolean' ||
    !isDefined(item.grossMonthlyIncome) ||
    !isDefined(item.fairMarketValue) ||
    !isDefined(item.incomeGenerationMethod), // include all required fields here
  text: {
    getItemName: (item, index, formData) => {
      if (!isDefined(item?.recipientRelationship)) {
        return undefined;
      }
      const fullName = resolveRecipientFullName(item, formData);
      return `${fullName}’s income`;
    },
    cardDescription: item =>
      isDefined(item?.grossMonthlyIncome) &&
      isDefined(item?.fairMarketValue) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Income generation method:{' '}
            <span className="vads-u-font-weight--bold">
              {generatedIncomeTypeLabels[item.incomeGenerationMethod]}
            </span>
          </li>
          <li>
            Gross monthly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.grossMonthlyIncome)}
            </span>
          </li>
          <li>
            Fair market value:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.fairMarketValue)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: 'Add another royalty',
    alertItemUpdated: 'Your royalty information has been updated',
    alertItemDeleted: 'Your royalty information has been deleted',
    cancelAddTitle: 'Cancel adding this royalty',
    cancelAddButtonText: 'Cancel adding this royalty',
    cancelAddYes: 'Yes, cancel adding this royalty',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this royalty',
    cancelEditYes: 'Yes, cancel editing this royalty',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this royalty',
    deleteYes: 'Yes, delete this royalty',
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
    'view:isAddingRoyalties': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you or your dependents receiving or expecting to receive any income and intellectual property royalties, mineral royalties, land use, or other royalties/properties?',
        hint: 'If yes, you’ll need to report at least one income',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title:
          'Do you have more income from royalties and other properties to report?',
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
      'view:isAddingRoyalties': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingRoyalties'],
  },
};

/** @returns {PageSchema} */
const royaltyRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Royalty relationship',
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
          'royaltiesAndOtherProperties',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Royalty recipient'),
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
const generatedIncomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Royalty income information'),
    incomeGenerationMethod: radioUI({
      title: 'How is the income generated from this asset?',
      labels: generatedIncomeTypeLabels,
    }),
    otherIncomeType: {
      'ui:title': 'Tell us how the income is generated',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'incomeGenerationMethod',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': otherGeneratedIncomeTypeExplanationRequired,
    },
    grossMonthlyIncome: currencyUI('Gross monthly income'),
    fairMarketValue: currencyUI('Fair market value of this asset'),
    canBeSold: yesNoUI({
      title: 'Can the asset be sold?',
    }),
    mitigatingCircumstances: textareaUI(
      'Explain any mitigating circumstances that prevent the sale of this asset',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      incomeGenerationMethod: radioSchema(
        Object.keys(generatedIncomeTypeLabels),
      ),
      'view:propertyOrBusinessFormRequestAlert': {
        type: 'object',
        properties: {},
      },
      otherIncomeType: { type: 'string' },
      grossMonthlyIncome: currencySchema,
      fairMarketValue: currencySchema,
      canBeSold: yesNoSchema,
      mitigatingCircumstances: textareaSchema,
    },
    required: [
      'incomeGenerationMethod',
      'grossMonthlyIncome',
      'fairMarketValue',
      'canBeSold',
    ],
  },
};

export const royaltiesAndOtherPropertyPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    royaltyPagesSummary: pageBuilder.summaryPage({
      title:
        'Income and net worth associated with royalties and other properties',
      path: 'royalties-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    royaltyRecipientPage: pageBuilder.itemPage({
      title: 'Royalty recipient',
      path: 'royalties/:index/income-recipient',
      uiSchema: royaltyRecipientPage.uiSchema,
      schema: royaltyRecipientPage.schema,
    }),
    royaltyRecipientNamePage: pageBuilder.itemPage({
      title: 'Royalty recipient',
      path: 'royalties/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'royaltiesAndOtherProperties'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    generatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Royalty income information',
      path: 'royalties/:index/income-type',
      uiSchema: generatedIncomeTypePage.uiSchema,
      schema: generatedIncomeTypePage.schema,
    }),
  }),
);
