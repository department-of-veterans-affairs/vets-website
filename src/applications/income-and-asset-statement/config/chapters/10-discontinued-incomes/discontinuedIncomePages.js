import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatDateLong } from 'platform/utilities/date';
import {
  formatCurrency,
  formatPossessiveString,
  fullNameUIHelper,
  generateDeleteDescription,
  isDefined,
  updatedIsRecipientInfoIncomplete,
  otherRecipientRelationshipTypeUI,
  updatedRecipientNameRequired,
  requireExpandedArrayField,
  updatedResolveRecipientFullName,
  sharedRecipientRelationshipBase,
  showUpdatedContent,
  sharedYesNoOptionsBase,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  discontinuedIncomeTypeLabels,
  incomeFrequencyLabels,
  updatedIncomeFrequencyLabels,
  parentRelationshipLabels,
  relationshipLabelDescriptions,
  relationshipLabels,
  spouseRelationshipLabels,
} from '../../../labels';
import { DiscontinuedIncomeSummaryDescription } from '../../../components/SummaryDescriptions';
import { DependentDescription } from '../../../components/DependentDescription';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'discontinuedIncomes',
  nounSingular: 'discontinued income',
  nounPlural: 'discontinued income',
  required: false,
  isItemIncomplete: item =>
    updatedIsRecipientInfoIncomplete(item) ||
    !isDefined(item.payer) ||
    !isDefined(item?.incomeType) ||
    (!isDefined(item?.['view:otherIncomeType']) &&
      item?.incomeType === 'OTHER') ||
    !isDefined(item.incomeFrequency) ||
    !isDefined(item.incomeLastReceivedDate) ||
    !isDefined(item.grossAnnualAmount), // include all required fields here
  text: {
    summaryTitle: 'Review  discontinued and irregular income',
    summaryTitleWithoutItems: showUpdatedContent()
      ? 'Discontinued and irregular income'
      : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? DiscontinuedIncomeSummaryDescription
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
      isDefined(item?.grossAnnualAmount) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Income type:{' '}
            <span className="vads-u-font-weight--bold">
              {showUpdatedContent()
                ? discontinuedIncomeTypeLabels[item.incomeType]
                : item.incomeType}
            </span>
          </li>
          <li>
            Date of last payment:{' '}
            <span className="vads-u-font-weight--bold">
              {formatDateLong(item.incomeLastReceivedDate)}
            </span>
          </li>
          <li>
            Income reported to IRS:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.grossAnnualAmount)}
            </span>
          </li>
        </ul>
      ),
    reviewAddButtonText: props => `Add ${props.nounSingular}`,
    alertItemUpdated: 'Your discontinued income information has been updated',
    alertItemDeleted: 'Your discontinued income information has been deleted',
    cancelAddTitle: 'Cancel adding this discontinued income',
    cancelAddButtonText: 'Cancel adding this discontinued income',
    cancelAddYes: 'Yes, cancel adding this discontinued income',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this discontinued income',
    cancelEditYes: 'Yes, cancel editing this discontinued income',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this discontinued income',
    deleteYes: 'Yes, delete this discontinued income',
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
  'Have you or your dependents received income that has ended during the reporting period or in the last full calendar year (if this is your first claim)?';
const updatedTitleWithItems = 'Do you have more discontinued income to report?';
const summaryPageTitle = 'Discontinued and irregular income';
const incomeRecipientPageTitle = 'Discontinued income relationship';
const yesNoOptionLabels = {
  Y: 'Yes, I have income to report',
  N: 'No, I don’t have income to report',
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Did you or your dependents receive income that has stopped or is no longer being received within the last calendar year?',
        hint: 'If yes, you’ll need to report at least one income',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more discontinued incomes to report?',
        ...sharedYesNoOptionsBase,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingDiscontinuedIncomes'],
  },
};

const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
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
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
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
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Have you received income that has ended during the reporting period or in the last full calendar year (if this is your first claim)?',
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

const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
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

const parentSummaryPage = {
  uiSchema: {
    'view:isAddingDiscontinuedIncomes': arrayBuilderYesNoUI(
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

const updatedSharedRecipientRelationshipBase = {
  ...sharedRecipientRelationshipBase,
  title: 'Who received this income?',
};

/** @returns {PageSchema} */
const veteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: incomeRecipientPageTitle,
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...updatedSharedRecipientRelationshipBase,
      labels: Object.fromEntries(
        Object.entries(relationshipLabels).filter(
          ([key]) => key !== 'PARENT' && key !== 'CUSTODIAN',
        ),
      ),
      descriptions: relationshipLabelDescriptions,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'discontinuedIncomes',
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
      title: incomeRecipientPageTitle,
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...updatedSharedRecipientRelationshipBase,
      labels: spouseRelationshipLabels,
      descriptions: Object.fromEntries(
        Object.entries(relationshipLabelDescriptions).filter(
          ([key]) => key === 'CHILD',
        ),
      ),
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'discontinuedIncomes',
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
      title: incomeRecipientPageTitle,
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...updatedSharedRecipientRelationshipBase,
      labels: custodianRelationshipLabels,
      descriptions: Object.fromEntries(
        Object.entries(relationshipLabelDescriptions).filter(
          ([key]) => key !== 'CHILD',
        ),
      ),
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'discontinuedIncomes',
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
      title: incomeRecipientPageTitle,
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      ...updatedSharedRecipientRelationshipBase,
      labels: parentRelationshipLabels,
      descriptions: {
        SPOUSE: 'The Veteran’s other parent should file a separate claim',
      },
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'discontinuedIncomes',
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
const nonVeteranIncomeRecipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: incomeRecipientPageTitle,
      nounSingular: options.nounSingular,
    }),
    recipientRelationship: radioUI({
      title: 'Who received this income?',
      ...sharedYesNoOptionsBase,
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'discontinuedIncomes',
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
      'Name of the person with discontinued and irregular income',
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
const incomeInformationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income information'),
    payer: textUI({
      title: 'Who paid this income?',
      hint: 'Name of business, financial institution, or past employer',
    }),
    incomeType: radioUI({
      title: 'What type of income is it?',
      labels: discontinuedIncomeTypeLabels,
    }),
    'view:otherIncomeType': {
      'ui:title': 'Describe the type of income',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'incomeType',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) => {
        return formData?.discontinuedIncomes?.[index]?.incomeType === 'OTHER';
      },
    },
    'ui:options': {
      ...requireExpandedArrayField('view:otherIncomeType'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      payer: textSchema,
      incomeType: radioSchema(Object.keys(discontinuedIncomeTypeLabels)),
      'view:otherIncomeType': { type: 'string' },
    },
    required: ['payer', 'incomeType'],
  },
};

/** @returns {PageSchema} */
const incomePayerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income payer'),
    payer: textUI({
      title: 'Income payer name',
      hint: 'Name of business, financial institution, etc.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      payer: textSchema,
    },
    required: ['payer'],
  },
};

/** @returns {PageSchema} */
const incomeTypePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income type'),
    incomeType: textUI({
      title: 'What is the type of income received?',
      hint: 'Interest, dividends, etc',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeType: textSchema,
    },
    required: ['incomeType'],
  },
};

/** @returns {PageSchema} */
const incomePaymentPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Payment schedule'),
    incomeFrequency: radioUI({
      title: 'How often was this income received?',
      labels: updatedIncomeFrequencyLabels,
    }),
    incomeLastReceivedDate: currentOrPastDateUI(
      'When was this income last received?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      incomeFrequency: radioSchema(Object.keys(updatedIncomeFrequencyLabels)),
      incomeLastReceivedDate: currentOrPastDateSchema,
    },
    required: ['incomeFrequency', 'incomeLastReceivedDate'],
  },
};

/** @returns {PageSchema} */
const incomeFrequencyPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income frequency'),
    incomeFrequency: radioUI({
      title: 'How often was this income received?',
      labels: incomeFrequencyLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeFrequency: radioSchema(Object.keys(incomeFrequencyLabels)),
    },
    required: ['incomeFrequency'],
  },
};

/** @returns {PageSchema} */
const incomeDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Discontinued income date'),
    incomeLastReceivedDate: currentOrPastDateUI(
      'When was this income last paid?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      incomeLastReceivedDate: currentOrPastDateSchema,
    },
    required: ['incomeLastReceivedDate'],
  },
};

/** @returns {PageSchema} */
const incomeAmountPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Discontinued and irregular income amount',
    ),
    grossAnnualAmount: currencyUI({
      title:
        'What was the gross annual amount reported to the IRS for this income?',
      hint: 'Gross income is income before taxes and any other deductions.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      grossAnnualAmount: currencySchema,
    },
    required: ['grossAnnualAmount'],
  },
};

export const discontinuedIncomePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    discontinuedIncomePagesVeteranSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-income-summary-veteran',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesSpouseSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-income-summary-spouse',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesChildSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-income-summary-child',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: childSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesCustodianSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-income-summary-custodian',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomePagesParentSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'discontinued-income-summary-parent',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
    discontinuedIncomePagesSummary: pageBuilder.summaryPage({
      title: 'Discontinued incomes',
      path: 'discontinued-income-summary',
      depends: () => !showUpdatedContent(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    discontinuedIncomeVeteranRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="VETERAN" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'discontinued-income/:index/veteran-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranIncomeRecipientPage.uiSchema,
      schema: veteranIncomeRecipientPage.schema,
    }),
    discontinuedIncomeSpouseRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="SPOUSE" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'discontinued-income/:index/spouse-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseIncomeRecipientPage.uiSchema,
      schema: spouseIncomeRecipientPage.schema,
    }),
    discontinuedIncomeCustodianRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="CUSTODIAN" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'discontinued-income/:index/custodian-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianIncomeRecipientPage.uiSchema,
      schema: custodianIncomeRecipientPage.schema,
    }),
    discontinuedIncomeParentRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="PARENT" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'discontinued-income/:index/parent-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentIncomeRecipientPage.uiSchema,
      schema: parentIncomeRecipientPage.schema,
    }),
    discontinuedIncomeNonVeteranRecipientPage: pageBuilder.itemPage({
      title: incomeRecipientPageTitle,
      path: 'discontinued-income/:index/income-recipient',
      depends: () => !showUpdatedContent(),
      uiSchema: nonVeteranIncomeRecipientPage.uiSchema,
      schema: nonVeteranIncomeRecipientPage.schema,
    }),
    // When claimantType is 'CHILD' we skip showing the recipient page entirely
    // To preserve required data, we auto-set recipientRelationship to 'CHILD'
    discontinuedIncomeChildRecipientNamePage: pageBuilder.itemPage({
      title: 'Discontinued income recipient name',
      path: 'discontinued-income/:index/recipient-name-updated',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: {
        ...recipientNamePage.uiSchema,
        'ui:options': {
          updateSchema: (formData, formSchema, _uiSchema, index) => {
            const arrayData = formData?.discontinuedIncomes || [];
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
    discontinuedIncomeRecipientNamePage: pageBuilder.itemPage({
      title: 'Discontinued income recipient name',
      path: 'discontinued-income/:index/recipient-name',
      depends: (formData, index) =>
        (!showUpdatedContent() || formData.claimantType !== 'CHILD') &&
        updatedRecipientNameRequired(formData, index, 'discontinuedIncomes'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    discontinuedIncomeInformationPage: pageBuilder.itemPage({
      title: 'Discontinued income information',
      path: 'discontinued-income/:index/information',
      depends: () => showUpdatedContent(),
      uiSchema: incomeInformationPage.uiSchema,
      schema: incomeInformationPage.schema,
    }),
    discontinuedIncomePayerPage: pageBuilder.itemPage({
      title: 'Discontinued income payer',
      path: 'discontinued-income/:index/payer',
      depends: () => !showUpdatedContent(),
      uiSchema: incomePayerPage.uiSchema,
      schema: incomePayerPage.schema,
    }),
    discontinuedIncomeTypePage: pageBuilder.itemPage({
      title: 'Discontinued income type',
      path: 'discontinued-income/:index/type',
      depends: () => !showUpdatedContent(),
      uiSchema: incomeTypePage.uiSchema,
      schema: incomeTypePage.schema,
    }),
    discontinuedIncomePaymentPage: pageBuilder.itemPage({
      title: 'Discontinued income payment',
      path: 'discontinued-income/:index/payment',
      depends: () => showUpdatedContent(),
      uiSchema: incomePaymentPage.uiSchema,
      schema: incomePaymentPage.schema,
    }),
    discontinuedIncomeFrequencyPage: pageBuilder.itemPage({
      title: 'Discontinued income frequency',
      path: 'discontinued-income/:index/frequency',
      depends: () => !showUpdatedContent(),
      uiSchema: incomeFrequencyPage.uiSchema,
      schema: incomeFrequencyPage.schema,
    }),
    discontinuedIncomeDatePage: pageBuilder.itemPage({
      title: 'Discontinued income date',
      path: 'discontinued-income/:index/date',
      depends: () => !showUpdatedContent(),
      uiSchema: incomeDatePage.uiSchema,
      schema: incomeDatePage.schema,
    }),
    discontinuedIncomeAmountPage: pageBuilder.itemPage({
      title: 'Discontinued income amount',
      path: 'discontinued-income/:index/amount',
      uiSchema: incomeAmountPage.uiSchema,
      schema: incomeAmountPage.schema,
    }),
  }),
);
