import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';

import {
  selectVet360SuccessfulTransactions,
  selectVet360ErroredTransactions
} from '../selectors';

import {
  clearTransaction
} from '../actions';

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
            <AlertBox
              key={transaction.data.attributes.transactionId}
              isVisible
              status="error"
              onCloseAlert={this.props.clearTransaction.bind(null, transaction)}
              content={<div>
                <h3>Your recent profile update didn’t save</h3>
                <p>We’re sorry. Something went wrong on our end and we couldn’t save the recent updates you made to your profile. Please try again later.</p>
              </div>}/>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    successfulTransactions: selectVet360SuccessfulTransactions(state),
    erroredTransactions: selectVet360ErroredTransactions(state)
  };
};

const mapDispatchToProps = {
  clearTransaction
};

export default connect(mapStateToProps, mapDispatchToProps)(Vet360TransactionReporter);
export { Vet360TransactionReporter };
