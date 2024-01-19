import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  refreshTransaction,
  openModal,
  clearTransactionRequest,
  createTransaction,
} from '@@vap-svc/actions';

import * as VAP_SERVICE from '@@vap-svc/constants';

import { selectVAPServiceTransaction } from '@@vap-svc/selectors';

import {
  isFailedTransaction,
  isPendingTransaction,
  isSuccessfulTransaction,
} from '@@vap-svc/util/transactions';

import { usePrevious } from 'platform/utilities/react-hooks';
import { getProfileInfoFieldAttributes } from '@@vap-svc/util/getProfileInfoFieldAttributes';

export const useProfileTransaction = fieldName => {
  const dispatch = useDispatch();
  const [transactionInterval, setTransactionInterval] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { transaction, transactionRequest } = useSelector(state =>
    selectVAPServiceTransaction(state, fieldName),
  );

  const prevPropsTransaction = usePrevious(transaction);

  const analyticsSectionName = VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName];

  const refreshActiveTransaction = useCallback(
    () => {
      dispatch(refreshTransaction(transaction, analyticsSectionName));
    },
    [dispatch, transaction, analyticsSectionName],
  );

  useEffect(
    () => {
      if (
        isPendingTransaction(transaction) &&
        !isPendingTransaction(prevPropsTransaction)
      ) {
        const intervalId = window.setInterval(
          refreshActiveTransaction,
          window.VetsGov.pollTimeout || 1000,
        );
        setTransactionInterval(intervalId);
      }
      // if the transaction is no longer pending, stop refreshing it
      if (
        isPendingTransaction(prevPropsTransaction) &&
        !isPendingTransaction(transaction)
      ) {
        window.clearInterval(transactionInterval);
        setTransactionInterval(null);
      }
      // if a transaction was created that was immediately successful (for example
      // when the transaction's status is `COMPLETED_NO_CHANGES_DETECTED`),
      // immediately exit edit view and clear the transaction request so it can be triggered again
      if (isSuccessfulTransaction(transaction)) {
        dispatch(openModal(null));
        dispatch(clearTransactionRequest(fieldName));
        window.clearInterval(transactionInterval);
        setTransactionInterval(null);
      }

      if (isFailedTransaction(transaction)) {
        window.clearInterval(transactionInterval);
        setTransactionInterval(null);
      }

      return function cleanup() {
        if (transactionInterval) {
          window.clearInterval(transactionInterval);
          setTransactionInterval(null);
        }
      };
    },
    [
      dispatch,
      transaction,
      prevPropsTransaction,
      fieldName,
      refreshActiveTransaction,
      transactionInterval,
    ],
  );

  useEffect(
    () => {
      setIsLoading(
        transactionRequest?.isPending || isPendingTransaction(transaction),
      );
      setError(
        transactionRequest?.error ||
          (isFailedTransaction(transaction) ? {} : null),
      );
      return function cleanup() {
        setIsLoading(false);
        setError(null);
      };
    },
    [transaction, transactionRequest],
  );

  const {
    apiRoute,
    convertCleanDataToPayload,
    title,
    uiSchema,
    formSchema,
  } = getProfileInfoFieldAttributes(fieldName);

  const startTransaction = value => {
    let payload = value;

    if (convertCleanDataToPayload) {
      payload = convertCleanDataToPayload(payload, fieldName);
    }

    const method = payload?.id ? 'PUT' : 'POST';

    dispatch(
      createTransaction(
        apiRoute,
        method,
        fieldName,
        payload,
        analyticsSectionName,
      ),
    );
  };

  return {
    isLoading,
    error,
    analyticsSectionName,
    uiSchema,
    formSchema,
    title,
    startTransaction,
  };
};
