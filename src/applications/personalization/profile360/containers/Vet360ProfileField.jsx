import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import recordEvent from '../../../../platform/monitoring/record-event';

import * as VET360 from '../constants/vet360';

import {
  clearErrors,
  getTransactionStatus,
  updateFormField,
  openModal,
  saveField
} from '../actions';

class Vet360ProfileField extends React.Component {
  render() {
    const { Component } = this.props;
    return <Component {...this.props}/>;
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
  Component: PropTypes.func.isRequired
};

export default Vet360ProfileFieldContainer;
export { Vet360ProfileField };
