import React from 'react';
import PropTypes from 'prop-types';

import { isPendingTransaction } from 'platform/user/profile/vap-svc/util/transactions';

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

  return (
    <div>
      {transactionRequestPending && (
        <div id={id}>
          <VAPServiceTransactionPending
            title={title}
            refreshTransaction={() => {}}
            method={method}
          >
            {/* if this field's modal is open, pass in the children to prevent
                the `Vet360TransactionPending` component from rendering the
                loading indicator */}
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
                loading indicator */}
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
  id: PropTypes.string.isRequired,
  refreshTransaction: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool,
  // title is undefined upon first render
  title: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
};

export default VAPServiceTransaction;
