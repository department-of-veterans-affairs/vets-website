import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import scrollToTop from 'platform/utilities/ui/scrollToTop';

import {
  selectVAPServiceFailedTransactions,
  selectMostRecentErroredTransaction,
} from '../selectors';

import { clearTransaction } from '../actions';

import VAPServiceTransactionErrorBanner from '../components/base/VAPServiceTransactionErrorBanner';

class VAPServiceTransactionReporter extends React.Component {
  static propTypes = {
    clearTransaction: PropTypes.func.isRequired,
    mostRecentErroredTransaction: PropTypes.object,
    erroredTransactions: PropTypes.array.isRequired,
  };

  /*
  componentDidUpdate(prevProps) {
    const newMessageVisible =
      prevProps.erroredTransactions.length <
      this.props.erroredTransactions.length;

    if (newMessageVisible) scrollToTop();
  }
  */

  clearAllErroredTransactions = () => {
    this.props.erroredTransactions.forEach(this.props.clearTransaction);
  };

  render() {
    const { mostRecentErroredTransaction } = this.props;

    return (
      <div className="vet360-transaction-reporter">
        {mostRecentErroredTransaction && (
          <VAPServiceTransactionErrorBanner
            transaction={mostRecentErroredTransaction}
            clearTransaction={this.clearAllErroredTransactions}
          />
        )}
      </div>
    );
  }
}

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
