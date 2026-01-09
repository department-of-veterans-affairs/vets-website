import { useState, useCallback, useRef, useEffect } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import {
  isPendingTransaction,
  isSuccessfulTransaction,
  isFailedTransaction,
} from 'platform/user/profile/vap-svc/util/transactions';

/**
 * Default polling interval in milliseconds.
 * Can be overridden via `window.VetsGov.pollTimeout` for testing.
 */
const DEFAULT_POLL_INTERVAL = 2000;

/**
 * Maximum number of poll attempts before timing out.
 * At 2 second intervals, 15 attempts = 30 seconds max.
 */
const MAX_POLL_ATTEMPTS = 15;

/**
 * Custom hook for confirming email address with proper transaction polling.
 *
 * This hook handles:
 * - Submitting the email confirmation to the VA Profile API
 * - Polling for transaction completion
 * - Managing loading, success, and error states
 *
 * @param {Object} options - Hook options
 * @param {string|number} options.emailAddressId - The ID of the email address record
 * @param {string} options.emailAddress - The email address being confirmed
 * @param {Function} [options.onSuccess] - Optional callback when confirmation succeeds
 * @param {Function} [options.onError] - Optional callback when confirmation fails
 * @returns {Object} Hook return values
 * @returns {Function} return.confirmEmail - Function to trigger email confirmation
 * @returns {boolean} return.isLoading - Whether the confirmation is in progress
 * @returns {boolean} return.isSuccess - Whether the confirmation succeeded
 * @returns {boolean} return.isError - Whether the confirmation failed
 */
const useConfirmEmailTransaction = ({
  emailAddressId,
  emailAddress,
  onSuccess,
  onError,
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const pollCountRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  /**
   * Clears the polling interval
   */
  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Polls the transaction status endpoint until completion, failure, or timeout
   * @param {string} transactionId - The transaction ID to poll
   */
  const pollTransactionStatus = useCallback(
    async transactionId => {
      // Check if we've exceeded max poll attempts
      pollCountRef.current += 1;
      if (pollCountRef.current > MAX_POLL_ATTEMPTS) {
        clearPolling();
        setIsLoading(false);
        setIsSuccess(false);
        setIsError(true);
        onError?.();
        return;
      }

      try {
        const transaction = await apiRequest(
          `/profile/status/${transactionId}`,
        );

        if (!isMountedRef.current) {
          clearPolling();
          return;
        }

        if (isSuccessfulTransaction(transaction)) {
          clearPolling();
          setIsLoading(false);
          setIsSuccess(true);
          setIsError(false);
          onSuccess?.();
        } else if (isFailedTransaction(transaction)) {
          clearPolling();
          setIsLoading(false);
          setIsSuccess(false);
          setIsError(true);
          onError?.();
        }
        // If still pending, continue polling (interval will call again)
      } catch (error) {
        if (!isMountedRef.current) return;
        clearPolling();
        setIsLoading(false);
        setIsSuccess(false);
        setIsError(true);
        onError?.();
      }
    },
    [clearPolling, onSuccess, onError],
  );

  /**
   * Starts polling for transaction status
   * @param {string} transactionId - The transaction ID to poll
   */
  const startPolling = useCallback(
    transactionId => {
      const pollInterval = window.VetsGov?.pollTimeout || DEFAULT_POLL_INTERVAL;

      // Poll immediately first
      pollTransactionStatus(transactionId);

      // Then set up interval for subsequent polls
      intervalRef.current = setInterval(() => {
        pollTransactionStatus(transactionId);
      }, pollInterval);
    },
    [pollTransactionStatus],
  );

  /**
   * Submits the email confirmation and starts polling for completion
   * @param {string} [confirmationDate] - Optional ISO date string, defaults to now
   */
  const confirmEmail = useCallback(
    async (confirmationDate = new Date().toISOString()) => {
      if (!emailAddressId || !emailAddress) {
        // eslint-disable-next-line no-console
        console.error(
          'useConfirmEmailTransaction: emailAddressId and emailAddress are required',
        );
        setIsError(true);
        onError?.();
        return;
      }

      // Clear any existing polling interval to prevent memory leaks
      // if confirmEmail is called multiple times
      clearPolling();
      pollCountRef.current = 0;

      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);

      try {
        const transaction = await apiRequest('/profile/email_addresses', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: emailAddressId,
            // eslint-disable-next-line camelcase
            email_address: emailAddress,
            // eslint-disable-next-line camelcase
            confirmation_date: confirmationDate,
          }),
        });

        if (!isMountedRef.current) return;

        // Check if the transaction returned has an ID to poll
        const transactionId = transaction?.data?.attributes?.transactionId;

        const handleSuccess = () => {
          setIsLoading(false);
          setIsSuccess(true);
          setIsError(false);
          onSuccess?.();
        };

        const handleError = () => {
          setIsLoading(false);
          setIsSuccess(false);
          setIsError(true);
          onError?.();
        };

        if (transactionId) {
          // Check initial status - it might already be complete
          if (isSuccessfulTransaction(transaction)) {
            handleSuccess();
          } else if (isFailedTransaction(transaction)) {
            handleError();
          } else if (isPendingTransaction(transaction)) {
            // Start polling for completion
            startPolling(transactionId);
          } else {
            // Unknown status, treat as success (backwards compatibility)
            handleSuccess();
          }
        } else {
          // No transaction ID returned, assume immediate success (backwards compatibility)
          handleSuccess();
        }
      } catch (error) {
        if (!isMountedRef.current) return;
        setIsLoading(false);
        setIsSuccess(false);
        setIsError(true);
        onError?.();
      }
    },
    [
      emailAddressId,
      emailAddress,
      onSuccess,
      onError,
      startPolling,
      clearPolling,
    ],
  );

  return {
    confirmEmail,
    isLoading,
    isSuccess,
    isError,
  };
};

export default useConfirmEmailTransaction;
