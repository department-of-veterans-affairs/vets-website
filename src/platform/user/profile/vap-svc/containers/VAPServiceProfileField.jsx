import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const VAPServiceProfileField = ({
  alertClosingDisabled,
  analyticsSectionName,
  apiRoute,
  Content,
  convertCleanDataToPayload,
  createTransaction: createTransactionAction,
  clearTransactionRequest: clearTransactionRequestAction,
  data,
  field,
  fieldName,
  isEditing,
  isEmpty,
  openModal: openModalAction,
  refreshTransaction: refreshTransactionAction,
  showValidationModal,
  title,
  transaction,
  transactionRequest,
  updateFormFieldWithSchema: updateFormFieldWithSchemaAction,
  validateAddress: validateAddressAction,
  ...restProps
}) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const prevTransactionRef = useRef(transaction);
  const prevShowValidationModalRef = useRef(showValidationModal);
  const prevIsEditingRef = useRef(isEditing);

  const justClosedModal = useCallback(
    (prevIsEditingVal, prevShowValidationVal) => {
      return (
        (prevIsEditingVal && !isEditing) ||
        (prevShowValidationVal && !showValidationModal)
      );
    },
    [isEditing, showValidationModal],
  );

  useEffect(
    () => {
      const prevTransaction = prevTransactionRef.current;
      const prevShowValidation = prevShowValidationModalRef.current;
      const prevIsEditingVal = prevIsEditingRef.current;

      const modalOpenInPrevProps =
        prevTransaction || prevShowValidation || prevIsEditingVal;
      const modalIsClosed = !transaction && !showValidationModal && !isEditing;

      if (modalOpenInPrevProps && modalIsClosed) {
        focusElement(`button#${fieldName}-edit-link`);
      }
      // Just close the edit modal if it takes more than 5 seconds for the update
      // transaction to resolve. ie, give it 5 seconds before reverting to the old
      // behavior of showing the "we're saving your new information..." message on
      // the Profile page
      if (!prevTransaction && transaction) {
        setTimeout(() => openModalAction(), 5000);
      }
      if (
        justClosedModal(prevIsEditingVal, prevShowValidation) &&
        transaction
      ) {
        focusElement(`div#${fieldName}-transaction-status`);
      }

      prevTransactionRef.current = transaction;
      prevShowValidationModalRef.current = showValidationModal;
      prevIsEditingRef.current = isEditing;
    },
    [
      transaction,
      showValidationModal,
      isEditing,
      fieldName,
      openModalAction,
      justClosedModal,
    ],
  );

  const captureEvent = useCallback(
    actionName => {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': actionName,
        'profile-section': analyticsSectionName,
      });
    },
    [analyticsSectionName],
  );

  const closeModal = useCallback(
    () => {
      openModalAction(null);
    },
    [openModalAction],
  );

  const openEditModal = useCallback(
    () => {
      openModalAction(fieldName);
      setShowSuccessAlert(false);
    },
    [openModalAction, fieldName],
  );

  const onAdd = useCallback(
    () => {
      captureEvent('add-link');
      openEditModal();
    },
    [captureEvent, openEditModal],
  );

  const onCancel = useCallback(
    () => {
      captureEvent('cancel-button');
      closeModal();
    },
    [captureEvent, closeModal],
  );

  const onChangeFormDataAndSchemas = useCallback(
    (value, schema, uiSchema) => {
      updateFormFieldWithSchemaAction(fieldName, value, schema, uiSchema);
    },
    [updateFormFieldWithSchemaAction, fieldName],
  );

  const onDelete = useCallback(
    () => {
      let payload = data;
      if (convertCleanDataToPayload) {
        payload = convertCleanDataToPayload(payload, fieldName);
      }
      createTransactionAction(
        apiRoute,
        'DELETE',
        fieldName,
        payload,
        analyticsSectionName,
      );
    },
    [
      data,
      convertCleanDataToPayload,
      fieldName,
      createTransactionAction,
      apiRoute,
      analyticsSectionName,
    ],
  );

  const onEdit = useCallback(
    () => {
      captureEvent('edit-link');
      openEditModal();
    },
    [captureEvent, openEditModal],
  );

  const onSubmit = useCallback(
    () => {
      if (!fieldName.toLowerCase().includes('address')) {
        captureEvent('update-button');
      }

      let payload = field.value;
      if (convertCleanDataToPayload) {
        payload = convertCleanDataToPayload(payload, fieldName);
      }

      const method = payload.id ? 'PUT' : 'POST';

      if (fieldName.toLowerCase().includes('address')) {
        validateAddressAction(
          apiRoute,
          method,
          fieldName,
          payload,
          analyticsSectionName,
        );
        return;
      }

      createTransactionAction(
        apiRoute,
        method,
        fieldName,
        payload,
        analyticsSectionName,
      );
    },
    [
      fieldName,
      field,
      convertCleanDataToPayload,
      captureEvent,
      validateAddressAction,
      createTransactionAction,
      apiRoute,
      analyticsSectionName,
    ],
  );

  const handleRefreshTransaction = useCallback(
    () => {
      refreshTransactionAction(transaction, analyticsSectionName);
    },
    [refreshTransactionAction, transaction, analyticsSectionName],
  );

  const clearErrors = useCallback(
    () => {
      clearTransactionRequestAction(fieldName);
    },
    [clearTransactionRequestAction, fieldName],
  );

  const isEditLinkVisible = () => {
    let transactionPending = false;
    if (transaction) {
      transactionPending = isPendingTransaction(transaction);
    }
    return (
      !isEmpty && !(isEditing || showValidationModal) && !transactionPending
    );
  };

  const onSuccessfulSave = useCallback(() => {
    setShowSuccessAlert(true);
  }, []);

  const childProps = {
    ...restProps,
    alertClosingDisabled,
    analyticsSectionName,
    apiRoute,
    Content,
    convertCleanDataToPayload,
    createTransaction: createTransactionAction,
    clearTransactionRequest: clearTransactionRequestAction,
    data,
    field,
    fieldName,
    isEditing,
    isEmpty,
    openModal: openModalAction,
    refreshTransaction: handleRefreshTransaction,
    showValidationModal,
    title,
    transaction,
    transactionRequest,
    updateFormFieldWithSchema: updateFormFieldWithSchemaAction,
    validateAddress: validateAddressAction,
    clearErrors: alertClosingDisabled ? null : clearErrors,
    onAdd,
    onEdit,
    onChangeFormDataAndSchemas,
    onDelete,
    onCancel,
    onSubmit,
  };

  const shouldShowFields = isEditing || showValidationModal;

  return (
    <div className="vet360-profile-field" data-field-name={fieldName}>
      <VAPServiceProfileFieldHeading
        onEditClick={isEditLinkVisible() ? onEdit : null}
        fieldName={fieldName}
      >
        {title}
      </VAPServiceProfileFieldHeading>
      {showSuccessAlert && (
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
          successCallback={() => onSuccessfulSave()}
          cancelCallback={() => onCancel()}
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
            refreshTransactionAction(transaction, analyticsSectionName)
          }
        >
          {!isEmpty && <Content {...childProps} />}
        </VAPServiceTransaction>
      </div>
    </div>
  );
};

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
