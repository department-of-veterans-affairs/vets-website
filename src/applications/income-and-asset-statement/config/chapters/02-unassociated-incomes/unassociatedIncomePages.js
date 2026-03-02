import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { UnassociatedIncomeSummaryDescription } from '../../../components/SummaryDescriptions';
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
  sharedRecipientRelationshipBase,
  sharedYesNoOptionsBase,
  recipientNameRequired,
  resolveRecipientFullName,
  requireExpandedArrayField,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  incomeTypeLabels,
  parentRelationshipLabels,
  relationshipLabelDescriptions,
  relationshipLabels,
  spouseRelationshipLabels,
} from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'unassociatedIncomes',
  nounSingular: 'recurring income',
  nounPlural: 'recurring income',
  required: false,
  isItemIncomplete: item =>
    isRecipientInfoIncomplete(item) ||
    isIncomeTypeInfoIncomplete(item) ||
    !isDefined(item?.grossMonthlyIncome) ||
    !isDefined(item?.payer), // include all required fields here
  text: {
    summaryTitle: 'Review recurring income',
    summaryTitleWithoutItems:
      'Recurring income that’s not from an account or property',
    summaryDescriptionWithoutItems: UnassociatedIncomeSummaryDescription,
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
              {incomeTypeLabels[item.incomeType]}
            </span>
          </li>
          <li>
            Gross monthly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.grossMonthlyIncome)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: props => `Add ${props.nounSingular}`,
    alertItemUpdated: 'Your recurring income information has been updated',
    alertItemDeleted: 'Your recurring income information has been deleted',
    cancelAddTitle: 'Cancel adding this recurring income',
    cancelAddButtonText: 'Cancel adding this income',
    cancelAddYes: 'Yes, cancel adding this recurring income',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this recurring income',
    cancelEditYes: 'Yes, cancel editing this recurring income',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this recurring income',
    deleteYes: 'Yes, delete this recurring income',
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
  'Will you or your dependents receive any income in the next year from sources other than bank accounts or property?';
const titleWithItems = 'Do you have more recurring income to report?';
const summaryPageTitle = 'Recurring income';
const incomeRecipientPageTitle = 'Recurring income recipient';
const yesNoOptionLabels = {
  Y: 'Yes, I have recurring income to report',
  N: 'No, I don’t have recurring income to report',
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
      'view:isAddingUnassociatedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingUnassociatedIncomes'],
  },
};

/** @returns {PageSchema} */
const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
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
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
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
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Will you receive any income in the next year from sources other than bank accounts or property?',
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

const parentSummaryPage = {
  uiSchema: {
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
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
const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
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
const veteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Recurring income relationship',
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
      'unassociatedIncomes',
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
      title: 'Recurring income relationship',
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
      'unassociatedIncomes',
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
      title: 'Recurring income relationship',
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
      'unassociatedIncomes',
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
      title: 'Recurring income relationship',
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
      'unassociatedIncomes',
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
const incomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income information'),
    incomeType: radioUI({
      title: 'What type of income is it?',
      labels: incomeTypeLabels,
    }),
    otherIncomeType: {
      'ui:title': 'Describe the type of income',
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
          'unassociatedIncomes',
        ),
    },
    grossMonthlyIncome: currencyUI({
      title: `What's the gross monthly income from this financial account?`,
      hint: 'Gross income is income before taxes and any other deductions.',
    }),
    payer: textUI({
      title: 'Who pays the income?',
      hint: 'Name of business, agency, or program',
    }),
    'ui:options': {
      ...requireExpandedArrayField('otherIncomeType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      incomeType: radioSchema(Object.keys(incomeTypeLabels)),
      otherIncomeType: { type: 'string' },
      grossMonthlyIncome: currencySchema,
      payer: textSchema,
    },
    required: ['incomeType', 'grossMonthlyIncome', 'payer'],
  },
};

export const unassociatedIncomePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    unassociatedIncomePagesVeteranSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'recurring-income-summary-veteran',
      depends: formData => formData.claimantType === 'VETERAN',
      uiSchema: veteranSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomePagesSpouseSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'recurring-income-summary-spouse',
      depends: formData => formData.claimantType === 'SPOUSE',
      uiSchema: spouseSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomePagesChildSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'recurring-income-summary-child',
      depends: formData => formData.claimantType === 'CHILD',
      uiSchema: childSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomePagesCustodianSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'recurring-income-summary-custodian',
      depends: formData => formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomePagesParentSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'recurring-income-summary-parent',
      depends: formData => formData.claimantType === 'PARENT',
      uiSchema: parentSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomeVeteranRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: <DependentDescription claimantType="VETERAN" />,
      title: incomeRecipientPageTitle,
      path: 'recurring-income/:index/veteran-income-recipient',
      depends: formData => formData.claimantType === 'VETERAN',
      uiSchema: veteranIncomeRecipientPage.uiSchema,
      schema: veteranIncomeRecipientPage.schema,
    }),
    unassociatedIncomeSpouseRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: <DependentDescription claimantType="SPOUSE" />,
      title: incomeRecipientPageTitle,
      path: 'recurring-income/:index/spouse-income-recipient',
      depends: formData => formData.claimantType === 'SPOUSE',
      uiSchema: spouseIncomeRecipientPage.uiSchema,
      schema: spouseIncomeRecipientPage.schema,
    }),
    unassociatedIncomeCustodianRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: <DependentDescription claimantType="CUSTODIAN" />,
      title: incomeRecipientPageTitle,
      path: 'recurring-income/:index/custodian-income-recipient',
      depends: formData => formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianIncomeRecipientPage.uiSchema,
      schema: custodianIncomeRecipientPage.schema,
    }),
    unassociatedIncomeParentRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: <DependentDescription claimantType="PARENT" />,
      title: incomeRecipientPageTitle,
      path: 'recurring-income/:index/parent-income-recipient',
      depends: formData => formData.claimantType === 'PARENT',
      uiSchema: parentIncomeRecipientPage.uiSchema,
      schema: parentIncomeRecipientPage.schema,
    }),
    // When claimantType is 'CHILD' we skip showing the recipient page entirely
    // To preserve required data, we auto-set recipientRelationship to 'CHILD'
    unassociatedIncomeChildRecipientNamePage: pageBuilder.itemPage({
      title: incomeRecipientPageTitle,
      path: 'recurring-income/:index/recipient-name-updated',
      depends: formData => formData.claimantType === 'CHILD',
      uiSchema: {
        ...recipientNamePage.uiSchema,
        'ui:options': {
          updateSchema: (formData, formSchema, _uiSchema, index) => {
            const arrayData = formData?.unassociatedIncomes || [];
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
    unassociatedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: incomeRecipientPageTitle,
      path: 'recurring-income/:index/recipient-name',
      depends: (formData, index) =>
        formData.claimantType !== 'CHILD' &&
        recipientNameRequired(formData, index, 'unassociatedIncomes'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    unassociatedIncomeTypePage: pageBuilder.itemPage({
      title: 'Recurring income type',
      path: 'recurring-income/:index/income-type',
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
  }),
);
