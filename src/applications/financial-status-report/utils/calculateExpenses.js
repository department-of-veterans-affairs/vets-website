import { sumValues, safeNumber } from './helpers';

// Constants representing the type of expense
const RENT = 'Rent';
const MORTGAGE_PAYMENT = 'Mortgage payment';
const FOOD = 'Food';

/**
 * Filters a list of expenses to include only those with specified names.
 * @param {Array} expenses - The array of expense objects to filter.
 * @param {Array} names - The array of strings representing expense names to include.
 * @returns {Array} A new array containing only the expenses with matching names.
 */

const filterExpensesByName = (expenses, names) =>
  expenses.filter(expense => names.includes(expense.name));

/**
 * Filters a list of expenses to exclude those with specified names.
 * @param {Array} expenses - The array of expense objects to filter.
 * @param {Array} names - The array of strings representing expense names to exclude.
 * @returns {Array} A new array containing only the expenses without matching names.
 */

const excludeExpensesByName = (expenses, names) =>
  expenses.filter(expense => !names.includes(expense.name));

/**
 * Calculates the total amount of the provided expense records.
 * @param {Array} expenseRecords - An array of expense records.
 * @returns {number} The total amount.
 */

const calculateExpenseRecords = expenseRecords =>
  expenseRecords?.reduce(
    (acc, expense) =>
      acc + Number(expense.amount?.replaceAll(/[^0-9.-]/g, '') ?? 0),
    0,
  ) ?? 0;

/**
 * Calculates the total monthly expenses based on the provided data.
 * @param {Object} params - The input parameters.
 * @param {Object} params.expenses - The expenses object.
 * @param {Array} params.otherExpenses - Other expenses array.
 * @param {Array} params.utilityRecords - Utility records array.
 * @param {Array} params.installmentContracts - Installment contracts array.
 * @param {boolean} [params.view:enhancedFinancialStatusReport=false] - Enhanced financial status report flag.
 * @returns {number} The total monthly expenses.
 */

export const getMonthlyExpenses = ({
  expenses,
  otherExpenses,
  utilityRecords,
  installmentContracts,
  'view:enhancedFinancialStatusReport': enhancedFSRActive = false,
}) => {
  const utilityField = enhancedFSRActive ? 'amount' : 'monthlyUtilityAmount';
  const utilities = sumValues(utilityRecords, utilityField);
  const installments = sumValues(installmentContracts, 'amountDueMonthly');
  const otherExp = sumValues(otherExpenses, 'amount');
  const creditCardBills = sumValues(
    expenses?.creditCardBills,
    'amountDueMonthly',
  );
  const food = safeNumber(expenses?.food || 0);
  const rentOrMortgage = safeNumber(expenses?.rentOrMortgage || 0);
  const calculatedExpenseRecords = calculateExpenseRecords(
    expenses?.expenseRecords,
  );

  return (
    utilities +
    installments +
    otherExp +
    calculatedExpenseRecords +
    food +
    rentOrMortgage +
    creditCardBills
  );
};

/**
 * Retrieves various expense details based on the provided form data.
 * @param {Object} formData - The input form data.
 * @returns {Object} An object containing various expense details.
 */

export const getAllExpenses = formData => {
  const {
    expenses: {
      creditCardBills = [],
      expenseRecords = [],
      food = 0,
      rentOrMortgage = 0,
    } = {},
    otherExpenses = [],
    utilityRecords,
    installmentContracts = [],
    'view:enhancedFinancialStatusReport': enhancedFSRActive,
  } = formData;

  const rentOrMortgageExpenses = filterExpensesByName(expenseRecords, [
    RENT,
    MORTGAGE_PAYMENT,
  ]);

  const foodExpenses = otherExpenses.find(expense =>
    expense.name?.includes(FOOD),
  ) || { amount: 0 };

  const filteredExpenses = [
    ...excludeExpensesByName(otherExpenses, [FOOD]),
    ...excludeExpensesByName(expenseRecords, [RENT, MORTGAGE_PAYMENT]),
  ];

  const utilityField = enhancedFSRActive ? 'amount' : 'monthlyUtilityAmount';

  return {
    rentOrMortgage: enhancedFSRActive
      ? sumValues(rentOrMortgageExpenses, 'amount')
      : safeNumber(rentOrMortgage), // use safeNumber
    food: enhancedFSRActive ? foodExpenses.amount : safeNumber(food), // use safeNumber
    utilities: sumValues(utilityRecords, utilityField),
    otherLivingExpenses: {
      name: excludeExpensesByName(
        enhancedFSRActive ? filteredExpenses : otherExpenses,
        enhancedFSRActive ? [FOOD] : [],
      )
        .map(expense => expense.name)
        .join(', '),
      amount: enhancedFSRActive
        ? sumValues(filteredExpenses, 'amount')
        : sumValues(otherExpenses, 'amount'),
    },
    expensesInstallmentContractsAndOtherDebts: sumValues(
      [...installmentContracts, ...creditCardBills],
      'amountDueMonthly',
    ),
    otherExpenses,
    filteredExpenses,
    installmentContractsAndCreditCards: [
      ...installmentContracts,
      ...creditCardBills,
    ],
  };
};
