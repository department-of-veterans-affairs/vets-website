import React from 'react';
import { connect } from 'react-redux';

import {
  INIT_VAP_SERVICE_ID,
  ANALYTICS_FIELD_MAP,
  API_ROUTES,
  VAP_SERVICE_INITIALIZATION_STATUS,
} from '../constants';

import {
  createTransaction,
  fetchTransactions,
  refreshTransaction,
} from '../actions';

import { selectVAPServiceInitializationStatus } from '../selectors';

import TransactionPending from '../components/base/VAPServiceTransactionPending';

class InitializeVAPServiceID extends React.Component {
  componentDidMount() {
    if (this.props.status === VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZED) {
      this.props.fetchTransactions();
    } else {
      this.initializeVAPServiceID();
    }
  }

  initializeVAPServiceID() {
    const route = API_ROUTES.INIT_VAP_SERVICE_ID;
    const fieldName = INIT_VAP_SERVICE_ID;
    const method = 'POST';
    const body = null;
    const analytics = ANALYTICS_FIELD_MAP.INIT_VAP_SERVICE_ID;
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
      ANALYTICS_FIELD_MAP.INIT_VAP_SERVICE_ID,
      initializationTransactionRefreshRoute,
    );
  };

  render() {
    switch (this.props.status) {
      case VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZED:
        return <>{this.props.children}</>;

      case VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZATION_FAILURE:
        return (
          <va-alert visible status="info" uswds>
            We’re sorry. Something went wrong on our end. Please refresh this
            page or try again later.
          </va-alert>
        );

      case VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZING:
        return (
          <TransactionPending refreshTransaction={this.refreshTransaction}>
            Initialization in progress...
          </TransactionPending>
        );

      case VAP_SERVICE_INITIALIZATION_STATUS.UNINITIALIZED:
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
  } = selectVAPServiceInitializationStatus(state);
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
 * A Container for initializing the user into VA Profile if they are not
 * already. Otherwise, this container will initialize the Profile app state by
 * fetching all transactions.
 */
const InitializeVAPServiceIDContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitializeVAPServiceID);

export default InitializeVAPServiceIDContainer;
export { InitializeVAPServiceID };
