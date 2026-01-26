import {
  titleUI,
  textUI,
  textSchema,
  currencyUI,
  currencySchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'otherDebts',
  nounSingular: 'debt',
  nounPlural: 'debts',
  required: false,
  isItemIncomplete: item => !item?.debtType || !item?.debtAmount,
  maxItems: 4,
  text: {
    getItemName: item => item?.debtType || 'Unknown debt',
    cardDescription: item => {
      return item?.debtAmount
        ? `Amount: $${parseFloat(item.debtAmount).toFixed(2)}`
        : 'Amount: $0.00';
    },
  },
};

const yesNoOptions = {
  hint: `You can add up to ${options.maxItems}`,
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    ...titleUI("Beneficiary's other debts"),
    'view:hasOtherDebts': arrayBuilderYesNoUI(options, yesNoOptions),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasOtherDebts': arrayBuilderYesNoSchema,
    },
    required: ['view:hasOtherDebts'],
  },
};

/** @returns {PageSchema} */
const debtDetailsPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Debt details',
      nounSingular: options.nounSingular,
    }),
    debtType: textUI({
      title: 'Type of debt',
      hint: 'For example: credit card, personal loan, car loan',
    }),
    debtAmount: currencyUI({
      title: 'Amount owed',
      required: () => true,
    }),
    creditorName: textUI({
      title: 'Creditor name',
      hint: 'Name of the person or institution the debt is owed to',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      debtType: textSchema,
      debtAmount: currencySchema,
      creditorName: textSchema,
    },
    required: ['debtType', 'debtAmount'],
  },
};

export const otherDebtsPages = arrayBuilderPages(options, pageBuilder => ({
  otherDebtsSummary: pageBuilder.summaryPage({
    title: 'Beneficiary’s other debts',
    path: 'other-debts-list',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  debtDetailsPage: pageBuilder.itemPage({
    title: 'Debt details',
    path: 'other-debts-list/:index/details',
    uiSchema: debtDetailsPage.uiSchema,
    schema: debtDetailsPage.schema,
  }),
}));

// Export for testing
export const otherDebtsOptions = options;
