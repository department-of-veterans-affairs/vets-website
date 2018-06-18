import React from 'react';

import Modal from '@department-of-veterans-affairs/formation/Modal';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';

import LoadingButton from './LoadingButton';
import FormActionButtons from './FormActionButtons';

export default class EmailEditModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = this.props.emailData || { email: '' };
    this.props.onChange(defaultFieldValue);
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.field.errorMessage) return;
    this.props.onSubmit(this.props.field.value);
  }

  onChange = ({ value: emailAddress, dirty }) => {
    const newFieldValue = { ...this.props.field.value, emailAddress };
    this.props.onChange(newFieldValue, dirty);
  }

  render() {
    const {
      title,
      onCancel,
      isLoading,
      field,
      clearErrors,
      onDelete,
      emailData,
    } = this.props;

    return (
      <Modal id="profile-email-modal" onClose={onCancel} visible>
        <h3>Edit {title}</h3>
        <AlertBox
          isVisible={!!this.props.error}
          status="error"
          content={<p>We’re sorry. We couldn’t update your email. Please try again.</p>}
          onCloseAlert={clearErrors}/>
        {field && (
          <form onSubmit={this.onSubmit}>
            <ErrorableTextInput
              autoFocus
              label="Email Address"
              field={{ value: field.value.emailAddress, dirty: false }}
              errorMessage={field.errorMessage}
              onValueChange={this.onChange}/>
            <FormActionButtons onCancel={onCancel} onDelete={onDelete} title={title} deleteEnabled={!!(emailData && emailData.emailAddress)}>
              <LoadingButton isLoading={isLoading}>Update</LoadingButton>
              <button type="button" className="usa-button-secondary" onClick={onCancel}>Cancel</button>
            </FormActionButtons>
          </form>
        )}
      </Modal>
    );
  }
}
