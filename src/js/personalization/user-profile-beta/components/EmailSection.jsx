import React from 'react';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import LoadingButton from './LoadingButton';

class EditEmailModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = { emailResponseData: props.emailResponseData };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.emailResponseData);
  }

  onChange = ({ target: { value } }) => {
    const emailResponseData = { ...this.state.emailResponseData, email: value };
    this.setState({ emailResponseData });
  }

  render() {
    const { title, onClose } = this.props;
    return (
      <Modal id="profile-email-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        <form onSubmit={this.onSubmit}>
          <input type="email" onChange={this.onChange} value={this.state.emailResponseData.email}/>
          <LoadingButton isLoading={this.props.isLoading}>Save Email</LoadingButton>
        </form>
      </Modal>
    );
  }
}


export default function EmailSection({ emailResponseData, title, isEditing, isLoading, onEdit, onCancel, onSubmit }) {
  let emailDisplay = <em>N/A</em>;
  let modal = null;

  if (emailResponseData) {
    emailDisplay = emailResponseData.email;
  }

  if (isEditing) {
    modal = (
      <EditEmailModal
        title="Edit email"
        emailResponseData={emailResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={onEdit}>{title}</HeadingWithEdit>
      <div>{emailDisplay}</div>
    </div>
  );
}
