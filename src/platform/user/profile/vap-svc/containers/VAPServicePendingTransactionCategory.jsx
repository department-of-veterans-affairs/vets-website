import React from 'react';
import { connect } from 'react-redux';

import { refreshTransaction } from '../actions';

import VAPServiceTransactionPending from '../components/base/VAPServiceTransactionPending';

import { TRANSACTION_CATEGORY_TYPES } from '../constants';
import { selectVAPServicePendingCategoryTransactions } from '../selectors';

function VAPServicePendingTransactionCategory({
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
    transactions.forEach(transaction => {
      dispatchRefreshTransaction(transaction);
    });
  };

  return (
    <VAPServiceTransactionPending refreshTransaction={refreshAllTransactions}>
      <va-alert visible status="warning" uswds>
        <h4 slot="headline">We’re updating your {plural}</h4>
        <p>
          We’re in the process of saving your changes. We'll show your updated
          information below as soon as it’s finished saving.
        </p>
      </va-alert>
    </VAPServiceTransactionPending>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { categoryType } = ownProps;
  const pendingTransactions = selectVAPServicePendingCategoryTransactions(
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
)(VAPServicePendingTransactionCategory);
export {
  VAPServicePendingTransactionCategory as Vet360PendingTransactionCategory,
};
