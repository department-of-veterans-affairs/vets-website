import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import {
  INIT_VET360_ID,
  ANALYTICS_FIELD_MAP,
  API_ROUTES,
  VET360_INITIALIZATION_STATUS,
} from '../constants';

import {
  createTransaction,
  fetchTransactions,
  refreshTransaction,
} from '../actions';

import { selectVet360InitializationStatus } from '../selectors';

import TransactionPending from '../components/base/TransactionPending';

class InitializeVet360ID extends React.Component {
  componentDidMount() {
    if (this.props.status === VET360_INITIALIZATION_STATUS.INITIALIZED) {
      this.props.fetchTransactions();
    } else {
      this.initializeVet360ID();
    }
  }

  initializeVet360ID() {
    const route = API_ROUTES.INIT_VET360_ID;
    const fieldName = INIT_VET360_ID;
    const method = 'POST';
    const body = null;
    const analytics = ANALYTICS_FIELD_MAP.INIT_VET360_ID;
    return this.props.createTransaction(
      route,
      method,
      fieldName,
      body,
      analytics,
    );
  }

  refreshTransaction = () => {
    // "INITIALIZING" is also the status for when the request to create the transaction is pending, so
    // we have to make sure that isn't the case when we try to refresh the transaction because that would
    // means this.props.transaction is null.
    if (this.props.transactionRequest.isPending) return;

    const { transactionId } = this.props.transaction.data.attributes;
    const initializationTransactionRefreshRoute = `/profile/person/status/${transactionId}`;
    this.props.refreshTransaction(
      this.props.transaction,
      ANALYTICS_FIELD_MAP.INIT_VET360_ID,
      initializationTransactionRefreshRoute,
    );
  };

  render() {
    switch (this.props.status) {
      case VET360_INITIALIZATION_STATUS.INITIALIZED:
        return <div>{this.props.children}</div>;

      case VET360_INITIALIZATION_STATUS.INITIALIZATION_FAILURE:
        return (
          <AlertBox
            isVisible
            status="info"
            content={
              <p>
                We’re sorry. Something went wrong on our end. Please refresh
                this page or try again later.
              </p>
            }
          />
        );

      case VET360_INITIALIZATION_STATUS.INITIALIZING:
        return (
          <TransactionPending refreshTransaction={this.refreshTransaction}>
            Initialization in progress...
          </TransactionPending>
        );

      case VET360_INITIALIZATION_STATUS.UNINITALIZED:
      default:
        return <div />;
    }
  }
}

const mapStateToProps = state => {
  const {
    status,
    transaction,
    transactionRequest,
  } = selectVet360InitializationStatus(state);
  return {
    status,
    transaction,
    transactionRequest,
  };
};

const mapDispatchToProps = {
  createTransaction,
  fetchTransactions,
  refreshTransaction,
};

/**
 * A Container for initializing the user into Vet360 if they are not already. Otherwise, this container will initialize the Vet360 app state by fetching all transactions.
 */
const InitializeVet360IDContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitializeVet360ID);

export default InitializeVet360IDContainer;
export { InitializeVet360ID };
