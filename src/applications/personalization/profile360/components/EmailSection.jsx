import React from 'react';

import Modal from '@department-of-veterans-affairs/formation/Modal';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import LoadingButton from './LoadingButton';
import FormActionButtons from './FormActionButtons';

class EditEmailModal extends React.Component {

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

function renderContent({ data: emailData }) {
  return <span>{emailData.emailAddress}</span>;
}

function renderEditModal({ data: emailData, field, transactionRequest, clearErrors, onChange, onSubmit, onCancel, onDelete }) {
  return (
    <EditEmailModal
      title="email address"
      emailData={emailData}
      field={field}
      error={transactionRequest && transactionRequest.error}
      clearErrors={clearErrors}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={transactionRequest && transactionRequest.isPending}
      onCancel={onCancel}
      onDelete={onDelete}/>
  );
}

export default function Vet360Email({ title = 'email address', fieldName = 'email', analyticsSectionName = 'email' }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      renderContent={renderContent}
      renderEditModal={renderEditModal}/>
  );
}
