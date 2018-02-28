import React from 'react';
import Modal from '../../common/components/Modal';
import Address from '../../letters/components/Address';

// Todo - switch to the common form components

function LoadingButton({ isLoading, children }) {
  const contents = isLoading ? <i className="fa fa-spinner fa-spin"/> : children;
  return <button disabled={isLoading} className="usa-button">{contents}</button>;
}

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

  // Receives the field name as its first arg but that fails the liner
  onBlur = () => {

  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.address);
  }

  render() {
    return (
      <Modal id="profile-address-modal" onClose={this.props.onClose} visible>
        <h3>{this.props.title}</h3>
        <form onSubmit={this.onSubmit}>
          <Address address={this.state.address} onInput={this.onInput} onBlur={this.onBlur} errorMessages={{}} countries={['USA']}/>
          <LoadingButton isLoading={this.props.isLoading}>Save Address</LoadingButton>
        </form>
      </Modal>
    );
  }
}

class EditPhoneModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = { value: props.phone.value };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const phone = { type: this.props.phone.type, value: this.state.value };
    this.props.onSubmit(phone);
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  }

  render() {
    const { title, onClose } = this.props;
    return (
      <Modal id="profile-phone-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.onChange} value={this.state.value}/>
          <LoadingButton isLoading={this.props.isLoading}>Save Phone</LoadingButton>
        </form>
      </Modal>
    );
  }
}

class EditEmailModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.value);
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  }

  render() {
    const { title, onClose } = this.props;
    return (
      <Modal id="profile-email-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        <form onSubmit={this.onSubmit}>
          <input type="email" onChange={this.onChange} value={this.state.value}/>
          <LoadingButton isLoading={this.props.isLoading}>Save Email</LoadingButton>
        </form>
      </Modal>
    );
  }
}

export { EditAddressModal, EditPhoneModal, EditEmailModal };
