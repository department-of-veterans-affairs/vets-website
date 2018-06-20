import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation/Modal';

import Vet360EditModalErrorMessage from '../components/Vet360EditModalErrorMessage';
import LoadingButton from '../components/LoadingButton';
import FormActionButtons from '../components/FormActionButtons';

export default class Vet360EditModal extends React.Component {

  static propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getInitialFormValues: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    transactionRequest: PropTypes.object
  };

  componentDidMount() {
    if (!this.isInitialized()) {
      this.props.onChange(this.props.getInitialFormValues());
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.field.errorMessage) return;
    this.props.onSubmit(this.props.field.value);
  }

  isEmpty = () => {
    return this.props.isEmpty ? this.props.isEmpty(this.props) : !this.props.data;
  }

  isInitialized = () => {
    return this.props.isInitialized ? this.props.isInitialized() : !!this.props.field;
  }

  render() {
    const {
      onSubmit,
      isEmpty,
      isInitialized,
      props: {
        onCancel,
        title,
        clearErrors,
        render,
        onDelete,
        transactionRequest
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
        <h3>Edit {title}</h3>
        <form onSubmit={onSubmit}>
          {error && <Vet360EditModalErrorMessage title={title} error={error} clearErrors={clearErrors}/>}
          {isFormReady && render()}
          <FormActionButtons
            onCancel={onCancel}
            onDelete={onDelete}
            title={title}
            deleteEnabled={!isEmpty()}>
            <LoadingButton isLoading={isLoading}>Update</LoadingButton>
            <button type="button" className="usa-button-secondary" onClick={onCancel}>Cancel</button>
          </FormActionButtons>
        </form>
      </Modal>
    );
  }
}
