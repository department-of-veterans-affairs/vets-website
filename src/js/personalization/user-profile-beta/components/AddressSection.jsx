import React from 'react';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import Address from '../../../letters/components/Address';
import LoadingButton from './LoadingButton';

class EditAddressModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = this.props.addressResponseData || { address: {} };
    this.props.onChange(defaultFieldValue);
  }

  onInput = (field, value) => {
    const newFieldValue = {
      address: {
        ...this.props.field.value.address,
        [field]: value
      }
    };
    this.props.onChange(newFieldValue);
  }

  // Receives the field name as its first arg but that fails the linter
  onBlur = () => {}

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.props.field.value);
  }

  render() {
    return (
      <Modal id="profile-address-modal" onClose={this.props.onClose} visible>
        <h3>{this.props.title}</h3>
        <form onSubmit={this.onSubmit}>
          {this.props.field && (
            <Address address={this.props.field.value.address} onInput={this.onInput} onBlur={this.onBlur} errorMessages={{}} countries={['USA']}/>
          )}
          <LoadingButton isLoading={this.props.isLoading}>Save Address</LoadingButton>
        </form>
      </Modal>
    );
  }
}

export default function AddressSection({ addressResponseData, title, field, isEditing, isLoading, onChange, onEdit, onCancel, onSubmit }) {
  let addressDisplay = <button type="button" onClick={onEdit} className="usa-button-secondary">Add</button>;
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
        onChange={onChange}
        field={field}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={addressResponseData && onEdit}>{title}</HeadingWithEdit>
      {addressDisplay}
    </div>
  );
}
