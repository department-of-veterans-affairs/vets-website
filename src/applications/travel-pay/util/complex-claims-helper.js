import { EXPENSE_TYPES, STATUSES } from '../constants';

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
 * @param {Array} documents - Array of document objects with expenseId
 * @returns {boolean} - True if there are unassociated documents, false otherwise
 */
export function hasUnassociatedDocuments(documents = []) {
  if (!documents || documents.length === 0) return false;

  // Filter out clerk notes (documents without mimetype)
  const realDocuments = documents.filter(doc => doc.mimetype);
  if (realDocuments.length === 0) return false;

  // Check if any document is missing an expenseId (is unassociated)
  return realDocuments.some(doc => !doc.expenseId);
}

/**
 * Checks if a claim status is Incomplete or Saved
 * @param {string} claimStatus - The claim status to check
 * @returns {boolean} - True if the claim status is Incomplete or Saved, false otherwise
 */
export function isClaimIncompleteOrSaved(claimStatus) {
  return (
    claimStatus === STATUSES.Incomplete.name ||
    claimStatus === STATUSES.Saved.name
  );
}
