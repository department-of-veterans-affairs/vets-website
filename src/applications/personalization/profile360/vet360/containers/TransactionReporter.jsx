import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '../../../../../platform/utilities/ui/scrollToTop';

import {
  selectVet360FailedTransactions,
  selectMostRecentErroredTransaction,
} from '../selectors';

import { clearTransaction } from '../actions';

import Vet360TransactionErrorBanner from '../components/base/TransactionErrorBanner';

class Vet360TransactionReporter extends React.Component {
  static propTypes = {
    clearTransaction: PropTypes.func.isRequired,
    mostRecentErroredTransaction: PropTypes.object,
    erroredTransactions: PropTypes.array.isRequired,
  };

  componentDidUpdate(prevProps) {
    const newMessageVisible =
      prevProps.erroredTransactions.length <
      this.props.erroredTransactions.length;

    if (newMessageVisible) scrollToTop();
  }

  clearAllErroredTransactions = () => {
    this.props.erroredTransactions.forEach(this.props.clearTransaction);
  };

  render() {
    const { mostRecentErroredTransaction } = this.props;

    return (
      <div className="vet360-transaction-reporter">
        {mostRecentErroredTransaction && (
          <Vet360TransactionErrorBanner
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
  erroredTransactions: selectVet360FailedTransactions(state),
});

const mapDispatchToProps = {
  clearTransaction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Vet360TransactionReporter);
export { Vet360TransactionReporter };
