import React from 'react';
import classNames from 'classnames';

import {
  isPendingTransaction,
  isErroredTransaction
} from '../util/transactions';

import Vet360TransactionPending from './Vet360TransactionPending';

export default class Vet360Transaction extends React.Component {
  render() {
    const {
      children,
      refreshTransaction,
      title,
      transaction
    } = this.props;

    const hasError = transaction && isErroredTransaction(transaction);
    const classes = classNames('vet360-profile-field-content', {
      'usa-input-error': hasError
    });

    return (
      <div className={classes}>
        {hasError && (
          <div className="usa-input-error-message">
            We couldn’t save your recent {title} update. Please try again later.
          </div>
        )}
        {transaction && isPendingTransaction(transaction) ? (
          <Vet360TransactionPending title={title} refreshTransaction={refreshTransaction}/>
        ) : children}
      </div>
    );
  }
}
