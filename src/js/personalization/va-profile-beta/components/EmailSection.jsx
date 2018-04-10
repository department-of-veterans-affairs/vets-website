import React from 'react';
import Modal from '../../../common/components/Modal';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import HeadingWithEdit from './HeadingWithEdit';
import LoadingButton from './LoadingButton';
import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';

class EditEmailModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = this.props.emailResponseData || { email: '' };
    this.props.onChange(defaultFieldValue);
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.field.errorMessage) return;
    this.props.onSubmit(this.props.field.value);
  }

  onChange = ({ value: email, dirty }) => {
    const newFieldValue = { ...this.props.field.value, email };
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
              field={{ value: field.value.email, dirty: false }}
              errorMessage={field.errorMessage}
              onValueChange={this.onChange}/>
            <LoadingButton isLoading={isLoading}>Save Email</LoadingButton>
          </form>
        )}
      </Modal>
    );
  }
}


export default function EmailSection({ emailResponseData, title, field, error, clearErrors, isEditing, isLoading, onChange, onEdit, onCancel, onSubmit }) {
  let emailDisplay = <button type="button" onClick={onEdit} className="usa-button usa-button-secondary">Add</button>;
  let modal = null;

  if (emailResponseData) {
    emailDisplay = emailResponseData.email;
  }

  if (isEditing) {
    modal = (
      <EditEmailModal
        title="Edit email"
        emailResponseData={emailResponseData}
        field={field}
        error={error}
        clearErrors={clearErrors}
        onChange={onChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={emailResponseData && onEdit}>{title}</HeadingWithEdit>
      <div>{emailDisplay}</div>
    </div>
  );
}
