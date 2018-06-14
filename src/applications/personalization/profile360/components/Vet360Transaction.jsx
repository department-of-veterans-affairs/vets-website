import React from 'react';

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

    return (
      <div className="vet360-profile-field-content">
        {transaction && isErroredTransaction(transaction) && (
          <div className="vet360-profile-field-content-error">We couldn’t save your recent {title} update. Please try again later.</div>
        )}
        {transaction && isPendingTransaction(transaction) ? (
          <Vet360TransactionPending title={title} refreshTransaction={refreshTransaction}/>
        ) : children}
      </div>
    );
  }
}
