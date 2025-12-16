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

/**
 * Checks if there are any documents that are not associated with any expenses
 * @param {Array} documents - Array of document objects with documentId
 * @param {Array} expenses - Array of expense objects with documentId
 * @returns {boolean} - True if there are unassociated documents, false otherwise
 */
export function hasUnassociatedDocuments(documents = [], expenses = []) {
  if (!documents || documents.length === 0) return false;

  // Filter out clerk notes (documents without mimetype)
  const realDocuments = documents.filter(doc => doc.mimetype);
  if (realDocuments.length === 0) return false;

  if (!expenses || expenses.length === 0) return realDocuments.length > 0;

  const expenseDocIds = new Set(
    expenses.map(exp => exp.documentId).filter(Boolean),
  );

  return realDocuments.some(doc => !expenseDocIds.has(doc.documentId));
}
