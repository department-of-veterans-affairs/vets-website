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
import { AssociatedIncomeSummaryDescription } from '../../../components/SummaryDescriptions';
import { DependentDescription } from '../../../components/DependentDescription';
import {
  formatCurrency,
  formatPossessiveString,
  fullNameUIHelper,
  generateDeleteDescription,
  isDefined,
  isIncomeTypeInfoIncomplete,
  otherIncomeTypeExplanationRequired,
  otherRecipientRelationshipTypeUI,
  sharedRecipientRelationshipBase,
  showUpdatedContent,
  sharedYesNoOptionsBase,
  updatedIsRecipientInfoIncomplete,
  updatedRecipientNameRequired,
  updatedResolveRecipientFullName,
  requireExpandedArrayField,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  parentRelationshipLabels,
  parentRelationshipLabelDescriptions,
  relationshipLabels,
  relationshipLabelDescriptions,
  spouseRelationshipLabels,
  incomeTypeEarnedLabels,
} from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'associatedIncomes',
  nounSingular: 'financial account',
  nounPlural: 'financial accounts',
  required: false,
  isItemIncomplete: item =>
    updatedIsRecipientInfoIncomplete(item) ||
    isIncomeTypeInfoIncomplete(item) ||
    !isDefined(item.grossMonthlyIncome) ||
    !isDefined(item.accountValue) ||
    !isDefined(item.payer), // include all required fields here
  text: {
    summaryTitle: 'Review financial account income',
    summaryTitleWithoutItems: showUpdatedContent()
      ? 'Income from financial accounts'
      : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? AssociatedIncomeSummaryDescription
      : null,
    getItemName: (item, index, formData) => {
      if (!isDefined(item?.recipientRelationship) || !isDefined(item?.payer)) {
        return undefined;
      }
      const fullName = updatedResolveRecipientFullName(item, formData);
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
    reviewAddButtonText: props => `Add ${props.nounSingular}`,
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

// We support multiple summary pages (one per claimant type).
// These constants centralize shared text so each summary page stays consistent.
// Important: only one summary page should ever be displayed at a time.

// Shared summary page text
const updatedTitleNoItems =
  'Are you or your dependents receiving or expecting to receive any income in the next 12 months from financial accounts?';
const updatedTitleWithItems = 'Do you have more financial accounts to report?';
const summaryPageTitle =
  'Income and net worth associated with financial accounts';
const incomeRecipientPageTitle = 'Financial account recipient';
const yesNoOptionLabels = {
  Y: 'Yes, I have income to report',
  N: 'No, I don’t have any income to report',
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
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: updatedTitleWithItems,
        ...sharedYesNoOptionsBase,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingAssociatedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingAssociatedIncomes'],
  },
};

const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
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
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
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
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you receiving or expecting to receive any income in the next 12 months from financial accounts?',
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
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
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
    'view:isAddingAssociatedIncomes': arrayBuilderYesNoUI(
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
      title: 'Financial account relationship',
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
      'associatedIncomes',
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
        expandedContentFocus: true,
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
            hint: 'Name of business, agency, or program',
          }
        : {
            title: 'Income payer name',
            hint: 'Name of business, financial institution, or program, etc.',
          },
    ),
    'ui:options': {
      ...requireExpandedArrayField('otherIncomeType'),
    },
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
    associatedIncomePagesVeteranSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'financial-accounts-summary-veteran',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomePagesSpouseSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'financial-accounts-summary-spouse',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomePagesChildSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'financial-accounts-summary-child',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: childSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomePagesCustodianSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'financial-accounts-summary-custodian',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomePagesParentSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'financial-accounts-summary-parent',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
    associatedIncomePagesSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'financial-accounts-summary',
      depends: () => !showUpdatedContent(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    associatedIncomeVeteranRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="VETERAN" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'financial-accounts/:index/veteran-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranIncomeRecipientPage.uiSchema,
      schema: veteranIncomeRecipientPage.schema,
    }),
    associatedIncomeSpouseRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="SPOUSE" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'financial-accounts/:index/spouse-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseIncomeRecipientPage.uiSchema,
      schema: spouseIncomeRecipientPage.schema,
    }),
    associatedIncomeCustodianRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="CUSTODIAN" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'financial-accounts/:index/custodian-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianIncomeRecipientPage.uiSchema,
      schema: custodianIncomeRecipientPage.schema,
    }),
    associatedIncomeParentRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="PARENT" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'financial-accounts/:index/parent-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentIncomeRecipientPage.uiSchema,
      schema: parentIncomeRecipientPage.schema,
    }),
    associatedIncomeRecipientPage: pageBuilder.itemPage({
      title: incomeRecipientPageTitle,
      path: 'financial-accounts/:index/income-recipient',
      depends: () => !showUpdatedContent(),
      uiSchema: incomeRecipientPage.uiSchema,
      schema: incomeRecipientPage.schema,
    }),
    // When claimantType is 'CHILD' we skip showing the recipient page entirely
    // To preserve required data, we auto-set recipientRelationship to 'CHILD'
    associatedIncomeChildRecipientNamePage: pageBuilder.itemPage({
      title: incomeRecipientPageTitle,
      path: 'financial-accounts/:index/recipient-name-updated',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: {
        ...recipientNamePage.uiSchema,
        'ui:options': {
          updateSchema: (formData, formSchema, _uiSchema, index) => {
            const arrayData = formData?.associatedIncomes || [];
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
    associatedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: 'Financial account recipient name',
      path: 'financial-accounts/:index/recipient-name',
      depends: (formData, index) =>
        (!showUpdatedContent() || formData.claimantType !== 'CHILD') &&
        updatedRecipientNameRequired(formData, index, 'associatedIncomes'),
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
