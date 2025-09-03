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
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { SummaryDescription } from '../../../components/AssociatedIncomeSummaryDescription';
import { DependentDescription } from '../../../components/DependentDescription';
import {
  formatCurrency,
  formatPossessiveString,
  fullNameUIHelper,
  generateDeleteDescription,
  isDefined,
  isIncomeTypeInfoIncomplete,
  isRecipientInfoIncomplete,
  otherIncomeTypeExplanationRequired,
  otherRecipientRelationshipTypeUI,
  recipientNameRequired,
  resolveRecipientFullName,
  sharedRecipientRelationshipBase,
  showUpdatedContent,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  parentRelationshipLabels,
  parentRelationshipLabelDescriptions,
  relationshipLabels,
  relationshipLabelDescriptions,
  incomeTypeEarnedLabels,
  yesNoLabelsIncome,
  yesNoLabels,
} from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'associatedIncomes',
  nounSingular: 'financial account',
  nounPlural: 'financial accounts',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    isIncomeTypeInfoIncomplete(item) ||
    !isDefined(item.grossMonthlyIncome) ||
    !isDefined(item.accountValue) ||
    !isDefined(item.payer), // include all required fields here
  text: {
    summaryTitle: showUpdatedContent()
      ? 'Review financial account income'
      : null,
    summaryTitleWithoutItems: showUpdatedContent()
      ? 'Income from financial accounts'
      : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? SummaryDescription
      : null,
    getItemName: (item, index, formData) => {
      if (!isDefined(item?.recipientRelationship) || !isDefined(item?.payer)) {
        return undefined;
      }
      const fullName = resolveRecipientFullName(item, formData);
      const possessiveName = formatPossessiveString(fullName);
      return `${possessiveName} income from ${item.payer}`;
    },
    cardDescription: item =>
      isDefined(item?.grossMonthlyIncome) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Income type:{' '}
            <span className="vads-u-font-weight--bold">
              {incomeTypeEarnedLabels[item.incomeType]}
            </span>
          </li>
          <li>
            Gross monthly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.grossMonthlyIncome)}
            </span>
          </li>

          {showUpdatedContent() && (
            <li>
              Current value of the account:{' '}
              <span className="vads-u-font-weight--bold">
                {formatCurrency(item.accountValue)}
              </span>
            </li>
          )}
        </ul>
      ),
    reviewAddButtonText: 'Add another financial account',
    alertItemUpdated: 'Your financial account information has been updated',
    alertItemDeleted: 'Your financial account information has been deleted',
    cancelAddTitle: 'Cancel adding this financial account',
    cancelAddButtonText: 'Cancel adding this financial account',
    cancelAddYes: 'Yes, cancel adding this financial account',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this financial account',
    cancelEditYes: 'Yes, cancel editing this financial account',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this financial account',
    deleteYes: 'Yes, delete this financial account',
    deleteNo: 'No',
    deleteDescription: props =>
      generateDeleteDescription(props, options.text.getItemName),
  },
};
const updatedTitleNoItems =
  'Are you or your dependents receiving or expecting to receive any income in the next 12 months from financial accounts?';
const updatedTitleWithItems = 'Do you have more financial accounts to report?';
const summaryTitle = 'Income and net worth associated with financial accounts';
const schema = {
  type: 'object',
  properties: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoSchema,
  },
  required: ['view:isAddingAssociatedIncomes'],
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you or your dependents receiving or expecting to receive any income in the next 12 months that is related to financial accounts?',
        hint: 'If yes, you’ll need to report at least one income',
        labels: yesNoLabels,
      },
      {
        title: showUpdatedContent()
          ? 'Do you have more financial accounts to report?'
          : 'Do you have more recurring income to report?',
        labels: yesNoLabels,
      },
    ),
  },
  schema,
};

const updatedSummaryPage = {
  uiSchema: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
        labels: yesNoLabelsIncome,
      },
      {
        title: updatedTitleWithItems,
        labels: yesNoLabels,
      },
    ),
  },
  schema,
};

const spouseSummaryPage = {
  uiSchema: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint: 'Your dependents include children who you financially support.',
        labels: yesNoLabelsIncome,
      },
      {
        title: updatedTitleWithItems,
        labels: yesNoLabels,
      },
    ),
  },
  schema,
};

const childSummaryPage = {
  uiSchema: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you receiving or expecting to receive any income in the next 12 months from financial accounts?',
        hint: null,
        labels: yesNoLabelsIncome,
      },
      {
        title: updatedTitleWithItems,
        labels: yesNoLabels,
      },
    ),
  },
  schema,
};

const parentSummaryPage = {
  uiSchema: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
        labels: yesNoLabelsIncome,
      },
      {
        title: updatedTitleWithItems,
        labels: yesNoLabels,
      },
    ),
  },
  schema,
};

const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and the Veteran’s children who you financially support.',
        labels: yesNoLabelsIncome,
      },
      {
        title: updatedTitleWithItems,
        labels: yesNoLabels,
      },
    ),
  },
  schema,
};

/** @returns {PageSchema} */
const veteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Financial account relationship',
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
      'associatedIncomes',
    ),
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
      title: 'Financial account relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: Object.fromEntries(
        Object.entries(relationshipLabels)
          .filter(
            ([key]) =>
              key !== 'VETERAN' && key !== 'PARENT' && key !== 'CUSTODIAN',
          )
          .map(([key, value]) => [
            key,
            key === 'SPOUSE' ? 'Surviving spouse' : value,
          ]),
      ),
      descriptions: Object.fromEntries(
        Object.entries(relationshipLabelDescriptions).filter(
          ([key]) => key === 'CHILD',
        ),
      ),
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'associatedIncomes',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(
        Object.keys(relationshipLabels).filter(
          key => key !== 'VETERAN' && key !== 'PARENT' && key !== 'CUSTODIAN',
        ),
      ),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

const custodianIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Financial account relationship',
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
      'associatedIncomes',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema([
        'CUSTODIAN',
        'SPOUSE',
        'CHILD',
        'OTHER',
      ]),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

const parentIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Financial account relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...sharedRecipientRelationshipBase,
      labels: parentRelationshipLabels,
      descriptions: parentRelationshipLabelDescriptions,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'associatedIncomes',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      recipientRelationship: radioSchema(['PARENT', 'SPOUSE', 'OTHER']),
      otherRecipientRelationshipType: { type: 'string' },
    },
    required: ['recipientRelationship'],
  },
};

/** @returns {PageSchema} */
const incomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Financial account relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who receives the income?',
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'associatedIncomes',
    ),
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
        : 'Financial account recipient',
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
const incomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      showUpdatedContent()
        ? 'Financial account information'
        : 'Financial account type',
    ),
    incomeType: radioUI({
      title: showUpdatedContent()
        ? 'What type of income is generated by this financial account?'
        : 'What is the type of income earned?',
      labels: incomeTypeEarnedLabels,
    }),
    otherIncomeType: {
      'ui:title': showUpdatedContent()
        ? 'Describe the type of income'
        : 'Tell us the type of income',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'incomeType',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': (formData, index) =>
        otherIncomeTypeExplanationRequired(
          formData,
          index,
          'associatedIncomes',
        ),
    },
    grossMonthlyIncome: currencyUI(
      showUpdatedContent()
        ? {
            title:
              'What’s the gross monthly income from this financial account?',
            hint:
              'Gross income is income before taxes and any other deductions.',
          }
        : 'Gross monthly income',
    ),
    accountValue: currencyUI(
      showUpdatedContent()
        ? 'What’s the current value of the account?'
        : 'Value of account',
    ),
    payer: textUI(
      showUpdatedContent()
        ? {
            title: 'Who pays the income?',
            hint: 'Name of business, financial institution, or program',
          }
        : {
            title: 'Income payer name',
            hint: 'Name of business, financial institution, or program, etc.',
          },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      incomeType: radioSchema(Object.keys(incomeTypeEarnedLabels)),
      otherIncomeType: { type: 'string' },
      grossMonthlyIncome: currencySchema,
      accountValue: currencySchema,
      payer: textSchema,
    },
    required: ['incomeType', 'grossMonthlyIncome', 'accountValue', 'payer'],
  },
};

export const associatedIncomePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    associatedIncomePagesUpdatedSummary: pageBuilder.summaryPage({
      title: summaryTitle,
      path: 'financial-accounts-summary-updated',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: updatedSummaryPage.uiSchema,
      schema: updatedSummaryPage.schema,
    }),
    associatedIncomePagesSpouseSummary: pageBuilder.summaryPage({
      title: summaryTitle,
      path: 'financial-accounts-summary-spouse',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseSummaryPage.uiSchema,
      schema: spouseSummaryPage.schema,
    }),
    associatedIncomePagesChildSummary: pageBuilder.summaryPage({
      title: summaryTitle,
      path: 'financial-accounts-summary-child',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: childSummaryPage.uiSchema,
      schema: childSummaryPage.schema,
    }),
    associatedIncomePagesCustodianSummary: pageBuilder.summaryPage({
      title: summaryTitle,
      path: 'financial-accounts-summary-custodian',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: parentSummaryPage.uiSchema,
      schema: parentSummaryPage.schema,
    }),
    associatedIncomePagesParentSummary: pageBuilder.summaryPage({
      title: summaryTitle,
      path: 'financial-accounts-summary-parent',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: custodianSummaryPage.uiSchema,
      schema: custodianSummaryPage.schema,
    }),
    // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
    associatedIncomePagesSummary: pageBuilder.summaryPage({
      title: summaryTitle,
      path: 'financial-accounts-summary',
      depends: () => !showUpdatedContent(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomeVeteranRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription />
      ) : null,
      title: 'Financial account recipient',
      path: 'financial-accounts/:index/veteran-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranIncomeRecipientPage.uiSchema,
      schema: veteranIncomeRecipientPage.schema,
    }),
    associatedIncomeSpouseRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription />
      ) : null,
      title: 'Financial account recipient',
      path: 'financial-accounts/:index/spouse-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseIncomeRecipientPage.uiSchema,
      schema: spouseIncomeRecipientPage.schema,
    }),
    associatedIncomeCustodianRecipientPage: pageBuilder.itemPage({
      title: 'Financial account recipient',
      path: 'financial-accounts/:index/custodian-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianIncomeRecipientPage.uiSchema,
      schema: custodianIncomeRecipientPage.schema,
    }),
    associatedIncomeParentRecipientPage: pageBuilder.itemPage({
      title: 'Financial account recipient',
      path: 'financial-accounts/:index/parent-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentIncomeRecipientPage.uiSchema,
      schema: parentIncomeRecipientPage.schema,
    }),
    associatedIncomeRecipientPage: pageBuilder.itemPage({
      title: 'Financial account recipient',
      path: 'financial-accounts/:index/income-recipient',
      depends: formData =>
        !showUpdatedContent() || formData.claimantType === 'CHILD',
      uiSchema: incomeRecipientPage.uiSchema,
      schema: incomeRecipientPage.schema,
    }),
    associatedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: 'Financial account recipient name',
      path: 'financial-accounts/:index/recipient-name',
      depends: (formData, index) =>
        recipientNameRequired(formData, index, 'associatedIncomes'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    associatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Financial account type',
      path: 'financial-accounts/:index/income-type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
  }),
);
