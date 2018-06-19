import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';

import {
  selectVet360SuccessfulTransactions,
  selectVet360FailedTransactions
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

  render() {
    const {
      successfulTransactions,
      erroredTransactions
    } = this.props;

    return (
      <div className="vet360-transaction-reporter">
        {successfulTransactions.map((transaction) => {
          return (
            <AlertBox
              key={transaction.data.attributes.transactionId}
              isVisible
              status="success"
              onCloseAlert={this.props.clearTransaction.bind(null, transaction)}
              content={<h3>Your recent profile update finished.</h3>}/>
          );
        })}
        {erroredTransactions.map((transaction) => {
          return (
            <Vet360TransactionErrorBanner
              key={transaction.data.attributes.transactionId}
              transaction={transaction}
              clearTransaction={this.props.clearTransaction.bind(null, transaction)}/>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    successfulTransactions: selectVet360SuccessfulTransactions(state),
    erroredTransactions: selectVet360FailedTransactions(state)
  };
};

const mapDispatchToProps = {
  clearTransaction
};

export default connect(mapStateToProps, mapDispatchToProps)(Vet360TransactionReporter);
export { Vet360TransactionReporter };
