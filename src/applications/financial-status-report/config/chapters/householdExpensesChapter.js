// remove * and import relevant pages
import * as pages from '../../pages';
import CreditCardBill from '../../components/CreditCardBill';
import CreditCardBillSummary from '../../pages/expenses/creditCardBills/CreditCardBillSummary';
import AddUtilityBill from '../../components/utilityBills/AddUtilityBill';
import UtilityBillSummary from '../../components/utilityBills/UtilityBillSummary';
import UtilityBillSummaryReview from '../../components/utilityBills/UtilityBillSummaryReview';
import AddOtherExpense from '../../components/otherExpenses/AddOtherExpense';
import OtherExpensesSummary from '../../components/otherExpenses/OtherExpensesSummary';
import OtherExpensesSummaryReview from '../../components/otherExpenses/OtherExpensesSummaryReview';
import InstallmentContract from '../../components/InstallmentContract';
import InstallmentContractSummary from '../../pages/expenses/repayments/InstallmentContractSummary';

// householdExpensesChapter
export default {
  title: 'Household expenses',
  pages: {
    expensesExplainer: {
      path: 'expenses-explainer',
      title: 'Household expenses explainer',
      uiSchema: pages.expensesExplainer.uiSchema,
      schema: pages.expensesExplainer.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    expenses: {
      path: 'expenses',
      title: 'Expenses',
      uiSchema: pages.expenses.uiSchema,
      schema: pages.expenses.schema,
      depends: formData => !formData['view:enhancedFinancialStatusReport'],
    },
    householdExpensesChecklist: {
      path: 'household-expenses-checklist',
      title: 'Household expenses checklist',
      uiSchema: pages.householdExpensesChecklist.uiSchema,
      schema: pages.householdExpensesChecklist.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    householdExpensesInputList: {
      path: 'household-expenses-values',
      title: 'Household expenses values',
      uiSchema: pages.householdExpensesInputList.uiSchema,
      schema: pages.householdExpensesInputList.schema,
      depends: formData =>
        formData.expenses?.expenseRecords?.length > 0 &&
        formData['view:enhancedFinancialStatusReport'],
    },
    utilities: {
      path: 'utilities',
      title: 'Utilities',
      uiSchema: pages.utilities.uiSchema,
      schema: pages.utilities.schema,
      depends: formData => !formData['view:enhancedFinancialStatusReport'],
    },
    utilityRecords: {
      path: 'utility-records',
      title: 'Utilities',
      uiSchema: pages.utilityRecords.uiSchema,
      schema: pages.utilityRecords.schema,
      depends: formData =>
        formData.questions.hasUtilities &&
        !formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: true,
    },
    // Enhanced Utility Bills
    utilityBillChecklist: {
      path: 'utility-bill-checklist',
      title: 'Utility bill options',
      uiSchema: pages.utilityBillPages.utilityBillChecklist.uiSchema,
      schema: pages.utilityBillPages.utilityBillChecklist.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    utilityBillValues: {
      path: 'utility-bill-values',
      title: 'Utility bill values',
      uiSchema: pages.utilityBillPages.utilityBillValues.uiSchema,
      schema: pages.utilityBillPages.utilityBillValues.schema,
      depends: formData =>
        !!formData.utilityRecords?.length &&
        formData['view:enhancedFinancialStatusReport'],
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
        formData['view:enhancedFinancialStatusReport'],
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
      uiSchema: pages.repayments.uiSchema,
      schema: pages.repayments.schema,
      depends: formData => !formData['view:enhancedFinancialStatusReport'],
    },
    repaymentRecords: {
      path: 'repayment-records',
      title: 'Repayments',
      uiSchema: pages.repaymentRecords.uiSchema,
      schema: pages.repaymentRecords.schema,
      depends: formData =>
        formData.questions.hasRepayments &&
        !formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: true,
    },
    creditCardBills: {
      path: 'credit-card-bills',
      title: 'Credit card bills',
      uiSchema: pages.creditCardBills.uiSchema,
      schema: pages.creditCardBills.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    addEditCreditCardBills: {
      path: 'your-credit-card-bills',
      title: 'Credit card bills',
      uiSchema: {},
      schema: { type: 'object', properties: {} },
      depends: formData =>
        formData.questions.hasCreditCardBills &&
        !formData.expenses?.creditCardBills?.length &&
        formData['view:enhancedFinancialStatusReport'],
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
        formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: true,
      CustomPage: CreditCardBillSummary,
      CustomPageReview: null,
    },
    installmentContracts: {
      path: 'installment-contracts',
      title: 'Installment Contracts',
      uiSchema: pages.installmentContracts.uiSchema,
      schema: pages.installmentContracts.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    addEditInstallmentContract: {
      path: 'your-installment-contracts',
      title: 'Installment contracts',
      uiSchema: {},
      schema: { type: 'object', properties: {} },
      depends: formData =>
        formData.questions.hasRepayments &&
        !formData.expenses?.installmentContracts?.length &&
        formData['view:enhancedFinancialStatusReport'],
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
        formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: true,
      CustomPage: InstallmentContractSummary,
      CustomPageReview: null,
    },
    otherExpenses: {
      path: 'other-expenses',
      title: 'Other expenses',
      uiSchema: pages.otherExpenses.uiSchema,
      schema: pages.otherExpenses.schema,
      depends: formData => !formData['view:enhancedFinancialStatusReport'],
    },
    otherExpenseRecords: {
      path: 'other-expense-records',
      title: 'Other expenses',
      uiSchema: pages.otherExpenseRecords.uiSchema,
      schema: pages.otherExpenseRecords.schema,
      depends: formData =>
        formData.questions.hasOtherExpenses &&
        !formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: true,
    },
    // Start Other Living Expenses
    otherExpensesChecklist: {
      path: 'other-expenses-checklist',
      title: 'Other expense options',
      uiSchema: pages.otherExpensesPages.otherExpensesChecklist.uiSchema,
      schema: pages.otherExpensesPages.otherExpensesChecklist.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    otherExpensesValues: {
      path: 'other-expenses-values',
      title: 'Other expense values',
      uiSchema: pages.otherExpensesPages.otherExpensesValues.uiSchema,
      schema: pages.otherExpensesPages.otherExpensesValues.schema,
      depends: formData =>
        !!formData.otherExpenses?.length &&
        formData['view:enhancedFinancialStatusReport'],
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
        formData['view:enhancedFinancialStatusReport'],
    },
    addOtherExpenses: {
      path: 'add-other-expense',
      title: 'Add your additional expense',
      CustomPage: AddOtherExpense,
      CustomPageReview: null,
      uiSchema: {},
      schema: { type: 'object', properties: {} },
      depends: () => false, // accessed from otherExpensesSummary
    },
    // End Other Living Expenses
  },
};
