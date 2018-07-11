import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';

import {
  selectVet360SuccessfulTransactions,
  selectVet360FailedTransactions,
  selectMostRecentSuccessfulTransaction,
  selectMostRecentErroredTransaction
} from '../selectors';

import {
  clearTransaction
} from '../actions';

import Vet360TransactionSuccessBanner from '../components/Vet360TransactionSuccessBanner';
import Vet360TransactionErrorBanner from '../components/Vet360TransactionErrorBanner';

class Vet360TransactionReporter extends React.Component {
  static propTypes = {
    clearTransaction: PropTypes.func.isRequired,
    mostRecentSuccessfulTransaction: PropTypes.object,
    mostRecentErroredTransaction: PropTypes.object,
    successfulTransactions: PropTypes.array.isRequired,
    erroredTransactions: PropTypes.array.isRequired
  };

  componentDidUpdate(prevProps) {
    const newMessageVisible = (
      prevProps.erroredTransactions.length < this.props.erroredTransactions.length ||
      prevProps.successfulTransactions.length < this.props.successfulTransactions.length
    );

    if (newMessageVisible) scrollToTop();
  }

  clearAllSuccessfulTransactions = () => {
    this.props.successfulTransactions.forEach(this.props.clearTransaction);
  }

  clearAllErroredTransactions = () => {
    this.props.erroredTransactions.forEach(this.props.clearTransaction);
  }

  render() {
    const {
      mostRecentSuccessfulTransaction,
      mostRecentErroredTransaction
    } = this.props;

    return (
      <div className="vet360-transaction-reporter">
        {mostRecentSuccessfulTransaction && (
          <Vet360TransactionSuccessBanner
            clearTransaction={this.clearAllSuccessfulTransactions}/>
        )}
        {mostRecentErroredTransaction && (
          <Vet360TransactionErrorBanner
            transaction={mostRecentErroredTransaction}
            clearTransaction={this.clearAllErroredTransactions}/>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mostRecentSuccessfulTransaction: selectMostRecentSuccessfulTransaction(state),
    mostRecentErroredTransaction: selectMostRecentErroredTransaction(state),
    successfulTransactions: selectVet360SuccessfulTransactions(state),
    erroredTransactions: selectVet360FailedTransactions(state)
  };
};

const mapDispatchToProps = {
  clearTransaction
};

export default connect(mapStateToProps, mapDispatchToProps)(Vet360TransactionReporter);
export { Vet360TransactionReporter };
