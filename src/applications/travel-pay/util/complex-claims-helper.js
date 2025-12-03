import { EXPENSE_TYPES } from '../constants';

/**
 * Get an expense type object by key
 * @param {string} typeKey - The expense type key (e.g., 'mileage')
 * @returns {{name: string, title: string}|null} - The matching expense type object or null if not found
 */
export function getExpenseType(typeKey) {
  if (!typeKey) return null;
  // Try exact match first
  if (EXPENSE_TYPES[typeKey]) return EXPENSE_TYPES[typeKey];

  // Try case-insensitive match
  const foundKey = Object.keys(EXPENSE_TYPES).find(
    key => key.toLowerCase() === typeKey.toLowerCase(),
  );

  return foundKey ? EXPENSE_TYPES[foundKey] : null;
}

/**
 * Formats a number to always have 2 decimal places
 * @param {number|string} amount - The amount to format
 * @returns {string} - Formatted amount with 2 decimal places
 */
export function formatAmount(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount))
    return '0.00';
  return Number(amount).toFixed(2);
}
