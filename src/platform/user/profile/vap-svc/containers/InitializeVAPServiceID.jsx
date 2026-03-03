import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import {
  INIT_VAP_SERVICE_ID,
  ANALYTICS_FIELD_MAP,
  API_ROUTES,
  VAP_SERVICE_INITIALIZATION_STATUS,
} from '../constants';

import {
  createTransaction,
  fetchTransactions,
  refreshTransaction,
} from '../actions';

import { selectVAPServiceInitializationStatus } from '../selectors';

import TransactionPending from '../components/base/VAPServiceTransactionPending';

const InitializeVAPServiceID = ({
  children,
  createTransaction: createTransactionAction,
  fetchTransactions: fetchTransactionsAction,
  refreshTransaction: refreshTransactionAction,
  status,
  transaction,
  transactionRequest,
}) => {
  useEffect(
    () => {
      if (status === VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZED) {
        fetchTransactionsAction();
      } else {
        const route = API_ROUTES.INIT_VAP_SERVICE_ID;
        const fieldName = INIT_VAP_SERVICE_ID;
        const method = 'POST';
        const body = null;
        const analytics = ANALYTICS_FIELD_MAP.INIT_VAP_SERVICE_ID;
        createTransactionAction(route, method, fieldName, body, analytics);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleRefreshTransaction = useCallback(
    () => {
      // "INITIALIZING" is also the status for when the request to create the transaction is pending, so
      // we have to make sure that isn't the case when we try to refresh the transaction because that would
      // means transaction is null.
      if (transactionRequest?.isPending) return;

      const { transactionId } = transaction.data.attributes;
      const initializationTransactionRefreshRoute = `/profile/person/status/${transactionId}`;
      refreshTransactionAction(
        transaction,
        ANALYTICS_FIELD_MAP.INIT_VAP_SERVICE_ID,
        initializationTransactionRefreshRoute,
      );
    },
    [transaction, transactionRequest, refreshTransactionAction],
  );

  switch (status) {
    case VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZED:
      return <>{children}</>;

    case VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZATION_FAILURE:
      return (
        <va-alert visible status="info" uswds>
          We’re sorry. Something went wrong on our end. Please refresh this page
          or try again later.
        </va-alert>
      );

    case VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZING:
      return (
        <TransactionPending refreshTransaction={handleRefreshTransaction}>
          Initialization in progress...
        </TransactionPending>
      );

    case VAP_SERVICE_INITIALIZATION_STATUS.UNINITIALIZED:
    default:
      return <div />;
  }
};

const mapStateToProps = state => {
  const {
    status,
    transaction,
    transactionRequest,
  } = selectVAPServiceInitializationStatus(state);
  return {
    status,
    transaction,
    transactionRequest,
  };
};

const mapDispatchToProps = {
  createTransaction,
  fetchTransactions,
  refreshTransaction,
};

/**
 * A Container for initializing the user into VA Profile if they are not
 * already. Otherwise, this container will initialize the Profile app state by
 * fetching all transactions.
 */
const InitializeVAPServiceIDContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitializeVAPServiceID);

export default InitializeVAPServiceIDContainer;
export { InitializeVAPServiceID };
