import merge from 'lodash/merge';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  formatCurrency,
  annualReceivedIncomeRequired,
  surrenderValueRequired,
} from '../../../helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'annuities',
  nounSingular: 'Annuity',
  nounPlural: 'Annuities',
  required: false,
  isItemIncomplete: item =>
    !item?.establishedDate ||
    !item.marketValueAtEstablishment ||
    typeof item.addedFundsAfterEstablishment !== 'boolean' ||
    typeof item.revocable !== 'boolean' ||
    typeof item.receivingIncomeFromAnnuity !== 'boolean' ||
    typeof item.canBeLiquidated !== 'boolean', // include all required fields here
  maxItems: 5,
  text: {
    getItemName: item => formatCurrency(item.marketValueAtEstablishment),
    reviewAddButtonText: 'Add another annuity',
    alertMaxItems:
      'You have added the maximum number of allowed annuities for this application. You may edit or delete an annuity or choose to continue the application.',
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
  },
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
        labels: {
          Y: 'Yes, I have an annuity to report',
          N: 'No, I don’t have any annuities to report',
        },
      },
      {
        title: 'Do you have any more annuities to report?',
        labels: {
          Y: 'Yes, I have more annuities to report',
          N: 'No, I don’t have anymore annuities to report',
        },
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
const informationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Annuity',
      nounSingular: options.nounSingular,
    }),
    establishedDate: currentOrPastDateUI('When was the annuity established?'),
    marketValueAtEstablishment: merge(
      {},
      currencyUI(
        'What was the market value of the asset at the time of purchase?',
      ),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      establishedDate: currentOrPastDateSchema,
      marketValueAtEstablishment: { type: 'number' },
    },
    required: ['establishedDate', 'marketValueAtEstablishment'],
  },
};

/** @returns {PageSchema} */
const revocablePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Annuity'),
    revocable: yesNoUI({
      title: 'Is the annuity revocable or irrevocable?',
      labels: {
        Y: 'Revocable',
        N: 'Irrevocable',
      },
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
    ...arrayBuilderItemSubsequentPageTitleUI('Annuity'),
    receivingIncomeFromAnnuity: yesNoUI(
      'Do you receive income from the annuity?',
    ),
    annualReceivedIncome: merge(
      {},
      currencyUI('How much is the annual amount received?'),
      {
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
          expandUnder: 'receivingIncomeFromAnnuity',
          expandUnderCondition: true,
        },
        'ui:required': annualReceivedIncomeRequired,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      receivingIncomeFromAnnuity: yesNoSchema,
      annualReceivedIncome: { type: 'number' },
    },
    required: ['receivingIncomeFromAnnuity'],
  },
};

/** @returns {PageSchema} */
const liquidationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Annuity'),
    canBeLiquidated: yesNoUI('Can the annuity be liquidated?'),
    surrenderValue: merge({}, currencyUI('What is the surrender value?'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
        expandUnder: 'canBeLiquidated',
        expandUnderCondition: true,
      },
      'ui:required': surrenderValueRequired,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      canBeLiquidated: yesNoSchema,
      surrenderValue: { type: 'number' },
    },
    required: ['canBeLiquidated'],
  },
};

/** @returns {PageSchema} */
const hasAddedFundsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Annuity'),
    addedFundsAfterEstablishment: yesNoUI(
      'Have you added funds to the annuity in the current or prior three years?',
    ),
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
    ...arrayBuilderItemSubsequentPageTitleUI('Annuity'),
    addedFundsDate: currentOrPastDateUI('When did you add funds?'),
    addedFunds: merge({}, currencyUI('How much did you add?'), {
      'ui:options': {
        classNames: 'schemaform-currency-input-v3',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      addedFundsDate: currentOrPastDateSchema,
      addedFunds: { type: 'number' },
    },
    required: ['addedFundsDate', 'addedFunds'],
  },
};

export const annuityPages = arrayBuilderPages(
  options,
  (pageBuilder, helpers) => ({
    annuityPagesSummary: pageBuilder.summaryPage({
      title: 'Annuities summary',
      path: 'annuities-summary',
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
      onNavForward: props => {
        return props.formData.addedFundsAfterEstablishment
          ? helpers.navForwardKeepUrlParams(props) // go to next page
          : helpers.navForwardFinishedItem(props); // return to summary
      },
      uiSchema: hasAddedFundsPage.uiSchema,
      schema: hasAddedFundsPage.schema,
    }),
    annuityAddedFundsPage: pageBuilder.itemPage({
      title: 'Annuity added funds',
      path: 'annuities/:index/added-funds',
      uiSchema: addedFundsPage.uiSchema,
      schema: addedFundsPage.schema,
    }),
  }),
);
