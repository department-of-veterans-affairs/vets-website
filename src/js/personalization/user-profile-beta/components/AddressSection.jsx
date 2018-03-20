import React from 'react';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import Address from '../../../letters/components/Address';
import LoadingButton from './LoadingButton';

class EditAddressModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { addressResponseData: props.addressResponseData || {} };
  }

  onInput = (field, value) => {
    const addressResponseData = {
      address: {
        ...this.state.addressResponseData.address,
        [field]: value
      }
    };
    this.setState({ addressResponseData });
  }

  // Receives the field name as its first arg but that fails the liner
  onBlur = () => {}

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.addressResponseData);
  }

  render() {
    return (
      <Modal id="profile-address-modal" onClose={this.props.onClose} visible>
        <h3>{this.props.title}</h3>
        <form onSubmit={this.onSubmit}>
          <Address address={this.state.addressResponseData.address || {}} onInput={this.onInput} onBlur={this.onBlur} errorMessages={{}} countries={['USA']}/>
          <LoadingButton isLoading={this.props.isLoading}>Save Address</LoadingButton>
        </form>
      </Modal>
    );
  }
}

export default function AddressSection({ addressResponseData, title, isEditing, isLoading, onEdit, onCancel, onSubmit }) {
  let addressDisplay = <em>N/A</em>;
  let modal = null;

  if (addressResponseData) {
    const { address } = addressResponseData;
    addressDisplay = (
      <div>
        {address.addressOne}<br/>
        {address.addressTwo}
        {address.addresThree}
        {address.city}, {address.militaryStateCode} {address.zipCode}
      </div>
    );
  }

  if (isEditing) {
    modal = (
      <EditAddressModal
        title="Edit mailing address"
        addressResponseData={addressResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={onEdit}>{title}</HeadingWithEdit>
      {addressDisplay}
    </div>
  );
}
