import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import recordEvent from '../../../../platform/monitoring/record-event';

import * as VET360 from '../constants/vet360';

import {
  isPendingTransaction,
  isErroredTransaction
} from '../util/transactions';

import {
  clearErrors,
  getTransactionStatus,
  updateFormField,
  openModal,
  saveField
} from '../actions';

import {
  selectVet360Field,
  selectVet360Transaction,
  selectCurrentlyOpenEditModal,
  selectEditedFormField
} from '../selectors';

import HeadingWithEdit from '../components/HeadingWithEdit';

// Transaction component should:
// Render a "request pending" message if transactionRequest.isPending
// Render a "request failed" message if transactionRequest.isFailed
// Dispatches refreshProfile when a transaction status is changed from pending to a success state.
// Render an error message if there is a transaction error. Also, render the children.
// Removes the transaction & request from state when the user clears the corresponding messaging.
// Render the children if there is no transaction or transaction request.

class Vet360TransactionPending extends React.Component {
  componentDidMount() {
    this.interval = window.setInterval(this.props.refreshTransaction, 1000);
  }
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }
  render() {
    return <div>We’re working on saving your new {this.props.title.toLowerCase()}. We’ll show it here once it’s saved.</div>;
  }
}

class Vet360Transaction extends React.Component {
  render() {
    const {
      children,
      refreshTransaction,
      title,
      transaction
    } = this.props;

    return (
      <div className="vet360-profile-field-content">
        {transaction && isErroredTransaction(transaction) && (
          <div className="vet360-profile-field-content-error">We couldn’t save your recent {title} update. Please try again later.</div>
        )}
        {transaction && isPendingTransaction(transaction) ? (
          <Vet360TransactionPending title={title} refreshTransaction={refreshTransaction}/>
        ) : children}
      </div>
    );
  }
}

class Vet360ProfileField extends React.Component {

  isEmpty() {
    return this.props.isEmpty ? this.props.isEmpty(this.props) : !this.props.data;
  }

  isEditLinKVisible() {
    return !this.isEmpty() && !this.props.transaction;
  }

  render() {
    const {
      getTransactionStatus: refreshTransaction,
      isEditing,
      onAdd,
      onEdit,
      renderContent,
      renderEditModal,
      title,
      transaction
    } = this.props;

    return (
      <div className="vet360-profile-field">
        <HeadingWithEdit onEditClick={this.isEditLinKVisible() && onEdit}>{title}</HeadingWithEdit>
        {isEditing && renderEditModal(this.props)}
        <Vet360Transaction
          title={title}
          transaction={transaction}
          refreshTransaction={refreshTransaction.bind(this, transaction)}>
          {this.isEmpty() ? (
            <button
              type="button"
              onClick={onAdd}
              className="va-button-link va-profile-btn">
              Please add your {title.toLowerCase()}
            </button>
          ) : renderContent(this.props)}
        </Vet360Transaction>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVet360Transaction(state, fieldName);

  return {
    data: selectVet360Field(state, fieldName),
    field: selectEditedFormField(state, fieldName),
    isEditing: selectCurrentlyOpenEditModal(state) === fieldName,
    transaction,
    transactionRequest
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // TODO turn analytics back on later
  /* eslint-disable no-unused-vars */

  const {
    fieldName,
    analyticsSectionName: sectionName
  } = ownProps;

  const captureEvent = (actionName) => {
    // if (sectionName && actionName) {
    //   recordEvent({
    //     event: 'profile-navigation',
    //     'profile-action': actionName,
    //     'profile-section': sectionName,
    //   });
    // }
  };

  const closeEditModal = () => dispatch(openModal(null));
  const openEditModal = () => dispatch(openModal(fieldName));

  return {
    clearErrors() {
      dispatch(clearErrors);
    },

    getTransactionStatus(transaction) {
      dispatch(getTransactionStatus(transaction, fieldName));
    },

    onAdd() {
      captureEvent('add-link');
      openEditModal();
    },

    onCancel() {
      captureEvent('cancel-button');
      closeEditModal();
    },

    onChange(...args) {
      dispatch(updateFormField[fieldName](...args));
    },

    onEdit() {
      captureEvent('edit-link');
      openEditModal();
    },

    onSubmit(...args) {
      captureEvent('update-button');
      dispatch(saveField[fieldName](...args));
    }
  };
};

const Vet360ProfileFieldContainer = connect(mapStateToProps, mapDispatchToProps)(Vet360ProfileField);

Vet360ProfileFieldContainer.propTypes = {
  analyticsSectionName: PropTypes.string.isRequired,
  fieldName: PropTypes.oneOf(Object.values(VET360.FIELD_NAMES)).isRequired,
  renderContent: PropTypes.func.isRequired,
  renderEditModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Vet360ProfileFieldContainer;
export { Vet360ProfileField };
