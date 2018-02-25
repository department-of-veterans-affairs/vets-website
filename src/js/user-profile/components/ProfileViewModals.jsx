import React from 'react';
import Modal from '../../common/components/Modal';
import Address from '../../letters/components/Address';

class EditAddressModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: { ...props.address }
    };
  }

  onInput = (field, value) => {
    const address = {
      ...this.state.address,
      [field]: value
    };
    this.setState({ address });
  }

  render() {
    return (
      <Modal id="profile-address-modal" onClose={this.props.onClose} visible>
        <h3>{this.props.title}</h3>
        <Address address={this.state.address} onInput={this.onInput} errorMessages={{}} countries={['USA']}/>
        <button type="submit" className="usa-button">Save Address</button>
      </Modal>
    );
  }
}

function EditPhoneModal({ title, value, onClose }) {
  return (
    <Modal id="profile-phone-modal" onClose={onClose} visible>
      <h3>{title}</h3>
      <input type="text" value={value}/>
      <button type="submit" className="usa-button">Save Phone</button>
    </Modal>
  );
}

function EditEmailModal({ title, value, onClose }) {
  return (
    <Modal id="profile-email-modal" onClose={onClose} visible>
      <h3>{title}</h3>
      <input type="email" value={value}/>
      <button type="submit" className="usa-button">Save Email</button>
    </Modal>
  );
}

export { EditAddressModal, EditPhoneModal, EditEmailModal };
