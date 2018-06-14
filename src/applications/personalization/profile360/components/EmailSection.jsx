import React from 'react';

import Modal from '@department-of-veterans-affairs/formation/Modal';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import LoadingButton from './LoadingButton';

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
      clearErrors
    } = this.props;

    return (
      <Modal id="profile-email-modal" onClose={onCancel} visible>
        <h3>{title}</h3>
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
            <LoadingButton isLoading={isLoading}>Update</LoadingButton>
            <button type="button" className="usa-button-secondary" onClick={onCancel}>Cancel</button>
          </form>
        )}
      </Modal>
    );
  }
}

function renderContent({ data: emailData }) {
  return <span>{emailData.emailAddress}</span>;
}

function renderEditModal({ data: emailData, field, transaction, clearErrors, onChange, onSubmit, onCancel }) {
  return (
    <EditEmailModal
      title="Edit email address"
      emailData={emailData}
      field={field}
      error={transaction && transaction.error}
      clearErrors={clearErrors}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={transaction && transaction.isPending}
      onCancel={onCancel}/>
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
