import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  isPendingTransaction,
  isFailedTransaction,
} from 'vet360/util/transactions';

import Vet360TransactionInlineErrorMessage from './Vet360TransactionInlineErrorMessage';
import Vet360TransactionPending from './Vet360TransactionPending';

function Vet360Transaction(props) {
  const {
    id,
    isModalOpen,
    children,
    refreshTransaction,
    title,
    transaction,
    transactionRequest,
  } = props;

  const method = transactionRequest ? transactionRequest.method : 'PUT';
  const hasError = isFailedTransaction(transaction);
  const classes = classNames('vet360-profile-field-content', {
    'usa-input-error': hasError,
  });

  return (
    <div className={classes}>
      {hasError && <Vet360TransactionInlineErrorMessage {...props} />}
      {isPendingTransaction(transaction) ? (
        <div id={id}>
          <Vet360TransactionPending
            title={title}
            refreshTransaction={refreshTransaction}
            method={method}
          >
            {/* if this field's modal is open, pass in the children so prevent
               the `Vet360TransactionPending` component from rendering the
               "we're saving your info..." message */}
            {isModalOpen && children}
          </Vet360TransactionPending>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

Vet360Transaction.propTypes = {
  children: PropTypes.node.isRequired,
  refreshTransaction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  transaction: PropTypes.object,
};

export default Vet360Transaction;
