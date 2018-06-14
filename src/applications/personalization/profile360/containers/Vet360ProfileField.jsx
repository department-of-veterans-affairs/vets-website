import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import recordEvent from '../../../../platform/monitoring/record-event';
import HeadingWithEdit from '../components/HeadingWithEdit';
import Transaction from '../components/Transaction';
import * as VET360 from '../constants/vet360';

import {
  clearErrors,
  getTransactionStatus,
  updateFormField,
  openModal,
  saveField
} from '../actions';

class Vet360ProfileField extends React.Component {

  isEmpty() {
    return this.props.isEmpty ? this.props.isEmpty(this.props) : !this.props.data;
  }

  isEditLinKVisible() {
    return !this.isEmpty() && !this.props.transaction;
  }

  renderEmptyState = () => {
    return (
      <button
        type="button"
        onClick={this.props.onAdd}
        className="va-button-link va-profile-btn">
        Please add your {this.props.title.toLowerCase()}
      </button>
    );
  }

  renderTransaction = () => {
    return (
      <Transaction
        transaction={this.props.transaction}
        getTransactionStatus={this.props.getTransactionStatus}
        fieldType={this.props.title.toLowerCase()}/>
    );
  }

  renderEditModal = () => {
    const EditModal = this.props.renderEditModal;
    if (!EditModal) throw new Error('Missing prop: renderEditModal');

    return <EditModal {...this.props}/>;
  }

  render() {
    const {
      isEditing,
      onEdit,
      title,
      transaction
    } = this.props;

    let content = null;

    if (transaction) {
      content = this.renderTransaction();
    } else if (this.isEmpty()) {
      content = this.renderEmptyState();
    } else {
      content = this.props.renderContent(this.props);
    }

    return (
      <div className="vet360-profile-field">
        <HeadingWithEdit onEditClick={this.isEditLinKVisible() && onEdit}>{title}</HeadingWithEdit>
        {isEditing && this.renderEditModal()}
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const {
    user: {
      profile: {
        vet360: {
          [fieldName]: existingFieldData
        }
      }
    },
    vaProfile: {
      modal: currentlyOpenEditModal,
      formFields: {
        [fieldName]: existingFieldValue
      }
    },

    vet360: {
      transactions,
      fieldTransactionMap
    }
  } = state;

  const fieldTransactionData = fieldTransactionMap[fieldName];
  let transaction = null;

  if (fieldTransactionData && fieldTransactionData.transactionId) {
    transaction = transactions.find(t => t.data.attributes.transactionId === fieldTransactionData.transactionId);
  }

  return {
    data: existingFieldData,
    field: existingFieldValue,
    isEditing: currentlyOpenEditModal === fieldName,
    transaction
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
