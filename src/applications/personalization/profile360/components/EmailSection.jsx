import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';
import HeadingWithEdit from './HeadingWithEdit';
import LoadingButton from './LoadingButton';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import Transaction from './Transaction';

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


export default function EmailSection({ emailData, transaction, getTransactionStatus, field, clearErrors, isEditing, onChange, onEdit, onAdd, onCancel, onSubmit }) {
  let content = null;
  let modal = null;

  if (transaction && !transaction.isPending && !transaction.isFailed) {
    content = <Transaction transaction={transaction} getTransactionStatus={getTransactionStatus} fieldType="email"/>;
  } else {
    if (emailData && emailData.emailAddress) {
      content = emailData.emailAddress;
    } else {
      content = <button type="button" onClick={onAdd} className="va-button-link va-profile-btn">Please add your email address</button>;
    }
  }

  if (isEditing) {
    modal = (
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

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={emailData && emailData.emailAddress && !transaction && onEdit}>Email address</HeadingWithEdit>
      <div>{content}</div>
    </div>
  );
}
