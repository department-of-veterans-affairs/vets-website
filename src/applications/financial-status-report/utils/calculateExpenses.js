import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';
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
 * @param {boolean} [params.view:enhancedFinancialStatusReport=true] - Enhanced financial status report flag.
 * @param {boolean} [params.view:enhancedFinancialStatusReport=false] - Enhanced financial status report flag.
 * @returns {number} The total monthly expenses.
 */

export const getMonthlyExpenses = ({
  expenses,
  otherExpenses,
  utilityRecords,
  installmentContracts,
  'view:enhancedFinancialStatusReport': enhancedFSRActive = true,
  'view:showUpdatedExpensePages': expensePageActive = false,
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
  const rentOrMortgage = expensePageActive
    ? safeNumber(expenses?.monthlyHousingExpenses)
    : safeNumber(expenses?.rentOrMortgage || 0);
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
      monthlyHousingExpenses = 0,
    } = {},
    otherExpenses = [],
    utilityRecords,
    installmentContracts = [],
    'view:enhancedFinancialStatusReport': enhancedFSRActive,
    'view:showUpdatedExpensePages': expensePageActive = false,
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

  // This is messy, but will be cleaned up once we remove the enhanced feature flag.
  const enhancedMortgage = enhancedFSRActive
    ? sumValues(rentOrMortgageExpenses, 'amount')
    : safeNumber(rentOrMortgage);
  const currentRentOrMortgage = expensePageActive
    ? safeNumber(monthlyHousingExpenses)
    : enhancedMortgage;

  return {
    rentOrMortgage: currentRentOrMortgage,
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

// /v0/calculate_monthly_expenses
export const getMonthlyExpensesAPI = async formData => {
  const body = JSON.stringify(formData);
  try {
    const url = `${
      environment.API_URL
    }/debts_api/v0/calculate_monthly_expenses`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
      body,
      mode: 'cors',
    };

    return await apiRequest(url, options);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `calculate_monthly_expenses request handler failed: ${error}`,
      );
    });
    return null;
  }
};
