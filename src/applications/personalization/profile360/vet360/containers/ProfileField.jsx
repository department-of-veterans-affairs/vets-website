import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import recordEvent from '../../../../../platform/monitoring/record-event';

import * as VET360 from '../../constants/vet360';

import {
  isPendingTransaction
} from '../../util/transactions';

import {
  clearTransactionRequest,
  refreshTransaction,
  updateFormField,
  openModal,
  fieldUpdaters
} from '../actions';

import {
  selectVet360Field,
  selectVet360Transaction,
  selectCurrentlyOpenEditModal,
  selectEditedFormField
} from '../selectors';

import Vet360ProfileFieldHeading from '../components/base/ProfileFieldHeading';
import Vet360Transaction from '../components/base/Transaction';

class Vet360ProfileField extends React.Component {

  static propTypes = {
    clearErrors: PropTypes.func.isRequired,
    Content: PropTypes.func.isRequired,
    data: PropTypes.object,
    EditModal: PropTypes.func.isRequired,
    field: PropTypes.object,
    fieldName: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isEmpty: PropTypes.func,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    refreshTransaction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transaction: PropTypes.object,
    transactionRequest: PropTypes.object
  };

  isEmpty = () => {
    return this.props.isEmpty ? this.props.isEmpty(this.props) : !this.props.data;
  }

  isEditLinKVisible() {
    let transactionPending = false;
    if (this.props.transaction) {
      transactionPending = isPendingTransaction(this.props.transaction);
    }
    return !this.isEmpty() && !transactionPending;
  }

  render() {
    const {
      fieldName,
      isEditing,
      onAdd,
      onEdit,
      Content,
      EditModal,
      title,
      transaction,
      transactionRequest
    } = this.props;

    return (
      <div className="vet360-profile-field" data-field-name={fieldName}>
        <Vet360ProfileFieldHeading onEditClick={this.isEditLinKVisible() && onEdit}>{title}</Vet360ProfileFieldHeading>
        {isEditing && <EditModal {...this.props} isEmpty={this.isEmpty}/>}
        <Vet360Transaction
          title={title}
          transaction={transaction}
          transactionRequest={transactionRequest}
          refreshTransaction={this.props.refreshTransaction.bind(this, transaction)}>
          {this.isEmpty() ? (
            <button
              type="button"
              onClick={onAdd}
              className="va-button-link va-profile-btn">
              Please add your {title.toLowerCase()}
            </button>
          ) : <Content {...this.props}/>}
        </Vet360Transaction>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVet360Transaction(state, fieldName);

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[fieldName],
    data: selectVet360Field(state, fieldName),
    field: selectEditedFormField(state, fieldName),
    isEditing: selectCurrentlyOpenEditModal(state) === fieldName,
    transaction,
    transactionRequest
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    fieldName
  } = ownProps;

  const sectionName = VET360.ANALYTICS_FIELD_MAP[fieldName];

  const captureEvent = (actionName) => {
    if (sectionName && actionName) {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': actionName,
        'profile-section': sectionName,
      });
    }
  };

  const {
    [fieldName]: {
      update: updateField,
      destroy: deleteField
    }
  } = fieldUpdaters;

  const updateFormState = updateFormField[fieldName];

  const closeEditModal = () => dispatch(openModal(null));
  const openEditModal = () => dispatch(openModal(fieldName));

  return {
    clearErrors() {
      dispatch(clearTransactionRequest(fieldName));
    },

    refreshTransaction(transaction) {
      dispatch(refreshTransaction(transaction, sectionName));
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
      dispatch(updateFormState(...args));
    },

    onDelete(...args) {
      dispatch(deleteField(...args));
    },

    onEdit() {
      captureEvent('edit-link');
      openEditModal();
    },

    onSubmit(...args) {
      captureEvent('update-button');
      dispatch(updateField(...args));
    }
  };
};

const Vet360ProfileFieldContainer = connect(mapStateToProps, mapDispatchToProps)(Vet360ProfileField);

Vet360ProfileFieldContainer.propTypes = {
  fieldName: PropTypes.oneOf(Object.values(VET360.FIELD_NAMES)).isRequired,
  Content: PropTypes.func.isRequired,
  EditModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Vet360ProfileFieldContainer;
export { Vet360ProfileField };
