import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { refreshTransaction } from '../actions';

import Vet360TransactionPending from '../components/base/TransactionPending';

import { TRANSACTION_CATEGORY_TYPES } from '../constants';
import { selectVet360PendingCategoryTransactions } from '../selectors';

function Vet360PendingTransactionCategory({
  refreshTransaction: dispatchRefreshTransaction,
  transactions,
  hasPendingCategoryTransaction,
  categoryType,
  children,
}) {
  if (!hasPendingCategoryTransaction) return <div>{children}</div>;

  let plural = 'email';
  if (categoryType === TRANSACTION_CATEGORY_TYPES.PHONE) {
    plural = 'phone numbers';
  } else if (categoryType === TRANSACTION_CATEGORY_TYPES.ADDRESS) {
    plural = 'addresses';
  }

  const refreshAllTransactions = () => {
    transactions.forEach(dispatchRefreshTransaction);
  };

  return (
    <Vet360TransactionPending refreshTransaction={refreshAllTransactions}>
      <AlertBox isVisible status="warning">
        <h4>We’re updating your {plural}</h4>
        <p>
          We’re in the process of saving your changes. We'll show your updated
          information below as soon as it’s finished saving.
        </p>
      </AlertBox>
    </Vet360TransactionPending>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { categoryType } = ownProps;
  const pendingTransactions = selectVet360PendingCategoryTransactions(
    state,
    categoryType,
  );

  return {
    hasPendingCategoryTransaction: pendingTransactions.length > 0,
    transactions: pendingTransactions,
  };
};

const mapDispatchToProps = {
  refreshTransaction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Vet360PendingTransactionCategory);
export { Vet360PendingTransactionCategory };
