import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import {
  INIT_VET360_ID,
  ANALYTICS_FIELD_MAP,
  API_ROUTES,
  VET360_INITIALIZATION_STATUS
} from '../constants';

import {
  createTransaction,
  fetchTransactions,
  refreshTransaction
} from '../actions';

import {
  selectVet360InitializationStatus
} from '../selectors';

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
      case VET360_INITIALIZATION_STATUS.INITIALIZED:
        return <div data-initialization-status="ready">{this.props.children}</div>;

      case VET360_INITIALIZATION_STATUS.INITIALIZATION_FAILURE:
        return (
          <AlertBox
            data-initialization-status="failure"
            isVisible
            status="info"
            content={<p>We’re sorry. Something went wrong on our end. Please refresh this page or try again later.</p>}/>
        );

      case VET360_INITIALIZATION_STATUS.INITIALIZING:
        return (
          <TransactionPending data-initialization-status="initializing" refreshTransaction={this.refreshTransaction}>
            Initialization in progress...
          </TransactionPending>
        );

      case VET360_INITIALIZATION_STATUS.UNINITALIZED:
      default:
        return <div/>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { status, transaction } = selectVet360InitializationStatus(state, ownProps);
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
