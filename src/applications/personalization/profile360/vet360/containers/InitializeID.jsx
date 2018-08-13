import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import {
  INIT_VET360_ID,
  ANALYTICS_FIELD_MAP,
  API_ROUTES
} from '../constants';

import {
  createTransaction,
  fetchTransactions,
  refreshTransaction
} from '../actions';

import {
  selectIsVet360AvailableForUser,
  selectVet360Transaction
} from '../selectors';

import {
  isFailedTransaction,
  isPendingTransaction
} from '../util/transactions';

import TransactionPending from '../components/base/TransactionPending';

export const VET360_STATUS = {
  READY: 'READY',
  UNINITALIZED: 'UNINITALIZED',
  INITIALIZING: 'INITIALIZING',
  INITIALIZATION_FAILURE: 'INITIALIZATION_FAILURE'
};

class InitializeVet360ID extends React.Component {
  componentDidMount() {
    if (this.props.status === VET360_STATUS.READY) {
      this.props.fetchTransactions();
    } else {
      this.initializeVet360ID();
    }
  }

  initializeVet360ID() {
    const route = API_ROUTES.INIT_VET360_ID;
    const fieldName = this.props.transactionID;
    const method = 'POST';
    const body = null;
    const analytics = this.props.analyticsSectionName;
    return this.props.createTransaction(route, method, fieldName, body, analytics);
  }

  refreshTransaction = () => {
    this.props.refreshTransaction(this.props.transaction, this.props.analyticsSectionName);
  }

  render() {
    switch (this.props.status) {
      case VET360_STATUS.READY:
        return <div data-initialization-status="ready">{this.props.children}</div>;

      case VET360_STATUS.INITIALIZATION_FAILURE:
        return (
          <AlertBox
            data-initialization-status="failure"
            isVisible
            status="info"
            content={<p>We’re sorry. Something went wrong on our end. Please refresh this page or try again later.</p>}/>
        );

      case VET360_STATUS.INITIALIZING:
        return (
          <TransactionPending data-initialization-status="initializing" refreshTransaction={this.refreshTransaction}>
            Initialization in progress...
          </TransactionPending>
        );

      case VET360_STATUS.UNINITALIZED:
      default:
        return <div/>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let status = VET360_STATUS.UNINITALIZED;

  const  { transaction, transactionRequest } = selectVet360Transaction(state, ownProps.transactionID);
  const isReady = selectIsVet360AvailableForUser(state);
  let isPending = false;
  let isFailure = false;

  if (transactionRequest) {
    isPending = transactionRequest.isPending || (transaction && isPendingTransaction(transaction));
    isFailure = transactionRequest.isFailed || (transaction && isFailedTransaction(transaction));
  }

  if (isReady) {
    status = VET360_STATUS.READY;
  } else if (isPending) {
    status = VET360_STATUS.INITIALIZING;
  } else if (isFailure) {
    status = VET360_STATUS.INITIALIZATION_FAILURE;
  }

  return {
    status,
    transaction
  };
};

const mapDispatchToProps = {
  createTransaction,
  fetchTransactions,
  refreshTransaction
};

/**
 * A Container for initializing the user into Vet360 if they are not already. Otherwise, this container will initialize the Vet360 app state by fetching all transactions.
 */
const InitializeVet360IDContainer = connect(mapStateToProps, mapDispatchToProps)(InitializeVet360ID);

InitializeVet360IDContainer.defaultProps = {
  transactionID: INIT_VET360_ID,
  analyticsSectionName: ANALYTICS_FIELD_MAP.INIT_VET360_ID
};

export default InitializeVet360IDContainer;
export { InitializeVet360ID };
