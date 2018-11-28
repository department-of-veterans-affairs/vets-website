import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import recordEvent from '../../../../../platform/monitoring/record-event';

import * as VET360 from '../constants';

import { isPendingTransaction } from '../util/transactions';

import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  updateFormField,
  openModal,
} from '../actions';

import {
  selectVet360Field,
  selectVet360Transaction,
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
} from '../selectors';

import Vet360ProfileFieldHeading from '../components/base/ProfileFieldHeading';
import Vet360Transaction from '../components/base/Transaction';

class Vet360ProfileField extends React.Component {
  static propTypes = {
    Content: PropTypes.func.isRequired,
    data: PropTypes.object,
    EditModal: PropTypes.func.isRequired,
    field: PropTypes.object,
    fieldName: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    transaction: PropTypes.object,
    transactionRequest: PropTypes.object,
  };

  onAdd = () => {
    this.captureEvent('add-link');
    this.openEditModal();
  };

  onCancel = () => {
    this.captureEvent('cancel-button');
    this.closeModal();
  };

  onChange = (value, property, skipValidation) => {
    this.props.updateFormField(
      this.props.fieldName,
      this.props.convertNextValueToCleanData,
      this.props.validateCleanData,
      value,
      property,
      skipValidation,
    );
  };

  onDelete = () => {
    let payload = this.props.data;
    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(
        payload,
        this.props.fieldName,
      );
    }

    this.props.createTransaction(
      this.props.apiRoute,
      'DELETE',
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
    );
  };

  onEdit = () => {
    this.captureEvent('edit-link');
    this.openEditModal();
  };

  onSubmit = () => {
    this.captureEvent('update-button');

    let payload = this.props.field.value;
    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(
        payload,
        this.props.fieldName,
      );
    }

    const method = payload.id ? 'PUT' : 'POST';

    this.props.createTransaction(
      this.props.apiRoute,
      method,
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
    );
  };

  clearErrors = () => {
    this.props.clearTransactionRequest(this.props.fieldName);
  };

  closeModal = () => {
    this.props.openModal(null);
  };

  openEditModal = () => {
    this.props.openModal(this.props.fieldName);
  };

  refreshTransaction = () => {
    this.props.refreshTransaction(
      this.props.transaction,
      this.props.analyticsSectionName,
    );
  };

  captureEvent(actionName) {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': this.props.analyticsSectionName,
    });
  }

  isEditLinkVisible = () => {
    let transactionPending = false;
    if (this.props.transaction) {
      transactionPending = isPendingTransaction(this.props.transaction);
    }
    return !this.props.isEmpty && !transactionPending;
  };

  render() {
    const {
      fieldName,
      isEditing,
      isEmpty,
      Content,
      EditModal,
      title,
      transaction,
      transactionRequest,
    } = this.props;

    const childProps = {
      ...this.props,
      refreshTransaction: this.refreshTransaction,
      clearErrors: this.clearErrors,
      onAdd: this.onAdd,
      onEdit: this.onEdit,
      onChange: this.onChange,
      onDelete: this.onDelete,
      onCancel: this.onCancel,
      onSubmit: this.onSubmit,
    };

    return (
      <div className="vet360-profile-field" data-field-name={fieldName}>
        <Vet360ProfileFieldHeading
          onEditClick={this.isEditLinkVisible() && this.onEdit}
        >
          {title}
        </Vet360ProfileFieldHeading>
        {isEditing && <EditModal {...childProps} />}
        <Vet360Transaction
          title={title}
          transaction={transaction}
          transactionRequest={transactionRequest}
          refreshTransaction={this.props.refreshTransaction.bind(
            this,
            transaction,
          )}
        >
          {isEmpty ? (
            <button
              type="button"
              onClick={this.onAdd}
              className="va-button-link va-profile-btn"
            >
              Please add your {title.toLowerCase()}
            </button>
          ) : (
            <Content {...childProps} />
          )}
        </Vet360Transaction>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVet360Transaction(
    state,
    fieldName,
  );
  const data = selectVet360Field(state, fieldName);
  const isEmpty = !data;

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[fieldName],
    data,
    field: selectEditedFormField(state, fieldName),
    isEditing: selectCurrentlyOpenEditModal(state) === fieldName,
    isEmpty,
    transaction,
    transactionRequest,
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createTransaction,
  updateFormField,
};

/**
 * Container used to easily create components for Vet360 contact information.
 * @property {string} fieldName The name of the property as it appears in the user.profile.vet360 object.
 * @property {func} Content The component used to render the read-display of the field.
 * @property {func} EditModal The component used to render the contents of the field's edit-modal.
 * @property {string} title The field name converted to a visible display, such as for labels, modal titles, etc. Example: "mailingAddress" passes "Mailing address" as the title.
 * @property {string} apiRoute The API route used to create/update/delete the Vet360 field.
 * @property {func} convertNextValueToCleanData A function called to derive or make changes to form values after form values are changed in the edit-modal. Called prior to validation.
 * @property {func} validateCleanData A function called to determine validation errors. Called after convertNextValueToCleanData.
 * @property {func} [convertCleanDataToPayload] An optional function used to convert the clean edited data to a payload for sending to the API. Used to remove any values (especially falsy) that may cause errors in Vet360.
 */
const Vet360ProfileFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Vet360ProfileField);

Vet360ProfileFieldContainer.propTypes = {
  fieldName: PropTypes.oneOf(Object.values(VET360.FIELD_NAMES)).isRequired,
  Content: PropTypes.func.isRequired,
  EditModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VET360.API_ROUTES)).isRequired,
  convertNextValueToCleanData: PropTypes.func.isRequired,
  validateCleanData: PropTypes.func.isRequired,
  convertCleanDataToPayload: PropTypes.func,
};

export default Vet360ProfileFieldContainer;
export { Vet360ProfileField };
