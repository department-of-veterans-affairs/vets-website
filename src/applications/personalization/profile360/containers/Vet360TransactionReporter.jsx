import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

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

import Vet360TransactionErrorBanner from '../components/Vet360TransactionErrorBanner';

class Vet360TransactionReporter extends React.Component {
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
          <AlertBox
            isVisible
            status="success"
            onCloseAlert={this.clearAllSuccessfulTransactions}
            content={<h4>We saved your updated information.</h4>}/>
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
