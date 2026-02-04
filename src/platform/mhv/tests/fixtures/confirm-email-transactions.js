/**
 * Shared fixtures for email confirmation transaction API responses.
 * Used by Cypress E2E tests across multiple applications.
 */

export const DEFAULT_TRANSACTION_ID = 'email_address_tx_id';

/**
 * Builds a mock response for PUT /v0/profile/email_addresses
 * @param {string} transactionStatus - Transaction status (e.g., 'RECEIVED', 'COMPLETED_SUCCESS', 'COMPLETED_FAILURE')
 * @param {string} transactionId - Optional transaction ID (defaults to DEFAULT_TRANSACTION_ID)
 * @returns {object} Cypress intercept response object
 */
export const buildUpdateEmailResponse = (
  transactionStatus = 'RECEIVED',
  transactionId = DEFAULT_TRANSACTION_ID,
) => ({
  statusCode: 200,
  body: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_email_address_transactions',
      attributes: {
        transactionId,
        transactionStatus,
        type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
        metadata: [],
      },
    },
  },
});

/**
 * Builds a mock response for GET /v0/profile/status/{transactionId}
 * @param {string} transactionStatus - Transaction status (e.g., 'RECEIVED', 'COMPLETED_SUCCESS', 'COMPLETED_FAILURE')
 * @param {string} transactionId - Optional transaction ID (defaults to DEFAULT_TRANSACTION_ID)
 * @returns {object} Cypress intercept response object
 */
export const buildTransactionStatusResponse = (
  transactionStatus = 'COMPLETED_SUCCESS',
  transactionId = DEFAULT_TRANSACTION_ID,
) => ({
  statusCode: 200,
  body: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_email_address_transactions',
      attributes: {
        transactionId,
        transactionStatus,
        type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
        metadata: [],
      },
    },
  },
});
