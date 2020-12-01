import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';

import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import {
  isFailedTransaction,
  isPendingTransaction,
} from '@@vap-svc/util/transactions';
import VAPServiceEditModalErrorMessage from '@@vap-svc/components/base/VAPServiceEditModalErrorMessage';
import ContactInformationActionButtons from './ContactInformationActionButtons';
import ContactInfoForm from '@@vap-svc/components/ContactInfoForm';
import { FIELD_NAMES } from '@@vap-svc/constants';
import CopyMailingAddress from '@@vap-svc/containers/CopyMailingAddress';

class ContactInformationEditView extends Component {
  static propTypes = {
    analyticsSectionName: PropTypes.string.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getInitialFormValues: PropTypes.func.isRequired,
    field: PropTypes.shape({
      value: PropTypes.object,
      validations: PropTypes.object,
    }),
    hasValidationError: PropTypes.func,
    isEmpty: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChangeFormDataAndSchemas: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    refreshTransaction: PropTypes.func,
    title: PropTypes.string.isRequired,
    transaction: PropTypes.object,
    transactionRequest: PropTypes.object,
    useSchemaForm: PropTypes.bool,
  };

  componentDidMount() {
    this.props.onChangeFormDataAndSchemas(
      this.props.getInitialFormValues(),
      this.props.formSchema,
      this.props.uiSchema,
    );
  }

  componentDidUpdate(prevProps) {
    // if the transaction just became pending, start calling the
    // refreshTransaction() on an interval
    if (
      isPendingTransaction(this.props.transaction) &&
      !isPendingTransaction(prevProps.transaction)
    ) {
      this.interval = window.setInterval(
        this.props.refreshTransaction,
        window.VetsGov.pollTimeout || 1000,
      );
    }
    // if the transaction is no longer pending, stop refreshing it
    if (
      isPendingTransaction(prevProps.transaction) &&
      !isPendingTransaction(this.props.transaction)
    ) {
      window.clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    // Errors returned directly from the API request (as opposed through a transaction lookup) are
    // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
    // for the next time the modal is opened by removing any existing transaction request from the store.
    if (this.props.transactionRequest?.error) {
      this.props.clearErrors();
    }
  }

  onSubmit = () => {
    this.props.onSubmit(this.props.field.value);
  };

  render() {
    const {
      onSubmit,
      props: {
        analyticsSectionName,
        clearErrors,
        deleteDisabled,
        field,
        hasUnsavedEdits,
        isEmpty,
        onCancel,
        onDelete,
        title,
        transaction,
        transactionRequest,
        type,
      },
    } = this;

    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);
    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    const actionButtons = (
      <ContactInformationActionButtons
        onCancel={onCancel}
        onDelete={onDelete}
        title={title}
        analyticsSectionName={analyticsSectionName}
        isLoading={isLoading}
        deleteEnabled={!isEmpty && !deleteDisabled}
      >
        <div>
          <LoadingButton
            data-action="save-edit"
            data-testid="save-edit-button"
            isLoading={isLoading}
            className="vads-u-width--auto vads-u-margin-top--0"
            disabled={!hasUnsavedEdits}
          >
            Update
          </LoadingButton>

          {!isLoading && (
            <button
              type="button"
              className="usa-button-secondary vads-u-margin-top--0 vads-u-width--auto"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </ContactInformationActionButtons>
    );

    return (
      <>
        {error && (
          <div
            className="vads-u-margin-bottom--1"
            data-testid="edit-error-alert"
          >
            <VAPServiceEditModalErrorMessage
              title={title}
              error={error}
              clearErrors={clearErrors}
            />
          </div>
        )}

        {!!field && (
          <div>
            {this.props.fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS && (
              <CopyMailingAddress
                copyMailingAddress={this.copyMailingAddress}
              />
            )}
            <ContactInfoForm
              formData={this.props.field.value}
              formSchema={this.props.field.formSchema}
              uiSchema={this.props.field.uiSchema}
              onUpdateFormData={
                type === 'address'
                  ? this.onInput
                  : this.props.onChangeFormDataAndSchemas
              }
              onSubmit={onSubmit}
            >
              {actionButtons}
            </ContactInfoForm>
          </div>
        )}
      </>
    );
  }
}

export default memo(ContactInformationEditView);
