import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation/Modal';

import Vet360EditModalErrorMessage from './EditModalErrorMessage';
import LoadingButton from './LoadingButton';
import Vet360EditModalActionButtons from './EditModalActionButtons';

export default class Vet360EditModal extends React.Component {
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
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transactionRequest: PropTypes.object,
  };

  componentDidMount() {
    // initialize form with no fieldName and skip validation
    this.props.onChange(this.props.getInitialFormValues(), null, true);
  }

  componentWillUnmount() {
    // Errors returned directly from the API request (as opposed through a transaction lookup) are
    // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
    // for the next time the modal is opened by removing any existing transaction request from the store.
    if (this.props.transactionRequest && this.props.transactionRequest.error) {
      this.props.clearErrors();
    }
  }

  onSubmit = event => {
    event.preventDefault();
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    // delay until next tick for onBlur to complete
    setTimeout(() => {
      if (this.hasValidationError()) return;
      this.props.onSubmit(this.props.field.value);
    }, 10);
  };

  hasValidationError() {
    if (this.props.hasValidationError) return this.props.hasValidationError();

    const validations = this.props.field.validations;
    return Object.values(validations).some(e => !!e);
  }

  isInitialized = () =>
    this.props.isInitialized ? this.props.isInitialized() : !!this.props.field;

  render() {
    const {
      onSubmit,
      isInitialized,
      props: {
        isEmpty,
        onCancel,
        title,
        clearErrors,
        render,
        onDelete,
        transactionRequest,
        analyticsSectionName,
        deleteDisabled,
      },
    } = this;

    const isFormReady = isInitialized();
    const isLoading = transactionRequest && transactionRequest.isPending;
    const error = transactionRequest && transactionRequest.error;

    return (
      <Modal id="profile-edit-modal" onClose={onCancel} visible={isFormReady}>
        <h3>Edit {title.toLowerCase()}</h3>
        <form onSubmit={onSubmit} data-ready={isFormReady}>
          {error && (
            <Vet360EditModalErrorMessage
              title={title}
              error={error}
              clearErrors={clearErrors}
            />
          )}
          {isFormReady && render()}
          <br />
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
              className="usa-button-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </Vet360EditModalActionButtons>
        </form>
      </Modal>
    );
  }
}
