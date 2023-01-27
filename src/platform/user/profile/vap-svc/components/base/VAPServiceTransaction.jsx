import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  isPendingTransaction,
  isFailedTransaction,
} from 'platform/user/profile/vap-svc/util/transactions';

import VAPServiceTransactionInlineErrorMessage from './VAPServiceTransactionInlineErrorMessage';
import VAPServiceTransactionPending from './VAPServiceTransactionPending';

function VAPServiceTransaction(props) {
  const {
    id,
    isModalOpen,
    children,
    refreshTransaction,
    title,
    transaction,
    transactionRequest,
  } = props;

  const method = transactionRequest?.method || 'PUT';
  const transactionRequestPending = transactionRequest?.isPending;
  const transactionPending = isPendingTransaction(transaction);
  const transactionResolved = !transactionRequestPending && !transactionPending;
  const hasError =
    isFailedTransaction(transaction) || transactionRequest?.isFailed;
  const classes = classNames('vet360-profile-field-content', {
    'usa-input-error': hasError,
  });

  return (
    <div className={classes}>
      {hasError && <VAPServiceTransactionInlineErrorMessage {...props} />}
      {transactionRequestPending && (
        <div id={id}>
          <VAPServiceTransactionPending
            title={title}
            refreshTransaction={() => {}}
            method={method}
          >
            {/* if this field's modal is open, pass in the children to prevent
               the `Vet360TransactionPending` component from rendering the
               "we're saving your info..." message */}
            {isModalOpen && children}
          </VAPServiceTransactionPending>
        </div>
      )}
      {transactionPending && (
        <div id={id}>
          <VAPServiceTransactionPending
            title={title}
            refreshTransaction={refreshTransaction}
            method={method}
          >
            {/* if this field's modal is open, pass in the children to prevent
               the `Vet360TransactionPending` component from rendering the
               "we're saving your info..." message */}
            {isModalOpen && children}
          </VAPServiceTransactionPending>
        </div>
      )}
      {transactionResolved && children}
    </div>
  );
}

VAPServiceTransaction.propTypes = {
  children: PropTypes.node.isRequired,
  refreshTransaction: PropTypes.func.isRequired,
  // title is undefined upon first render
  title: PropTypes.string,
  transaction: PropTypes.object,
};

export default VAPServiceTransaction;
