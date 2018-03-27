import React from 'react';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import LoadingButton from './LoadingButton';

class EditEmailModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = this.props.emailResponseData || {};
    this.props.onChange(defaultFieldValue);
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.props.field.value);
  }

  onChange = ({ target: { value: email } }) => {
    const newFieldValue = { ...this.props.field.value, email };
    this.props.onChange(newFieldValue);
  }

  render() {
    const { title, onClose } = this.props;
    return (
      <Modal id="profile-email-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        {this.props.field && (
          <form onSubmit={this.onSubmit}>
            <input type="email" onChange={this.onChange} value={this.props.field.value.email}/>
            <LoadingButton isLoading={this.props.isLoading}>Save Email</LoadingButton>
          </form>
        )}
      </Modal>
    );
  }
}


export default function EmailSection({ emailResponseData, title, field, isEditing, isLoading, onChange, onEdit, onCancel, onSubmit }) {
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
        onChange={onChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
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
