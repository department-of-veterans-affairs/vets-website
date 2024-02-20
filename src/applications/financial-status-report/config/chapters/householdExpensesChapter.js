import {
  expenses,
  householdExpensesChecklist,
  householdExpensesInputList,
  utilities,
  utilityRecords,
  utilityBillPages,
  repayments,
  repaymentRecords,
  creditCardBills,
  installmentContracts,
  otherExpenses,
  otherExpenseRecords,
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
      expenses: {
        path: 'expenses',
        title: 'Expenses',
        uiSchema: expenses.uiSchema,
        schema: expenses.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      householdExpensesChecklist: {
        path: 'household-expenses-checklist',
        title: 'Household expenses checklist',
        uiSchema: householdExpensesChecklist.uiSchema,
        schema: householdExpensesChecklist.schema,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      householdExpensesInputList: {
        path: 'household-expenses-values',
        title: 'Household expenses values',
        uiSchema: householdExpensesInputList.uiSchema,
        schema: householdExpensesInputList.schema,
        CustomPageReview: HouseholdExpensesSummaryReview,
        depends: formData =>
          formData.expenses?.expenseRecords?.length > 0 &&
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      utilities: {
        path: 'utilities',
        title: 'Utilities',
        uiSchema: utilities.uiSchema,
        schema: utilities.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      utilityRecords: {
        path: 'utility-records',
        title: 'Utilities',
        uiSchema: utilityRecords.uiSchema,
        schema: utilityRecords.schema,
        depends: formData =>
          formData.questions.hasUtilities &&
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
      },
      // Enhanced Utility Bills
      utilityBillChecklist: {
        path: 'utility-bill-checklist',
        title: 'Utility bill options',
        uiSchema: utilityBillPages.utilityBillChecklist.uiSchema,
        schema: utilityBillPages.utilityBillChecklist.schema,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      utilityBillValues: {
        path: 'utility-bill-values',
        title: 'Utility bill values',
        uiSchema: utilityBillPages.utilityBillValues.uiSchema,
        schema: utilityBillPages.utilityBillValues.schema,
        depends: formData =>
          !!formData.utilityRecords?.length &&
          formData['view:enhancedFinancialStatusReport'] &&
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
          formData['view:enhancedFinancialStatusReport'] &&
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
      repayments: {
        path: 'repayments',
        title: 'Repayments',
        uiSchema: repayments.uiSchema,
        schema: repayments.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      repaymentRecords: {
        path: 'repayment-records',
        title: 'Repayments',
        uiSchema: repaymentRecords.uiSchema,
        schema: repaymentRecords.schema,
        depends: formData =>
          formData.questions.hasRepayments &&
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
      },
      creditCardBills: {
        path: 'credit-card-bills',
        title: 'Credit card bills',
        uiSchema: creditCardBills.uiSchema,
        schema: creditCardBills.schema,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      addEditCreditCardBills: {
        path: 'your-credit-card-bills',
        title: 'Credit card bills',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasCreditCardBills &&
          !formData.expenses?.creditCardBills?.length &&
          formData['view:enhancedFinancialStatusReport'] &&
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
          formData['view:enhancedFinancialStatusReport'] &&
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
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      addEditInstallmentContract: {
        path: 'your-installment-contracts',
        title: 'Installment contracts',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasRepayments &&
          !formData?.installmentContracts?.length &&
          formData['view:enhancedFinancialStatusReport'] &&
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
          formData.questions.hasRepayments &&
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPage: InstallmentContractSummary,
        CustomPageReview: InstallmentContractsSummaryReview,
      },
      otherExpenses: {
        path: 'other-expenses',
        title: 'Other expenses',
        uiSchema: otherExpenses.uiSchema,
        schema: otherExpenses.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      otherExpenseRecords: {
        path: 'other-expense-records',
        title: 'Other expenses',
        uiSchema: otherExpenseRecords.uiSchema,
        schema: otherExpenseRecords.schema,
        depends: formData =>
          formData.questions.hasOtherExpenses &&
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
      },
      // Start Other Living Expenses
      otherExpensesChecklist: {
        path: 'other-expenses-checklist',
        title: 'Other expense options',
        CustomPage: OtherExpensesChecklist,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      otherExpensesValues: {
        path: 'other-expenses-values',
        title: 'Other expense values',
        uiSchema: otherExpensesPages.otherExpensesValues.uiSchema,
        schema: otherExpensesPages.otherExpensesValues.schema,
        depends: formData =>
          !!formData.otherExpenses?.length &&
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
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
          !!formData.otherExpenses?.length &&
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
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
