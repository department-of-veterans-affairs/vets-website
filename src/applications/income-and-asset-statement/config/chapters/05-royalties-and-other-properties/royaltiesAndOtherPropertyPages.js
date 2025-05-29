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
  formatFullNameNoSuffix,
  generateDeleteDescription,
  isDefined,
  isRecipientInfoIncomplete,
  otherGeneratedIncomeTypeExplanationRequired,
  otherRecipientRelationshipExplanationRequired,
  recipientNameRequired,
} from '../../../helpers';
import { relationshipLabels, generatedIncomeTypeLabels } from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'royaltiesAndOtherProperties',
  nounSingular: 'royalty and other property',
  nounPlural: 'royalties and other properties',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    typeof item.canBeSold !== 'boolean' ||
    !isDefined(item.grossMonthlyIncome) ||
    !isDefined(item.fairMarketValue) ||
    !isDefined(item.incomeGenerationMethod), // include all required fields here
  text: {
    getItemName: (item, index, formData) =>
      isDefined(item?.recipientRelationship) &&
      `${
        item?.recipientRelationship === 'VETERAN'
          ? formatFullNameNoSuffix(formData?.veteranFullName)
          : formatFullNameNoSuffix(item?.recipientName)
      }’s income`,
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
    reviewAddButtonText: 'Add another royalty and other property',
    alertItemUpdated:
      'Your royalty and other property information has been updated',
    alertItemDeleted:
      'Your royalty and other property information has been deleted',
    cancelAddTitle: 'Cancel adding this royalty and other property',
    cancelAddButtonText: 'Cancel adding this royalty and other property',
    cancelAddYes: 'Yes, cancel adding this royalty and other property',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this royalty and other property',
    cancelEditYes: 'Yes, cancel editing this royalty and other property',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this royalty and other property',
    deleteYes: 'Yes, delete this royalty and other property',
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
          Y: 'Yes, I have income from royalties and other properties to report',
          N:
            'No, I don’t have income from royalties and other properties to report',
        },
      },
      {
        title:
          'Do you have any more income from royalties and other properties to report?',
        labels: {
          Y:
            'Yes, I have more income from royalties and other properties to report',
          N:
            'No, I don’t have any more income from royalties and other properties to report',
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
      title:
        'Income and net worth associated with royalties and other properties',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title:
        'What is the type of income recipient’s relationship to the Veteran?',
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: {
      'ui:title': 'Tell us the type of relationship',
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Income and net worth associated with royalties and other properties',
    ),
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Income and net worth associated with royalties and other properties',
    ),
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
      path: 'royalties-and-other-properties-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    royaltyRecipientPage: pageBuilder.itemPage({
      title: 'Royalties and other properties recipient',
      path: 'royalties-and-other-properties/:index/income-recipient',
      uiSchema: royaltyRecipientPage.uiSchema,
      schema: royaltyRecipientPage.schema,
    }),
    royaltyRecipientNamePage: pageBuilder.itemPage({
      title: 'Royalties and other properties recipient name',
      path: 'royalties-and-other-properties/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'royaltiesAndOtherProperties'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    generatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Royalties and other properties type',
      path: 'royalties-and-other-properties/:index/income-type',
      uiSchema: generatedIncomeTypePage.uiSchema,
      schema: generatedIncomeTypePage.schema,
    }),
  }),
);
