import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currencyUI,
  currencySchema,
  currentOrPastDateSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateDate } from 'platform/forms-system/src/js/validation';
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
  sharedYesNoOptionsBase,
  showUpdatedContent,
} from '../../../helpers';
import {
  custodianRelationshipLabels,
  parentRelationshipLabels,
  relationshipLabelDescriptions,
  relationshipLabels,
  spouseRelationshipLabels,
} from '../../../labels';
import { WaivedIncomeSummaryDescription } from '../../../components/SummaryDescriptions';
import { DependentDescription } from '../../../components/DependentDescription';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'incomeReceiptWaivers',
  nounSingular: 'waived income',
  nounPlural: 'waived income',
  required: false,
  isItemIncomplete: item =>
    updatedIsRecipientInfoIncomplete(item) ||
    !isDefined(item.payer) ||
    !isDefined(item.waivedGrossMonthlyIncome), // include all required fields here
  text: {
    summaryTitle: 'Review  waived income',
    summaryTitleWithoutItems: showUpdatedContent() ? 'Waived income' : null,
    summaryDescriptionWithoutItems: showUpdatedContent()
      ? WaivedIncomeSummaryDescription
      : null,
    getItemName: (item, index, formData) => {
      if (!isDefined(item?.recipientRelationship)) {
        return undefined;
      }
      const fullName = updatedResolveRecipientFullName(item, formData);
      const possessiveName = formatPossessiveString(fullName);
      return `${possessiveName} waived income from ${item.payer}`;
    },
    cardDescription: item =>
      isDefined(item?.waivedGrossMonthlyIncome) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Waived gross monthly income:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.waivedGrossMonthlyIncome)}
            </span>
          </li>
          {item?.['view:paymentsWillResume'] && (
            <>
              <li>
                Date payments resume:{' '}
                <span className="vads-u-font-weight--bold">
                  {formatDateLong(item.paymentResumeDate)}
                </span>
              </li>
              <li>
                Amount expected to receive:{' '}
                <span className="vads-u-font-weight--bold">
                  {formatCurrency(item.expectedIncome)}
                </span>
              </li>
            </>
          )}
        </ul>
      ),
    reviewAddButtonText: props => `Add ${props.nounSingular}`,
    alertItemUpdated: 'Your waived income information has been updated',
    alertItemDeleted: 'Your waived income information has been deleted',
    cancelAddTitle: 'Cancel adding this waived income',
    cancelAddButtonText: 'Cancel adding this waived income',
    cancelAddYes: 'Yes, cancel adding this waived income',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this waived income',
    cancelEditYes: 'Yes, cancel editing this waived income',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this waived income',
    deleteYes: 'Yes, delete this waived income',
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
  'Do you or your dependents plan to waive any income in the next 12 months?';
const updatedTitleWithItems = 'Do you have more waived income to report?';
const summaryPageTitle = 'Waived income';
const incomeRecipientPageTitle = 'Waived income relationship';
const yesNoOptionLabels = {
  Y: 'Yes, I have waived income to report',
  N: 'No, I don’t have waived income to report',
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Did you or your dependents waive or expect to waive any receipt of income in the next 12 months?',
        hint: 'If yes, you’ll need to report at least one waived income',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have more waived income to report?',
        ...sharedYesNoOptionsBase,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingIncomeReceiptWaivers'],
  },
};

const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
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
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
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
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
      options,
      {
        title: 'Do you plan to waive any income in the next 12 months?',
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
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
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
    'view:isAddingIncomeReceiptWaivers': arrayBuilderYesNoUI(
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
  title: 'Who has waived income to report?',
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
      'incomeReceiptWaivers',
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
      'incomeReceiptWaivers',
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
      'incomeReceiptWaivers',
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
      'incomeReceiptWaivers',
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
      title: 'Who has waived income to report?',
      ...sharedYesNoOptionsBase,
      labels: relationshipLabels,
    }),
    otherRecipientRelationshipType: otherRecipientRelationshipTypeUI(
      'incomeReceiptWaivers',
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
    ...arrayBuilderItemSubsequentPageTitleUI('Name of waived income recipient'),
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
const incomePayerPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income payer'),
    payer: textUI({
      title: 'Who pays this waived income?',
      hint: 'Name of business or financial institution',
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
const incomeAmountPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income amount'),
    waivedGrossMonthlyIncome: currencyUI({
      title: 'What’s the gross monthly amount of this waived income?',
      hint: 'Gross income is income before taxes and any other deductions.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      waivedGrossMonthlyIncome: currencySchema,
    },
    required: ['waivedGrossMonthlyIncome'],
  },
};

/** @returns {PageSchema} */
const paymentsWillResumePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income payments'),
    'view:paymentsWillResume': yesNoUI({
      title: 'Will payments from this waived income start again?',
      ...sharedYesNoOptionsBase,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:paymentsWillResume': yesNoSchema,
    },
    required: ['view:paymentsWillResume'],
  },
};

/** @returns {PageSchema} */
const incomeDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income date'),
    paymentResumeDate: {
      'ui:title': 'When will the payments start again?',
      'ui:webComponentField': VaMemorableDateField,
      'ui:validations': [validateDate],
      'ui:errorMessages': {
        pattern: 'Please enter a valid date',
        required: 'Please enter a date',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      paymentResumeDate: currentOrPastDateSchema,
    },
    required: ['paymentResumeDate'],
  },
};

/** @returns {PageSchema} */
const expectedIncomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Waived income amount'),
    expectedIncome: currencyUI('How much will the payments be?'),
  },
  schema: {
    type: 'object',
    properties: {
      expectedIncome: currencySchema,
    },
    required: ['expectedIncome'],
  },
};

export const incomeReceiptWaiverPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    incomeReceiptWaiverPagesVeteranSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'waived-income-summary-veteran',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    incomeReceiptWaiverPagesSpouseSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'waived-income-summary-spouse',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    incomeReceiptWaiverPagesChildSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'waived-income-summary-child',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: childSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    incomeReceiptWaiverPagesCustodianSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'waived-income-summary-custodian',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    incomeReceiptWaiverPagesParentSummary: pageBuilder.summaryPage({
      title: summaryPageTitle,
      path: 'waived-income-summary-parent',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentSummaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
    incomeReceiptWaiverPagesSummary: pageBuilder.summaryPage({
      title: 'Waived income',
      path: 'waived-income-summary',
      depends: () => !showUpdatedContent(),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    incomeReceiptWaiverVeteranRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="VETERAN" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'waived-income/:index/veteran-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'VETERAN',
      uiSchema: veteranIncomeRecipientPage.uiSchema,
      schema: veteranIncomeRecipientPage.schema,
    }),
    incomeReceiptWaiverSpouseRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="SPOUSE" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'waived-income/:index/spouse-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'SPOUSE',
      uiSchema: spouseIncomeRecipientPage.uiSchema,
      schema: spouseIncomeRecipientPage.schema,
    }),
    incomeReceiptWaiverCustodianRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="CUSTODIAN" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'waived-income/:index/custodian-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
      uiSchema: custodianIncomeRecipientPage.uiSchema,
      schema: custodianIncomeRecipientPage.schema,
    }),
    incomeReceiptWaiverParentRecipientPage: pageBuilder.itemPage({
      ContentBeforeButtons: showUpdatedContent() ? (
        <DependentDescription claimantType="PARENT" />
      ) : null,
      title: incomeRecipientPageTitle,
      path: 'waived-income/:index/parent-income-recipient',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'PARENT',
      uiSchema: parentIncomeRecipientPage.uiSchema,
      schema: parentIncomeRecipientPage.schema,
    }),
    incomeReceiptWaiverNonVeteranRecipientPage: pageBuilder.itemPage({
      title: incomeRecipientPageTitle,
      path: 'waived-income/:index/relationship',
      depends: () => !showUpdatedContent(),
      uiSchema: nonVeteranIncomeRecipientPage.uiSchema,
      schema: nonVeteranIncomeRecipientPage.schema,
    }),
    // When claimantType is 'CHILD' we skip showing the recipient page entirely
    // To preserve required data, we auto-set recipientRelationship to 'CHILD'
    waivedIncomeChildRecipientNamePage: pageBuilder.itemPage({
      title: 'Waived income recipient name',
      path: 'waived-income/:index/recipient-name-updated',
      depends: formData =>
        showUpdatedContent() && formData.claimantType === 'CHILD',
      uiSchema: {
        ...recipientNamePage.uiSchema,
        'ui:options': {
          updateSchema: (formData, formSchema, _uiSchema, index) => {
            const arrayData = formData?.incomeReceiptWaivers || [];
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
    incomeReceiptWaiverRecipientNamePage: pageBuilder.itemPage({
      title: 'Waived income recipient name',
      path: 'waived-income/:index/recipient-name',
      depends: (formData, index) =>
        (!showUpdatedContent() || formData.claimantType !== 'CHILD') &&
        updatedRecipientNameRequired(formData, index, 'incomeReceiptWaivers'),
      uiSchema: recipientNamePage.uiSchema,
      schema: recipientNamePage.schema,
    }),
    incomeReceiptWaiverPayerPage: pageBuilder.itemPage({
      title: 'Waived income payer',
      path: 'waived-income/:index/payer',
      uiSchema: incomePayerPage.uiSchema,
      schema: incomePayerPage.schema,
    }),
    incomeReceiptWaiverGrossAmountPage: pageBuilder.itemPage({
      title: 'Waived income gross amount',
      path: 'waived-income/:index/gross-amount',
      uiSchema: incomeAmountPage.uiSchema,
      schema: incomeAmountPage.schema,
    }),
    incomeReceiptWaiverPaymentsPage: pageBuilder.itemPage({
      title: 'Waived income payments',
      path: 'waived-income/:index/payments',
      uiSchema: paymentsWillResumePage.uiSchema,
      schema: paymentsWillResumePage.schema,
    }),
    incomeReceiptWaiverDatePage: pageBuilder.itemPage({
      title: 'Waived income date',
      path: 'waived-income/:index/date',
      depends: (formData, index) =>
        formData.incomeReceiptWaivers?.[index]?.['view:paymentsWillResume'],
      uiSchema: incomeDatePage.uiSchema,
      schema: incomeDatePage.schema,
    }),
    incomeReceiptWaiverExpectedAmountPage: pageBuilder.itemPage({
      title: 'Waived income expected amount',
      path: 'waived-income/:index/expected-amount',
      depends: (formData, index) =>
        formData.incomeReceiptWaivers?.[index]?.['view:paymentsWillResume'],
      uiSchema: expectedIncomePage.uiSchema,
      schema: expectedIncomePage.schema,
    }),
  }),
);
