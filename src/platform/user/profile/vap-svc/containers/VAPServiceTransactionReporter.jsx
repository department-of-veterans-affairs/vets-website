import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import scrollToTop from 'platform/utilities/ui/scrollToTop';

import {
  selectVAPServiceFailedTransactions,
  selectMostRecentErroredTransaction,
} from '../selectors';

import { clearTransaction } from '../actions';

import VAPServiceTransactionErrorBanner from '../components/base/VAPServiceTransactionErrorBanner';

const VAPServiceTransactionReporter = ({
  clearTransaction: clearTransactionAction,
  erroredTransactions,
  mostRecentErroredTransaction,
}) => {
  const clearAllErroredTransactions = useCallback(
    () => {
      erroredTransactions.forEach(clearTransactionAction);
    },
    [erroredTransactions, clearTransactionAction],
  );

  return (
    <div className="vet360-transaction-reporter">
      {mostRecentErroredTransaction && (
        <VAPServiceTransactionErrorBanner
          transaction={mostRecentErroredTransaction}
          clearTransaction={clearAllErroredTransactions}
        />
      )}
    </div>
  );
};

VAPServiceTransactionReporter.propTypes = {
  clearTransaction: PropTypes.func.isRequired,
  erroredTransactions: PropTypes.array.isRequired,
  mostRecentErroredTransaction: PropTypes.object,
};

const mapStateToProps = state => ({
  mostRecentErroredTransaction: selectMostRecentErroredTransaction(state),
  erroredTransactions: selectVAPServiceFailedTransactions(state),
});

const mapDispatchToProps = {
  clearTransaction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAPServiceTransactionReporter);
export { VAPServiceTransactionReporter };
