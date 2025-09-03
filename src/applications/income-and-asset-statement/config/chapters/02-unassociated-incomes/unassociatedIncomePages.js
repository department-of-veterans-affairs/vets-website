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
import { SummaryDescription } from '../../../components/RecurringIncomeSummaryDescription';
import { DependentDescription } from '../../../components/DependentDescription';
import {
  formatCurrency,
  formatPossessiveString,
  fullNameUIHelper,
  generateDeleteDescription,
  isDefined,
  isIncomeTypeInfoIncomplete,
  updatedIsRecipientInfoIncomplete,
  otherIncomeTypeExplanationRequired,
  otherRecipientRelationshipTypeUI,
  updatedRecipientNameRequired,
  updatedResolveRecipientFullName,
  sharedRecipientRelationshipBase,
  showUpdatedContent,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  incomeTypeLabels,
  parentRelationshipLabels,
  updatedIncomeTypeLabels,
  relationshipLabelDescriptions,
  relationshipLabels,
} from '../../../labels';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'unassociatedIncomes',
  nounSingular: 'recurring income',
  nounPlural: 'recurring income',
  required: false,
  isItemIncomplete: item =>
    updatedIsRecipientInfoIncomplete(item) ||
    isIncomeTypeInfoIncomplete(item) ||
    !isDefined(item?.grossMonthlyIncome) ||
    !isDefined(item?.payer), // include all required fields here
  text: {
    summaryTitle: 'Review recurring income',
    summaryTitleWithoutItems: showUpdatedContent()
      ? 'Recurring income that’s not from an account or property'
      : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? SummaryDescription
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
              {
                (showUpdatedContent()
                  ? updatedIncomeTypeLabels
                  : incomeTypeLabels)[item.incomeType]
              }
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
    reviewAddButtonText: 'Add another recurring income',
    alertItemUpdated: 'Your recurring income information has been updated',
    alertItemDeleted: 'Your recurring income information has been deleted',
    cancelAddTitle: 'Cancel adding this recurring income',
    cancelAddButtonText: showUpdatedContent()
      ? 'Cancel adding this income'
      : 'Cancel adding this recurring income',
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

const yesNoOptionLabels = {
  Y: 'Yes, I have recurring income to report',
  N: 'No, I don’t have recurring income to report',
};

const sharedYesNoOptionsBase = {
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '3',
};

const yesNoOptionsMore = {
  title: 'Do you have more recurring income to report?',
  ...sharedYesNoOptionsBase,
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Are you or your dependents receiving or expecting to receive any income in the next 12 months from sources not related to an account or your assets?',
        hint: 'If yes, you’ll need to report at least one income',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      yesNoOptionsMore,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingUnassociatedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingUnassociatedIncomes'],
  },
};

/** @returns {PageSchema} */
const updatedSummaryPage = {
  uiSchema: {
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Will you or your dependents receive any income in the next year from sources other than bank accounts or property?',
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
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
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Will you or your dependents receive any income in the next year from sources other than bank accounts or property?',
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
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Will you receive any income in the next year from sources other than bank accounts or property?',
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
    'view:isAddingUnassociatedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Will you or your dependents receive any income in the next year from sources other than bank accounts or property?',
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
      'unassociatedIncomes',
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
const nonVeteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Recurring income relationship',
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who receives the income?',
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'unassociatedIncomes',
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
        : 'Recurring income recipient',
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
      showUpdatedContent() ? 'Income information' : 'Recurring income type',
    ),
    incomeType: radioUI({
      title: showUpdatedContent()
        ? 'What type of income is it?'
        : 'What is the type of income?',
      labels: showUpdatedContent() ? updatedIncomeTypeLabels : incomeTypeLabels,
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
          'unassociatedIncomes',
        ),
    },
    grossMonthlyIncome: currencyUI(
      showUpdatedContent()
        ? {
            title: `What's the gross monthly income from this financial account?`,
            hint:
              'Gross income is income before taxes and any other deductions.',
          }
        : 'Gross monthly income',
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
  },
  schema: {
    type: 'object',
    properties: {
      incomeType: radioSchema(
        Object.keys(
          showUpdatedContent() ? updatedIncomeTypeLabels : incomeTypeLabels,
        ),
      ),
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
    unassociatedIncomePagesUpdatedSummary: pageBuilder.summaryPage({
      title: 'Recurring income',
      path: 'recurring-income-summary-updated',
      depends: formData =>
        showUpdatedContent() &&
        formData.claimantType !== 'SPOUSE' &&
        formData.claimantType !== 'CHILD' &&
        formData.claimantType !== 'CUSTODIAN',
      uiSchema: updatedSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomePagesUpdatedSpouseSummary: pageBuilder.summaryPage({
      title: 'Recurring income',
      path: 'recurring-income-summary-spouse',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: updatedSpouseSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomePagesUpdatedChildSummary: pageBuilder.summaryPage({
      title: 'Recurring income',
      path: 'recurring-income-summary-child',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: updatedChildSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomePagesUpdatedCustodianSummary: pageBuilder.summaryPage({
      title: 'Recurring income',
      path: 'recurring-income-summary-custodian',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: updatedCustodianSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
    unassociatedIncomePagesSummary: pageBuilder.summaryPage({
      title: 'Recurring income',
      path: 'recurring-income-summary',
      depends: () => !showUpdatedContent(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    unassociatedIncomeVeteranRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription />
      ) : null,
      title: 'Recurring income recipient',
      path: 'recurring-income/:index/veteran-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranIncomeRecipientPage.uiSchema,
      schema: veteranIncomeRecipientPage.schema,
    }),
    unassociatedIncomeSpouseRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription />
      ) : null,
      title: 'Recurring income recipient',
      path: 'recurring-income/:index/spouse-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseIncomeRecipientPage.uiSchema,
      schema: spouseIncomeRecipientPage.schema,
    }),
    unassociatedIncomeCustodianRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription />
      ) : null,
      title: 'Recurring income recipient',
      path: 'recurring-income/:index/custodian-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianIncomeRecipientPage.uiSchema,
      schema: custodianIncomeRecipientPage.schema,
    }),
    unassociatedIncomeParentRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription />
      ) : null,
      title: 'Recurring income recipient',
      path: 'recurring-income/:index/parent-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentIncomeRecipientPage.uiSchema,
      schema: parentIncomeRecipientPage.schema,
    }),
    unassociatedIncomeNonVeteranRecipientPage: pageBuilder.itemPage({
      title: 'Recurring income recipient',
      path: 'recurring-income/:index/income-recipient',
      depends: formData =>
        !showUpdatedContent() ||
        (showUpdatedContent() && formData.claimantType === 'CHILD'),
      uiSchema: nonVeteranIncomeRecipientPage.uiSchema,
      schema: nonVeteranIncomeRecipientPage.schema,
    }),
    unassociatedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: 'Recurring income recipient',
      path: 'recurring-income/:index/recipient-name',
      depends: (formData, index) =>
        updatedRecipientNameRequired(formData, index, 'unassociatedIncomes'),
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
