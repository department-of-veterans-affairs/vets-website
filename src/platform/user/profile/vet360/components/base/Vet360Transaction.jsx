import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  isPendingTransaction,
  isFailedTransaction,
} from 'vet360/util/transactions';

import Vet360TransactionInlineErrorMessage from './Vet360TransactionInlineErrorMessage';
import Vet360TransactionPending from './Vet360TransactionPending';

export default class Vet360Transaction extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    refreshTransaction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transaction: PropTypes.object,
  };

  render() {
    const {
      id,
      isModalOpen,
      children,
      refreshTransaction,
      title,
      transaction,
      transactionRequest,
    } = this.props;

    const method = transactionRequest ? transactionRequest.method : 'PUT';
    const hasError = isFailedTransaction(transaction);
    const classes = classNames('vet360-profile-field-content', {
      'usa-input-error': hasError,
    });

    return (
      <div className={classes}>
        {hasError && <Vet360TransactionInlineErrorMessage {...this.props} />}
        {isPendingTransaction(transaction) ? (
          <div id={id}>
            <Vet360TransactionPending
              title={title}
              refreshTransaction={refreshTransaction}
              method={method}
            >
              {isModalOpen && children}
            </Vet360TransactionPending>
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
}
