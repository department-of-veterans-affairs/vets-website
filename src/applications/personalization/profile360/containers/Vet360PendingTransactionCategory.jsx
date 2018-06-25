import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { TRANSACTION_CATEGORY_TYPES } from '../constants/vet360';
import { selectVet360PendingCategoryTransactions } from '../selectors';

function Vet360PendingTransactionCategory({ hasPendingCategoryTransaction, categoryType, children }) {
  if (!hasPendingCategoryTransaction) return <div>{children}</div>;

  let plural = 'email';
  if (categoryType === TRANSACTION_CATEGORY_TYPES.PHONE) {
    plural = 'phone numbers';
  } else if (categoryType === TRANSACTION_CATEGORY_TYPES.ADDRESS) {
    plural = 'addresses';
  }

  return (
    <AlertBox
      isVisible
      status="warning">
      <h4>We’re updating your {plural}</h4>
      <p>We’re in the process of saving your changes. We'll show your updated information below as soon as it’s finished saving.</p>
    </AlertBox>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { categoryType } = ownProps;
  return {
    hasPendingCategoryTransaction: selectVet360PendingCategoryTransactions(state, categoryType).length > 0
  };
};

export default connect(mapStateToProps, null)(Vet360PendingTransactionCategory);
export { Vet360PendingTransactionCategory };
