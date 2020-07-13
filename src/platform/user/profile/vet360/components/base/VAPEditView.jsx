import React from 'react';
import PropTypes from 'prop-types';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import {
  isFailedTransaction,
  isPendingTransaction,
} from 'vet360/util/transactions';
import Vet360EditModalActionButtons from './Vet360EditModalActionButtons';
import Vet360EditModalErrorMessage from './Vet360EditModalErrorMessage';

export default class VAPEditView extends React.Component {
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
    render: PropTypes.func.isRequired,
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
      this.interval = window.setInterval(this.props.refreshTransaction, 1000);
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
        isEmpty,
        onCancel,
        onDelete,
        render,
        title,
        transaction,
        transactionRequest,
      },
    } = this;

    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);
    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    const actionButtons = (
      <Vet360EditModalActionButtons
        onCancel={onCancel}
        onDelete={onDelete}
        title={title}
        analyticsSectionName={analyticsSectionName}
        transactionRequest={transactionRequest}
        deleteEnabled={!isEmpty && !deleteDisabled}
      >
        <LoadingButton data-action="save-edit" isLoading={isLoading}>
          Update
        </LoadingButton>
        <button
          type="button"
          className="va-button-link vads-u-margin-left--1"
          onClick={onCancel}
        >
          Cancel
        </button>
      </Vet360EditModalActionButtons>
    );

    return (
      <>
        {error && (
          <div className="vads-u-margin-bottom--1">
            <Vet360EditModalErrorMessage
              title={title}
              error={error}
              clearErrors={clearErrors}
            />
          </div>
        )}
        {!!field && render(actionButtons, onSubmit)}
      </>
    );
  }
}
