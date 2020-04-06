import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import recordEvent from 'platform/monitoring/record-event';

import * as VET360 from '../constants';

import { isPendingTransaction } from '../util/transactions';

import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  updateFormFieldWithSchema,
  openModal,
  validateAddress,
} from '../actions';

import {
  selectVet360Field,
  selectVet360Transaction,
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
  vaProfileUseAddressValidation,
} from '../selectors';

import Vet360ProfileFieldHeading from '../components/base/Vet360ProfileFieldHeading';
import Vet360Transaction from '../components/base/Vet360Transaction';

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

  static defaultProps = {
    fieldName: '',
  };

  componentDidUpdate(prevProps) {
    const { transaction, showValidationModal, isEditing } = prevProps;
    const modalOpenInPrevProps =
      transaction || showValidationModal || isEditing;
    const modalIsClosed =
      !this.props.transaction &&
      !this.props.showValidationModal &&
      !this.props.isEditing;

    if (modalOpenInPrevProps && modalIsClosed) {
      focusElement(`button#${this.props.fieldName}-edit-link`);
    }
    // Just close the edit modal if it takes more than 5 seconds for the update
    // transaction to resolve. ie, give it 5 seconds before reverting to the old
    // behavior of showing the "we're saving your new information..." message on
    // the Profile page
    if (!prevProps.transaction && this.props.transaction) {
      setTimeout(() => this.props.openModal(), 5000);
    }
    if (this.justClosedModal(prevProps, this.props) && this.props.transaction) {
      focusElement(`div#${this.props.fieldName}-transaction-status`);
    }
  }

  onAdd = () => {
    this.captureEvent('add-link');
    this.openEditModal();
  };

  onCancel = () => {
    this.captureEvent('cancel-button');
    this.closeModal();
  };

  onChangeFormDataAndSchemas = (value, schema, uiSchema) => {
    this.props.updateFormFieldWithSchema(
      this.props.fieldName,
      value,
      schema,
      uiSchema,
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
    // The validateAddress thunk will handle its own dataLayer additions
    if (this.props.useAddressValidation) {
      if (!this.props.fieldName.toLowerCase().includes('address')) {
        this.captureEvent('update-button');
      }
    } else {
      this.captureEvent('update-button');
    }

    let payload = this.props.field.value;
    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(
        payload,
        this.props.fieldName,
      );
    }

    const method = payload.id ? 'PUT' : 'POST';

    if (
      this.props.fieldName.toLowerCase().includes('address') &&
      this.props.useAddressValidation
    ) {
      this.props.validateAddress(
        this.props.apiRoute,
        method,
        this.props.fieldName,
        payload,
        this.props.analyticsSectionName,
      );
      return;
    }

    this.props.createTransaction(
      this.props.apiRoute,
      method,
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
    );
  };

  justClosedModal(prevProps, props) {
    return (
      (prevProps.isEditing && !props.isEditing) ||
      (prevProps.showValidationModal && !props.showValidationModal)
    );
  }

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
    return (
      !this.props.isEmpty &&
      (!transactionPending ||
        this.props.isEditing ||
        this.props.showValidationModal)
    );
  };

  render() {
    const {
      analyticsSectionName,
      fieldName,
      isEditing,
      isEmpty,
      Content,
      EditModal,
      ValidationModal,
      showValidationModal,
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
      onChangeFormDataAndSchemas: this.onChangeFormDataAndSchemas,
      onDelete: this.onDelete,
      onCancel: this.onCancel,
      onSubmit: this.onSubmit,
    };

    return (
      <div className="vet360-profile-field" data-field-name={fieldName}>
        <Vet360ProfileFieldHeading
          onEditClick={this.isEditLinkVisible() ? this.onEdit : null}
          fieldName={fieldName}
        >
          {title}
        </Vet360ProfileFieldHeading>
        {isEditing && <EditModal {...childProps} />}
        {showValidationModal && (
          <ValidationModal
            transaction={transaction}
            transactionRequest={transactionRequest}
            title={title}
            clearErrors={this.clearErrors}
          />
        )}
        <Vet360Transaction
          isModalOpen={isEditing || showValidationModal}
          id={`${fieldName}-transaction-status`}
          title={title}
          transaction={transaction}
          transactionRequest={transactionRequest}
          refreshTransaction={() =>
            this.props.refreshTransaction(transaction, analyticsSectionName)
          }
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

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVet360Transaction(
    state,
    fieldName,
  );
  const data = selectVet360Field(state, fieldName);
  const isEmpty = !data;
  const useAddressValidation = vaProfileUseAddressValidation(state);
  const addressValidationType =
    state.vet360.addressValidation.addressValidationType;
  const showValidationModal =
    useAddressValidation &&
    ownProps.ValidationModal &&
    addressValidationType === fieldName &&
    selectCurrentlyOpenEditModal(state) === 'addressValidation';

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[fieldName],
    data,
    fieldName,
    field: selectEditedFormField(state, fieldName),
    isEditing: selectCurrentlyOpenEditModal(state) === fieldName,
    showValidationModal: !!showValidationModal,
    isEmpty,
    transaction,
    transactionRequest,
    useAddressValidation,
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createTransaction,
  updateFormFieldWithSchema,
  validateAddress,
};

/**
 * Container used to easily create components for Vet360 contact information.
 * @property {string} fieldName The name of the property as it appears in the user.profile.vet360 object.
 * @property {func} Content The component used to render the read-display of the field.
 * @property {func} EditModal The component used to render the contents of the field's edit-modal.
 * @property {string} title The field name converted to a visible display, such as for labels, modal titles, etc. Example: "mailingAddress" passes "Mailing address" as the title.
 * @property {string} apiRoute The API route used to create/update/delete the Vet360 field.
 * @property {func} convertNextValueToCleanData A function called to derive or make changes to form values after form values are changed in the edit-modal. Called prior to validation.
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
  ValidationModal: PropTypes.func,
  title: PropTypes.string.isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VET360.API_ROUTES)).isRequired,
  convertCleanDataToPayload: PropTypes.func,
};

export default Vet360ProfileFieldContainer;
export { Vet360ProfileField };
