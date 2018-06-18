import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation/Modal';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import LoadingButton from '../components/LoadingButton';
import FormActionButtons from '../components/FormActionButtons';

export default class Vet360EditModal extends React.Component {

  static propTypes = {
    getInitialFormValues: PropTypes.func.isRequired
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
    return this.props.isEmpty ? this.props.isEmpty() : !this.props.data;
  }

  isInitialized = () => {
    return this.props.isInitialized ? this.props.isInitialized() : !!this.props.field;
  }

  render() {
    const isFormReady = this.isInitialized();

    return (
      <Modal
        id="profile-phone-modal"
        onClose={this.props.onCancel}
        visible={isFormReady}>
        <h3>Edit {this.props.title}</h3>
        <form onSubmit={this.onSubmit}>
          <AlertBox
            content={<p>We’re sorry. We couldn’t update your {this.props.title.toLowerCase()}. Please try again.</p>}
            isVisible={!!this.props.error}
            status="error"
            onCloseAlert={this.props.clearErrors}/>
          {isFormReady && this.props.render()}
          <FormActionButtons
            onCancel={this.props.onCancel}
            onDelete={this.props.onDelete}
            title={this.props.title}
            deleteEnabled={!this.isEmpty()}>
            <LoadingButton isLoading={this.props.isLoading}>Update</LoadingButton>
            <button type="button" className="usa-button-secondary" onClick={this.props.onCancel}>Cancel</button>
          </FormActionButtons>
        </form>
      </Modal>
    );
  }
}
