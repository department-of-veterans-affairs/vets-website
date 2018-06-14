import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import recordEvent from '../../../../platform/monitoring/record-event';

import * as VET360 from '../constants/vet360';

import {
  clearTransactionRequest,
  refreshTransaction,
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
import Vet360Transaction from '../components/Vet360Transaction';

class Vet360ProfileField extends React.Component {

  isEmpty() {
    return this.props.isEmpty ? this.props.isEmpty(this.props) : !this.props.data;
  }

  isEditLinKVisible() {
    return !this.isEmpty() && !this.props.transaction;
  }

  render() {
    const {
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
          refreshTransaction={this.props.refreshTransaction.bind(this, transaction)}>
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
      dispatch(clearTransactionRequest(fieldName));
    },

    refreshTransaction(transaction) {
      dispatch(refreshTransaction(transaction));
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
