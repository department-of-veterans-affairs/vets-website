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
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatDateLong } from 'platform/utilities/date';
import {
  annualReceivedIncomeFromAnnuityRequired,
  formatCurrency,
  generateDeleteDescription,
  isDefined,
  surrenderValueRequired,
  sharedYesNoOptionsBase,
  showUpdatedContent,
  requireExpandedArrayField,
} from '../../../helpers';
import { DependentDescription } from '../../../components/DependentDescription';

const customDependentDescription = props => {
  return props.formData.annuities ? <></> : <DependentDescription />; // render the dependent description component if no annuities are present
};

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'annuities',
  nounSingular: 'annuity',
  nounPlural: 'annuities',
  required: false,
  isItemIncomplete: item =>
    !isDefined(item?.establishedDate) ||
    !isDefined(item.marketValueAtEstablishment) ||
    typeof item.addedFundsAfterEstablishment !== 'boolean' ||
    typeof item.revocable !== 'boolean' ||
    typeof item.receivingIncomeFromAnnuity !== 'boolean' ||
    typeof item.canBeLiquidated !== 'boolean', // include all required fields here
  text: {
    summaryTitle: 'Review annuities',
    getItemName: item =>
      isDefined(item?.establishedDate) &&
      `Annuity established on ${formatDateLong(item.establishedDate)}`,
    cardDescription: item =>
      isDefined(item?.marketValueAtEstablishment) && (
        <ul className="u-list-no-bullets vads-u-padding-left--0 vads-u-font-weight--normal">
          <li>
            Type:{' '}
            <span className="vads-u-font-weight--bold">
              {item.revocable ? 'Revocable' : 'Irrevocable'}
            </span>
          </li>
          <li>
            Fair market value when created:{' '}
            <span className="vads-u-font-weight--bold">
              {formatCurrency(item.marketValueAtEstablishment)}
            </span>
          </li>
          {item?.receivingIncomeFromAnnuity &&
            item?.annualReceivedIncome && (
              <li>
                Annual income:{' '}
                <span className="vads-u-font-weight--bold">
                  {formatCurrency(item.annualReceivedIncome)}
                </span>
              </li>
            )}
          {item?.addedFundsAfterEstablishment &&
            item?.addedFundsAmount && (
              <li>
                Money added:{' '}
                <span className="vads-u-font-weight--bold">
                  {formatCurrency(item.addedFundsAmount)}
                </span>
              </li>
            )}
        </ul>
      ),
    reviewAddButtonText: props => `Add ${props.nounSingular}`,
    alertItemUpdated: 'Your annuity information has been updated',
    alertItemDeleted: 'Your annuity information has been deleted',
    cancelAddTitle: 'Cancel adding this annuity',
    cancelAddButtonText: 'Cancel adding this annuity',
    cancelAddYes: 'Yes, cancel adding this annuity',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this annuity',
    cancelEditYes: 'Yes, cancel editing this annuity',
    cancelEditNo: 'No',
    deleteTitle: 'Delete this annuity',
    deleteYes: 'Yes, delete this annuity',
    deleteNo: 'No',
    deleteDescription: props =>
      generateDeleteDescription(props, options.text.getItemName),
  },
};

// We support multiple summary pages (one per claimant type).
// These constants centralize shared text so each summary page stays consistent.
// Important: only one summary page should ever be displayed at a time.

// Shared summary page text
const updatedTitleNoItems = 'Do you or your dependents have an annuity?';
const updatedTitleWithItems = 'Do you have another annuity to report?';
const summaryPageTitle = 'Annuities summary';
const yesNoOptionLabels = {
  Y: 'Yes, I have an annuity to report',
  N: 'No, I don’t have an annuity to report',
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingAnnuities': arrayBuilderYesNoUI(
      options,
      {
        title: 'Have you or your dependents established an annuity?',
        hint: 'If yes, you’ll need to report at least one annuity',
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
      'view:isAddingAnnuities': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingAnnuities'],
  },
};

/** @returns {PageSchema} */
const veteranSummaryPage = {
  uiSchema: {
    'view:isAddingAnnuities': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and children who you financially support.',
        labelHeaderLevel: '1',
        labelHeaderLevelStyle: '2',
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
const spouseSummaryPage = {
  uiSchema: {
    'view:isAddingAnnuities': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint: 'Your dependents include children who you financially support. ',
        labelHeaderLevel: '1',
        labelHeaderLevelStyle: '2',
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
const childSummaryPage = {
  uiSchema: {
    'view:isAddingAnnuities': arrayBuilderYesNoUI(
      options,
      {
        title: 'Do you have an annuity?',
        hint: null,
        labelHeaderLevel: '1',
        labelHeaderLevelStyle: '2',
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
    'view:isAddingAnnuities': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner.',
        labelHeaderLevel: '1',
        labelHeaderLevelStyle: '2',
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
const custodianSummaryPage = {
  uiSchema: {
    'view:isAddingAnnuities': arrayBuilderYesNoUI(
      options,
      {
        title: updatedTitleNoItems,
        hint:
          'Your dependents include your spouse, including a same-sex and common-law partner and the Veteran’s children who you financially support.',
        labelHeaderLevel: '1',
        labelHeaderLevelStyle: '2',
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
const informationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Annuity creation',
      nounSingular: options.nounSingular,
    }),
    establishedDate: currentOrPastDateUI('When was the annuity created?'),
    marketValueAtEstablishment: currencyUI(
      'What was the fair market value of the asset when the annuity was purchased?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      establishedDate: currentOrPastDateSchema,
      marketValueAtEstablishment: currencySchema,
    },
    required: ['establishedDate', 'marketValueAtEstablishment'],
  },
};

/** @returns {PageSchema} */
const revocablePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Type of annuity'),
    revocable: yesNoUI({
      title: 'What type of annuity is it?',
      labels: {
        Y: 'Revocable',
        N: 'Irrevocable',
      },
      ...sharedYesNoOptionsBase,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      revocable: yesNoSchema,
    },
    required: ['revocable'],
  },
};

/** @returns {PageSchema} */
const incomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Income from annuity'),
    receivingIncomeFromAnnuity: yesNoUI({
      title: 'Do you receive income from this annuity?',
      ...sharedYesNoOptionsBase,
    }),
    annualReceivedIncome: {
      ...currencyUI({
        title: 'How much annual income do you receive from this annuity?',
        expandUnder: 'receivingIncomeFromAnnuity',
        expandUnderCondition: true,
      }),
      'ui:required': annualReceivedIncomeFromAnnuityRequired,
    },
    'ui:options': {
      ...requireExpandedArrayField('annualReceivedIncome'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      receivingIncomeFromAnnuity: yesNoSchema,
      annualReceivedIncome: currencySchema,
    },
    required: ['receivingIncomeFromAnnuity'],
  },
};

/** @returns {PageSchema} */
const liquidationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Annuity liquidation'),
    canBeLiquidated: yesNoUI({
      title: 'Can this annuity be liquidated?',
      ...sharedYesNoOptionsBase,
    }),
    surrenderValue: {
      ...currencyUI({
        title: 'What’s the surrender value?',
        expandUnder: 'canBeLiquidated',
        expandUnderCondition: true,
      }),
      'ui:required': surrenderValueRequired,
    },
    'ui:options': {
      ...requireExpandedArrayField('surrenderValue'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      canBeLiquidated: yesNoSchema,
      surrenderValue: currencySchema,
    },
    required: ['canBeLiquidated'],
  },
};

/** @returns {PageSchema} */
const hasAddedFundsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Money added to annuity'),
    addedFundsAfterEstablishment: yesNoUI({
      title:
        'Was money added to this annuity this year or in the last 3 years?',
      ...sharedYesNoOptionsBase,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      addedFundsAfterEstablishment: yesNoSchema,
    },
    required: ['addedFundsAfterEstablishment'],
  },
};

/** @returns {PageSchema} */
const addedFundsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Amount added to annuity'),
    addedFundsDate: currentOrPastDateUI('When was money added?'),
    addedFundsAmount: currencyUI('How much was added?'),
  },
  schema: {
    type: 'object',
    properties: {
      addedFundsDate: currentOrPastDateSchema,
      addedFundsAmount: currencySchema,
    },
    required: ['addedFundsDate', 'addedFundsAmount'],
  },
};

export const annuityPages = arrayBuilderPages(options, pageBuilder => ({
  annuityPagesVeteranSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'annuities-summary-veteran',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'VETERAN',
    uiSchema: veteranSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  annuityPagesSpouseSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'annuities-summary-spouse',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'SPOUSE',
    uiSchema: spouseSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  annuityPagesChildSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'annuities-summary-child',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CHILD',
    uiSchema: childSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  annuityPagesCustodianSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'annuities-summary-custodian',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'CUSTODIAN',
    uiSchema: custodianSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  annuityPagesParentSummary: pageBuilder.summaryPage({
    title: summaryPageTitle,
    path: 'annuities-summary-parent',
    depends: formData =>
      showUpdatedContent() && formData.claimantType === 'PARENT',
    uiSchema: parentSummaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  // Ensure MVP summary page is listed last so it’s not accidentally overridden by claimantType-specific summary pages
  annuityPagesSummary: pageBuilder.summaryPage({
    ContentBeforeButtons: showUpdatedContent()
      ? customDependentDescription
      : null,
    title: 'Annuities summary',
    path: 'annuities-summary',
    depends: () => !showUpdatedContent(),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  annuityInformationPage: pageBuilder.itemPage({
    title: 'Annuity information',
    path: 'annuities/:index/information',
    uiSchema: informationPage.uiSchema,
    schema: informationPage.schema,
  }),
  annuityRevocablePage: pageBuilder.itemPage({
    title: 'Annuity revocable',
    path: 'annuities/:index/revocable',
    uiSchema: revocablePage.uiSchema,
    schema: revocablePage.schema,
  }),
  annuityIncomePage: pageBuilder.itemPage({
    title: 'Annuity income',
    path: 'annuities/:index/income',
    uiSchema: incomePage.uiSchema,
    schema: incomePage.schema,
  }),
  annuityLiquidationPage: pageBuilder.itemPage({
    title: 'Annuity liquidation',
    path: 'annuities/:index/liquidation',
    uiSchema: liquidationPage.uiSchema,
    schema: liquidationPage.schema,
  }),
  annuityHasAddedFundsPage: pageBuilder.itemPage({
    title: 'Annuity has added funds',
    path: 'annuities/:index/has-added-funds',
    uiSchema: hasAddedFundsPage.uiSchema,
    schema: hasAddedFundsPage.schema,
  }),
  annuityAddedFundsPage: pageBuilder.itemPage({
    title: 'Annuity added funds',
    path: 'annuities/:index/added-funds',
    depends: (formData, index) =>
      formData?.[options.arrayPath]?.[index]?.addedFundsAfterEstablishment,
    uiSchema: addedFundsPage.uiSchema,
    schema: addedFundsPage.schema,
  }),
}));
