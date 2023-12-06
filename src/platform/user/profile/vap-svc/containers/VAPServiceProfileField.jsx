import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import recordEvent from 'platform/monitoring/record-event';

import * as VAP_SERVICE from '../constants';

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
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
} from '../selectors';

import VAPServiceProfileFieldHeading from '../components/base/VAPServiceProfileFieldHeading';
import VAPServiceTransaction from '../components/base/VAPServiceTransaction';
import ProfileInformationFieldController from '../components/ProfileInformationFieldController';
import ContactInformationUpdateSuccessAlert from '../components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

class VAPServiceProfileField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuccessAlert: false,
    };
  }

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
    if (!this.props.fieldName.toLowerCase().includes('address')) {
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

    if (this.props.fieldName.toLowerCase().includes('address')) {
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
    this.setState(state => ({ ...state, showSuccessAlert: false }));
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
      !(this.props.isEditing || this.props.showValidationModal) &&
      !transactionPending
    );
  };

  onSuccessfulSave = () => {
    this.setState({ showSuccessAlert: true });
  };

  render() {
    const {
      analyticsSectionName,
      fieldName,
      isEditing,
      isEmpty,
      Content,
      showValidationModal,
      title,
      transaction,
      transactionRequest,
      alertClosingDisabled,
    } = this.props;

    const childProps = {
      ...this.props,
      refreshTransaction: this.refreshTransaction,
      clearErrors: alertClosingDisabled ? null : this.clearErrors,
      onAdd: this.onAdd,
      onEdit: this.onEdit,
      onChangeFormDataAndSchemas: this.onChangeFormDataAndSchemas,
      onDelete: this.onDelete,
      onCancel: this.onCancel,
      onSubmit: this.onSubmit,
    };

    const shouldShowFields = isEditing || showValidationModal;

    return (
      <div className="vet360-profile-field" data-field-name={fieldName}>
        <VAPServiceProfileFieldHeading
          onEditClick={this.isEditLinkVisible() ? this.onEdit : null}
          fieldName={fieldName}
        >
          {title}
        </VAPServiceProfileFieldHeading>
        {this.state.showSuccessAlert && (
          <ContactInformationUpdateSuccessAlert fieldName={fieldName} />
        )}
        <div
          className={
            shouldShowFields ? 'vads-u-display--block' : 'vads-u-display--none'
          }
        >
          <ProfileInformationFieldController
            fieldName={fieldName}
            isDeleteDisabled
            successCallback={() => this.onSuccessfulSave()}
            cancelCallback={() => this.onCancel()}
          />
        </div>
        <div
          className={
            !shouldShowFields ? 'vads-u-display--block' : 'vads-u-display--none'
          }
        >
          <VAPServiceTransaction
            isModalOpen={isEditing || showValidationModal}
            id={`${fieldName}-transaction-status`}
            title={title}
            transaction={transaction}
            transactionRequest={transactionRequest}
            refreshTransaction={() =>
              this.props.refreshTransaction(transaction, analyticsSectionName)
            }
          >
            {!isEmpty && <Content {...childProps} />}
          </VAPServiceTransaction>
        </div>
      </div>
    );
  }
}

VAPServiceProfileField.propTypes = {
  Content: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
  field: PropTypes.object,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
};

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    fieldName,
  );
  const data = selectVAPContactInfoField(state, fieldName);
  const isEmpty = !data;
  const { addressValidationType } = state.vapService.addressValidation;
  const showValidationModal =
    addressValidationType === fieldName &&
    selectCurrentlyOpenEditModal(state) === 'addressValidation';

  return {
    analyticsSectionName: VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName],
    data,
    fieldName,
    field: selectEditedFormField(state, fieldName),
    isEditing: selectCurrentlyOpenEditModal(state) === fieldName,
    showValidationModal: !!showValidationModal,
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
  updateFormFieldWithSchema,
  validateAddress,
};

/**
 * Container used to easily create components for VA Profile Service-backed contact information.
 * @property {string} fieldName The name of the property as it appears in the user.profile.vapContactInfo object.
 * @property {func} Content The component used to render the read-display of the field.
 * @property {string} title The field name converted to a visible display, such as for labels, modal titles, etc. Example: "mailingAddress" passes "Mailing address" as the title.
 * @property {string} apiRoute The API route used to create/update/delete the Vet360 field.
 * @property {func} convertNextValueToCleanData A function called to derive or make changes to form values after form values are changed in the edit-modal. Called prior to validation.
 * @property {func} [convertCleanDataToPayload] An optional function used to convert the clean edited data to a payload for sending to the API. Used to remove any values (especially falsy) that may cause errors in Vet360.
 */
const VAPServiceProfileFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAPServiceProfileField);

VAPServiceProfileFieldContainer.propTypes = {
  Content: PropTypes.func.isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  title: PropTypes.string.isRequired,
  convertCleanDataToPayload: PropTypes.func,
  deleteDisabled: PropTypes.bool,
};

export default VAPServiceProfileFieldContainer;
export { VAPServiceProfileField };
