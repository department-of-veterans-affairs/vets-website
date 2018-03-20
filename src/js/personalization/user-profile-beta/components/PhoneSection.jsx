import React from 'react';
import PhoneNumberWidget from '../../../common/schemaform/review/PhoneNumberWidget';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import LoadingButton from './LoadingButton';

class EditPhoneModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneResponseData: { ...props.phoneResponseData }
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(phone);
  }

  onChange = ({ target: { value: number } }) => {
    const phoneResponseData = { ...this.state.phoneResponseData, number };
    this.setState({ phoneResponseData });
  }

  render() {
    const { title, onClose } = this.props;
    return (
      <Modal id="profile-phone-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.onChange} value={this.state.phoneResponseData.number}/>
          <LoadingButton isLoading={this.props.isLoading}>Save Phone</LoadingButton>
        </form>
      </Modal>
    );
  }
}


export default function PhoneSection({ phoneResponseData, title, isEditing, isLoading, onEdit, onCancel, onSubmit }) {
  let phoneDisplay = <em>N/A</em>;
  let modal = null;

  if (phoneResponseData) {
    phoneDisplay = <PhoneNumberWidget value={phoneResponseData.number}/>;
  }

  if (isEditing) {
    modal = (
      <EditPhoneModal
        title="Edit alternate phone"
        phoneResponseData={phoneResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={onEdit}>{title}</HeadingWithEdit>
      {phoneDisplay}
    </div>
  );
}
