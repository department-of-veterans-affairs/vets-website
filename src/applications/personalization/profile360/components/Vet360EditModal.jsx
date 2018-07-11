import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation/Modal';

import Vet360EditModalErrorMessage from '../components/Vet360EditModalErrorMessage';
import LoadingButton from '../components/LoadingButton';
import Vet360EditModalActionButtons from '../components/Vet360EditModalActionButtons';

export default class Vet360EditModal extends React.Component {

  static propTypes = {
    analyticsSectionName: PropTypes.string.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getInitialFormValues: PropTypes.func.isRequired,
    field: PropTypes.shape({
      value: PropTypes.object,
      validations: PropTypes.object
    }),
    hasValidationError: PropTypes.func,
    isEmpty: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transactionRequest: PropTypes.object
  };

  componentDidMount() {
    // initialize form with no fieldName and skip validation
    this.props.onChange(this.props.getInitialFormValues(), null, true);
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    // delay until next tick for onBlur to complete
    setTimeout(() => {
      if (this.hasValidationError()) return;
      this.props.onSubmit(this.props.field.value);
    }, 10);
  }

  hasValidationError() {
    if (this.props.hasValidationError) return this.props.hasValidationError();

    const validations = this.props.field.validations;
    return Object.values(validations).some(e => !!e);
  }

  isInitialized = () => {
    return this.props.isInitialized ? this.props.isInitialized() : !!this.props.field;
  }

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
        deleteDisabled
      }
    } = this;

    const isFormReady = isInitialized();
    const isLoading = transactionRequest && transactionRequest.isPending;
    const error = transactionRequest && transactionRequest.error;

    return (
      <Modal
        id="profile-phone-modal"
        onClose={onCancel}
        visible={isFormReady}>
        <h3>Edit {title.toLowerCase()}</h3>
        <form onSubmit={onSubmit}>
          {error && <Vet360EditModalErrorMessage title={title} error={error} clearErrors={clearErrors}/>}
          {isFormReady && render()}
          <br/>
          <Vet360EditModalActionButtons
            onCancel={onCancel}
            onDelete={onDelete}
            title={title}
            analyticsSectionName={analyticsSectionName}
            transactionRequest={transactionRequest}
            deleteEnabled={!isEmpty() && !deleteDisabled}>
            <LoadingButton isLoading={isLoading}>Update</LoadingButton>
            <button type="button" className="usa-button-secondary" onClick={onCancel}>Cancel</button>
          </Vet360EditModalActionButtons>
        </form>
      </Modal>
    );
  }
}
