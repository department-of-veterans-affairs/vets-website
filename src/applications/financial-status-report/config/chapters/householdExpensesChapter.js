import {
  householdExpensesChecklist,
  householdExpensesInputList,
  utilityBillPages,
  creditCardBills,
  installmentContracts,
  otherExpensesPages,
} from '../../pages';

import CreditCardBill from '../../components/householdExpenses/CreditCardBill';
import CreditCardBillSummary from '../../components/householdExpenses/CreditCardBillSummary';
import AddUtilityBill from '../../components/utilityBills/AddUtilityBill';
import UtilityBillSummary from '../../components/utilityBills/UtilityBillSummary';
import UtilityBillSummaryReview from '../../components/utilityBills/UtilityBillSummaryReview';
import AddOtherExpense from '../../components/otherExpenses/AddOtherExpense';
import OtherExpensesChecklist from '../../components/otherExpenses/OtherExpensesChecklist';
import OtherExpensesSummary from '../../components/otherExpenses/OtherExpensesSummary';
import OtherExpensesSummaryReview from '../../components/otherExpenses/OtherExpensesSummaryReview';
import InstallmentContract from '../../components/householdExpenses/InstallmentContract';
import InstallmentContractSummary from '../../components/householdExpenses/InstallmentContractSummary';
import HouseholdExpensesSummaryReview from '../../components/householdExpenses/HouseholdExpensesSummaryReview';
import CreditCardBillsSummaryReview from '../../components/householdExpenses/CreditCardBillsSummaryReview';
import InstallmentContractsSummaryReview from '../../components/householdExpenses/InstallmentContractsSummaryReview';
import StreamlinedExplainer from '../../components/shared/StreamlinedExplainer';
import HouseholdExpensesExplainerWidget from '../../components/householdExpenses/HouseholdExpensesExplainerWidget';
import ExpenseExplainerReview from '../../components/householdExpenses/ExpenseExplainerReview';

import {
  isStreamlinedLongForm,
  isStreamlinedShortForm,
} from '../../utils/streamlinedDepends';

export default {
  householdExpensesChapter: {
    title: 'Household expenses',
    depends: formData => !isStreamlinedShortForm(formData),
    pages: {
      expensesExplainer: {
        path: 'expenses-explainer',
        title: 'Household expenses explainer',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        CustomPage: HouseholdExpensesExplainerWidget,
        CustomPageReview: ExpenseExplainerReview,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      householdExpensesChecklist: {
        path: 'household-expenses-checklist',
        title: 'Household expenses checklist',
        uiSchema: householdExpensesChecklist.uiSchema,
        schema: householdExpensesChecklist.schema,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      householdExpensesInputList: {
        path: 'household-expenses-values',
        title: 'Household expenses values',
        uiSchema: householdExpensesInputList.uiSchema,
        schema: householdExpensesInputList.schema,
        CustomPageReview: HouseholdExpensesSummaryReview,
        depends: formData =>
          formData.expenses?.expenseRecords?.length > 0 &&
          !isStreamlinedShortForm(formData),
      },
      // Enhanced Utility Bills
      utilityBillChecklist: {
        path: 'utility-bill-checklist',
        title: 'Utility bill options',
        uiSchema: utilityBillPages.utilityBillChecklist.uiSchema,
        schema: utilityBillPages.utilityBillChecklist.schema,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      utilityBillValues: {
        path: 'utility-bill-values',
        title: 'Utility bill values',
        uiSchema: utilityBillPages.utilityBillValues.uiSchema,
        schema: utilityBillPages.utilityBillValues.schema,
        depends: formData =>
          !!formData.utilityRecords?.length &&
          !isStreamlinedShortForm(formData),
      },
      utilityBillSummary: {
        path: 'utility-bill-summary',
        title: 'Utility bills summary',
        CustomPage: UtilityBillSummary,
        CustomPageReview: UtilityBillSummaryReview,
        editModeOnReviewPage: true,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          !!formData.utilityRecords?.length &&
          !isStreamlinedShortForm(formData),
      },
      addUtilityBill: {
        path: 'add-utility-bill',
        title: 'Add your utility bills',
        CustomPage: AddUtilityBill,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: () => false, // accessed from utilityBillSummary
      },
      creditCardBills: {
        path: 'credit-card-bills',
        title: 'Credit card bills',
        uiSchema: creditCardBills.uiSchema,
        schema: creditCardBills.schema,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      addEditCreditCardBills: {
        path: 'your-credit-card-bills',
        title: 'Credit card bills',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasCreditCardBills &&
          !formData.expenses?.creditCardBills?.length &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPage: CreditCardBill,
        CustomPageReview: null,
      },
      creditCardBillSummary: {
        path: 'credit-card-bills-summary',
        title: 'Credit card bills',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasCreditCardBills &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPage: CreditCardBillSummary,
        CustomPageReview: CreditCardBillsSummaryReview,
      },
      installmentContracts: {
        path: 'installment-contracts',
        title: 'Installment Contracts',
        uiSchema: installmentContracts.uiSchema,
        schema: installmentContracts.schema,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      addEditInstallmentContract: {
        path: 'your-installment-contracts',
        title: 'Installment contracts',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasRepayments &&
          !formData?.installmentContracts?.length &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPage: InstallmentContract,
        CustomPageReview: null,
      },
      installmentContractSummary: {
        path: 'installment-contracts-summary',
        title: 'Installment contracts',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasRepayments && !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPage: InstallmentContractSummary,
        CustomPageReview: InstallmentContractsSummaryReview,
      },
      // Start Other Living Expenses
      otherExpensesChecklist: {
        path: 'other-expenses-checklist',
        title: 'Other expense options',
        CustomPage: OtherExpensesChecklist,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => !isStreamlinedShortForm(formData),
      },
      otherExpensesValues: {
        path: 'other-expenses-values',
        title: 'Other expense values',
        uiSchema: otherExpensesPages.otherExpensesValues.uiSchema,
        schema: otherExpensesPages.otherExpensesValues.schema,
        depends: formData =>
          !!formData.otherExpenses?.length && !isStreamlinedShortForm(formData),
      },
      otherExpensesSummary: {
        path: 'other-expenses-summary',
        title: 'Other living expenses',
        CustomPage: OtherExpensesSummary,
        CustomPageReview: OtherExpensesSummaryReview,
        editModeOnReviewPage: true,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          !!formData.otherExpenses?.length && !isStreamlinedShortForm(formData),
      },
      addOtherExpenses: {
        path: 'add-other-expense',
        title: 'Add your additional expense',
        CustomPage: AddOtherExpense,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: () => false, // accessed from otherExpensesSummary
        returnUrl: 'other-expenses-summary',
      },
      // End Other Living Expenses
      streamlinedLongTransitionPage: {
        // Transition page - streamlined long form only
        path: 'skip-questions-explainer',
        title: ' ',
        CustomPage: StreamlinedExplainer,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData?.gmtData?.isEligibleForStreamlined &&
          isStreamlinedLongForm(formData),
      },
    },
  },
};
